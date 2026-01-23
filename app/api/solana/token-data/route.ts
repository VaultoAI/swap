import { NextRequest, NextResponse } from 'next/server';
import { fetchTokenPriceByAddress } from '@/lib/api/coingecko';
import { getTokenMetadata, getStockTicker, isTokenizedStock } from '@/lib/utils/token';
import * as cheerio from 'cheerio';

export interface SolanaTokenDataResponse {
  chainId: number;
  tokens: Array<{
    address: string;
    tvlUSD?: number;
    volumeUSD: number; // 24h volume
    marketCap?: number;
    marketCapFormatted?: string; // Formatted market cap from Jupiter (e.g., "$472B")
    priceChange24h?: number; // 24h price change percentage
  }>;
  error?: string;
}

/**
 * Format market cap number to Jupiter's format (e.g., $472B)
 */
function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(0)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(0)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Fetch market cap from Jupiter token page HTML
 * DISABLED: Jupiter integration removed from frontend
 */
async function fetchJupiterMarketCap(tokenAddress: string): Promise<string | null> {
  // Jupiter integration disabled - return null
  return null;
}

/**
 * Fetch liquidity data from Jupiter API
 * DISABLED: Jupiter integration removed from frontend
 */
async function fetchJupiterLiquidity(tokenAddress: string): Promise<number | null> {
  // Jupiter integration disabled - return null
  return null;
}

/**
 * POST /api/solana/token-data
 * 
 * Fetches liquidity and marketcap data for Solana tokens.
 * 
 * Request body:
 * {
 *   addresses: string[]  // Array of Solana token addresses
 * }
 * 
 * Response:
 * {
 *   chainId: 101,
 *   tokens: Array<{ address, tvlUSD?, volumeUSD, marketCap? }>,
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addresses } = body;

    // Validate request body
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return NextResponse.json<SolanaTokenDataResponse>(
        {
          chainId: 101,
          tokens: [],
          error: 'Invalid addresses. Must be a non-empty array of token addresses.',
        },
        { status: 400 }
      );
    }

    // Validate all addresses are strings
    if (!addresses.every((addr) => typeof addr === 'string' && addr.trim().length > 0)) {
      return NextResponse.json<SolanaTokenDataResponse>(
        {
          chainId: 101,
          tokens: [],
          error: 'All addresses must be non-empty strings.',
        },
        { status: 400 }
      );
    }

    // Fetch data for all tokens in parallel
    const tokensWithData = await Promise.all(
      addresses.map(async (address: string) => {
        try {
          // Fetch liquidity from Jupiter (primary source for TVL)
          const jupiterLiquidity = await fetchJupiterLiquidity(address);
          
          // Fetch market cap from Jupiter HTML (prioritized for private tokens)
          const jupiterMarketCapFormatted = await fetchJupiterMarketCap(address);
          
          // Fetch CoinGecko data for volume (24h trading volume)
          const coingeckoData = await fetchTokenPriceByAddress(101, address);

          // Build response with liquidity from Jupiter and volume from CoinGecko
          const result: { address: string; tvlUSD?: number; volumeUSD: number; marketCap?: number; marketCapFormatted?: string; priceChange24h?: number } = {
            address,
            volumeUSD: coingeckoData?.total_volume || 0,
          };

          // Add liquidity from Jupiter if available
          if (jupiterLiquidity !== null && jupiterLiquidity > 0) {
            result.tvlUSD = jupiterLiquidity;
          }

          // Prioritize Jupiter's formatted market cap, fall back to CoinGecko
          if (jupiterMarketCapFormatted) {
            result.marketCapFormatted = jupiterMarketCapFormatted;
          } else if (coingeckoData?.market_cap) {
            result.marketCap = coingeckoData.market_cap;
          }

          // Add 24h price change from CoinGecko
          let priceChange24h = coingeckoData?.price_change_percentage_24h;
          
          // Fallback to yfinance for tokenized stocks if CoinGecko didn't return a valid percentage change
          if ((priceChange24h === undefined || priceChange24h === null || isNaN(priceChange24h)) && address) {
            try {
              const tokenMetadata = getTokenMetadata(address);
              if (tokenMetadata && isTokenizedStock(tokenMetadata.token)) {
                const ticker = getStockTicker(tokenMetadata.token);
                if (ticker) {
                  // Fetch from yfinance using yahoo-finance2
                  let yahooFinance: any;
                  try {
                    yahooFinance = await import('yahoo-finance2');
                    const yf = yahooFinance.default || yahooFinance;
                    const quote = await yf.quote(ticker);
                    
                    if (quote) {
                      const yfinancePctChange = quote.regularMarketChangePercent || quote.changePercent;
                      if (typeof yfinancePctChange === 'number' && !isNaN(yfinancePctChange)) {
                        priceChange24h = yfinancePctChange;
                      }
                    }
                  } catch (yfinanceError) {
                    console.debug(`Failed to fetch yfinance price change for ${address} (${ticker}):`, yfinanceError);
                    // Continue with undefined priceChange24h
                  }
                }
              }
            } catch (error) {
              console.debug(`Failed to check token metadata for ${address}:`, error);
              // Continue with undefined priceChange24h
            }
          }
          
          if (priceChange24h !== undefined && priceChange24h !== null && !isNaN(priceChange24h)) {
            result.priceChange24h = priceChange24h;
          }

          return result;
        } catch (error) {
          console.error(`Error fetching data for Solana token ${address}:`, error);
          // Return token with zero values on error
          return {
            address,
            volumeUSD: 0,
          };
        }
      })
    );

    return NextResponse.json<SolanaTokenDataResponse>(
      {
        chainId: 101,
        tokens: tokensWithData,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in Solana token-data API route:', error);
    return NextResponse.json<SolanaTokenDataResponse>(
      {
        chainId: 101,
        tokens: [],
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

