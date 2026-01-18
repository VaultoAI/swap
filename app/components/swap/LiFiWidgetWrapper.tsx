"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import type { WidgetConfig, FormState } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';
import { useChainId, useAccount, useConnectorClient } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  trackSwapWidgetLoaded,
  trackTokenSelected,
  trackSwapAmountChanged,
  trackSwapInitiated,
  trackSwapCompleted,
  trackSwapFailed,
  trackChainChanged,
} from '@/lib/utils/analytics';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

interface LiFiWidgetWrapperProps {
  onTokenSelect?: (token: Token, type: 'sell' | 'buy') => void;
}

export default function LiFiWidgetWrapper({ onTokenSelect }: LiFiWidgetWrapperProps = {}) {
  const chainId = useChainId();
  const { isConnected, address, connector } = useAccount();
  const { data: connectorClient } = useConnectorClient();
  const { openConnectModal } = useConnectModal();
  const [isMounted, setIsMounted] = useState(false);
  const prevChainIdRef = useRef<number | null>(null);
  const widgetLoadedRef = useRef(false);
  const formRef = useRef<FormState>(null);
  
  // Solana wallet hooks
  const solanaWallet = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();

  // Track window width for responsive widget sizing
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  // Mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track widget load
  useEffect(() => {
    if (isMounted && !widgetLoadedRef.current) {
      trackSwapWidgetLoaded(chainId);
      widgetLoadedRef.current = true;
    }
  }, [isMounted, chainId]);

  // Track chain changes
  useEffect(() => {
    if (prevChainIdRef.current !== null && prevChainIdRef.current !== chainId) {
      trackChainChanged(prevChainIdRef.current, chainId);
    }
    prevChainIdRef.current = chainId;
  }, [chainId]);

  // Track window width for responsive design
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Handle token selection from header search
  const handleTokenSelect = useCallback((token: Token, type: 'sell' | 'buy') => {
    console.log('LiFi: Token selected:', { token: token.symbol, type, address: token.address });
    
    if (!formRef.current || !token.address) return;

    try {
      // Map token type to Li.Fi field names
      // 'sell' = fromToken, 'buy' = toToken
      const fieldName = type === 'sell' ? 'fromToken' : 'toToken';
      const chainFieldName = type === 'sell' ? 'fromChain' : 'toChain';
      
      // Set the chain first
      formRef.current.setFieldValue(chainFieldName, token.chainId, { setUrlSearchParam: true });
      
      // Then set the token
      formRef.current.setFieldValue(fieldName, token.address, { setUrlSearchParam: true });
      
      trackTokenSelected(type, token.symbol, token.address, token.chainId);
      
      console.log('LiFi: Token set successfully:', { fieldName, address: token.address, chainId: token.chainId });
    } catch (error) {
      console.error('LiFi: Error setting token:', error);
    }
  }, []);

  // Expose handler via ref for parent access
  const tokenSelectHandlerRef = useRef(handleTokenSelect);
  useEffect(() => {
    tokenSelectHandlerRef.current = handleTokenSelect;
  }, [handleTokenSelect]);

  // Expose handler to window for TokenSearch component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__handleTokenSelect = (token: Token, type: 'sell' | 'buy') => {
        console.log('LiFi: Token selection handler called:', { symbol: token.symbol, type });
        tokenSelectHandlerRef.current(token, type);
      };
      console.log('LiFi: Token selection handler registered on window');
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__handleTokenSelect;
        console.log('LiFi: Token selection handler removed from window');
      }
    };
  }, []);

  // Calculate responsive width
  const widgetWidth = useMemo(() => {
    if (typeof window !== 'undefined' && windowWidth !== null && windowWidth < 768) {
      // Mobile: viewport width - 32px (accounts for parent px-4 padding)
      return `${windowWidth - 32}px`;
    }
    return '392px'; // Desktop: fixed width
  }, [windowWidth]);

  // Li.Fi Widget Configuration
  const widgetConfig = useMemo(() => ({
    variant: 'compact' as const,
    subvariant: 'default' as const,
    appearance: 'light' as const,
    
    // Set initial tokens - USDC to NVDA
    fromChain: chainId || 1,
    toChain: chainId || 1,
    fromToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
    toToken: '0x2d1f7226bd1f780af6b9a49dcc0ae00e8df4bdee', // NVDAon on Ethereum
    fromAmount: '100',
    
    // SDK Configuration with Route Options
    sdkConfig: {
      routeOptions: {
        maxPriceImpact: 1.0,        // Allow up to 100% price impact for tokenized stocks
        slippage: 0.03,              // 3% slippage tolerance
        allowSwitchChain: true,      // Enable cross-chain routes
        allowDestinationCall: true,  // Enable destination calls for more route options
        order: 'CHEAPEST' as const,  // Prioritize cheapest routes
        exchanges: {
          allow: ['all'],            // Allow all exchanges
        },
        bridges: {
          allow: ['all'],            // Allow all bridges
        },
      },
    },
    
    // Theme configuration matching provided styling
    theme: {
      colorSchemes: {
        light: {
          palette: {
            primary: {
              main: '#d4a515',
            },
            secondary: {
              main: '#ffcc00',
            },
            background: {
              default: '#1f2937',
              paper: '#121821',
            },
            grey: {
              200: '#111821',
              300: '#111821',
            },
            text: {
              primary: '#ffffff',
              secondary: '#ffffff',
            },
            common: {
              black: '#000000',
            },
          },
        },
        dark: {
          palette: {
            primary: {
              main: '#5C67FF',
            },
            secondary: {
              main: '#F7C2FF',
            },
          },
        },
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
      },
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
      shape: {
        borderRadiusSecondary: 8,
      },
    } as any,
    
    // Wallet configuration
    walletConfig: {
      onConnect: () => {
        console.log('LiFi: Connect wallet triggered');
        // Trigger appropriate wallet modal based on context
        // For EVM chains, use RainbowKit
        if (openConnectModal) {
          openConnectModal();
        }
        // For Solana, use Solana wallet modal
        if (setSolanaModalVisible) {
          setSolanaModalVisible(true);
        }
      },
    },
    
    // Custom token list - port from CowSwap
    // This will be populated with all the tokenized stocks
    tokens: {
      featured: [
      // Major stablecoins
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png',
      },
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/325/large/tether.png',
      },
      {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/9956/large/dai-multi-collateral-mcd.png',
      },
      
      // Tokenized Stocks - ETFs
      {
        address: '0xfedc5f4a6c38211c1338aa411018dfaf26612c08',
        symbol: 'SPYon',
        name: 'SPDR S&P 500 ETF Trust',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68655/large/spyon_160x160.png',
      },
      {
        address: '0x62ca254a363dc3c748e7e955c20447ab5bf06ff7',
        symbol: 'IVVon',
        name: 'iShares Core S&P 500 ETF',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68650/large/ivvon_160x160.png',
      },
      {
        address: '0x0e397938c1aa0680954093495b70a9f5e2249aba',
        symbol: 'QQQon',
        name: 'Invesco QQQ Trust',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68654/large/qqqon_160x160.png',
      },
      {
        address: '0x992651bfeb9a0dcc4457610e284ba66d86489d4d',
        symbol: 'TLTon',
        name: 'iShares 20+ Year Treasury Bond ETF',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68647/large/tlton_160x160.png',
      },
      
      // Tech Stocks
      {
        address: '0x2d1f7226bd1f780af6b9a49dcc0ae00e8df4bdee',
        symbol: 'NVDAon',
        name: 'NVIDIA Corp',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68623/large/nvdaon_160x160.png',
      },
      {
        address: '0x14c3abf95cb9c93a8b82c1cdcb76d72cb87b2d4c',
        symbol: 'AAPLon',
        name: 'Apple Inc.',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68616/large/aaplon_160x160.png',
      },
      {
        address: '0xb812837b81a3a6b81d7cd74cfb19a7f2784555e5',
        symbol: 'MSFTon',
        name: 'Microsoft Corporation',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68625/large/msfton_160x160.png',
      },
      {
        address: '0xbb8774fb97436d23d74c1b882e8e9a69322cfd31',
        symbol: 'AMZNon',
        name: 'Amazon.com, Inc.',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68604/large/amznon_160x160.png',
      },
      {
        address: '0xba47214edd2bb43099611b208f75e4b42fdcfedc',
        symbol: 'GOOGLon',
        name: 'Alphabet Inc. Class A',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68606/large/googlon_160x160.png',
      },
      {
        address: '0x59644165402b611b350645555b50afb581c71eb2',
        symbol: 'METAon',
        name: 'Meta Platforms, Inc.',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68645/large/metaon_160x160.png',
      },
      {
        address: '0xf6b1117ec07684d3958cad8beb1b302bfd21103f',
        symbol: 'TSLAon',
        name: 'Tesla Inc.',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68628/large/tslaon_160x160.png',
      },
      {
        address: '0x0c1f3412a44ff99e40bf14e06e5ea321ae7b3938',
        symbol: 'AMDon',
        name: 'Advanced Micro Devices, Inc.',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68589/large/amdon_160x160.png',
      },
      {
        address: '0xfda09936dbd717368de0835ba441d9e62069d36f',
        symbol: 'INTCon',
        name: 'Intel Corp',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68557/large/intcon_160x160.png',
      },
      
      // Additional major stocks (adding more from the CowSwap list)
      {
        address: '0x03c1ec4ca9dbb168e6db0def827c085999cbffaf',
        symbol: 'JPMon',
        name: 'JPMorgan Chase & Co.',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68602/large/jpmon_160x160.png',
      },
      {
        address: '0xac37c20c1d0e5285035e056101a64e263ff94a41',
        symbol: 'Von',
        name: 'Visa Inc. Class A',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68626/large/von_160x160.png',
      },
      {
        address: '0x82106347ddbb23ce44cf4ce4053ef1adf8b9323b',
        symbol: 'WMTon',
        name: 'Walmart Inc.',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68582/large/wmton_160x160.png',
      },
      {
        address: '0x4c82c8cd9a218612dce60b156b73a36705645e3b',
        symbol: 'MCDon',
        name: "McDonald's Corporation",
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68620/large/mcdon_160x160.png',
      },
      {
        address: '0x74a03d741226f738098c35da8188e57aca50d146',
        symbol: 'KOon',
        name: 'The Coca-Cola Company',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68569/large/koon_160x160.png',
      },
      {
        address: '0x3ce219d498d807317f840f4cb0f03fa27dd65046',
        symbol: 'PEPon',
        name: 'PepsiCo, Inc.',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68588/large/pepon_160x160.png',
      },
      {
        address: '0x032dec3372f25c41ea8054b4987a7c4832cdb338',
        symbol: 'NFLXon',
        name: 'Netflix',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68649/large/nflxon_160x160.png',
      },
      {
        address: '0xc3d93b45249e8e06cfeb01d25a96337e8893265d',
        symbol: 'DISon',
        name: 'Disney',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68587/large/dison_160x160.png',
      },
      // Healthcare & Pharma
      {
        address: '0xf192957ae52db3eb088654403cc2eded014ae556',
        symbol: 'LLYon',
        name: 'Eli Lilly and Company',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68643/large/llyon_160x160.png',
      },
      {
        address: '0x075756f3b6381a79633438faa8964946bf40163d',
        symbol: 'UNHon',
        name: 'UnitedHealth Group',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68624/large/unhon_160x160.png',
      },
      {
        address: '0x06954faa913fa14c28eb1b2e459594f22f33f3de',
        symbol: 'PFEon',
        name: 'Pfizer Inc.',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68549/large/pfeon_160x160.png',
      },
      {
        address: '0x3859385363f7bb4dfe42811ccf3f294fcd41dd1d',
        symbol: 'ABTon',
        name: 'Abbott Laboratories',
        decimals: 18,
        chainId: 1,
        logoURI: 'https://coin-images.coingecko.com/coins/images/68552/large/abton_160x160.png',
      },
      ],
    },
    
    // Build URL to enable state persistence
    buildUrl: true,
    
    // Partner fee configuration (same as CowSwap)
    fee: 0.005, // 0.5% fee
    
    // Enable container styling
    containerStyle: {
      width: widgetWidth,
      height: '500px',
      borderRadius: '16px',
    },
  }), [chainId, widgetWidth, openConnectModal, setSolanaModalVisible]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="w-full flex items-center justify-center min-h-[500px] relative">
        {/* Container for both background shape and widget */}
        <div className="relative w-full md:w-[392px] min-h-[500px]">
          {/* Background element behind widget with rounded corners */}
          <div 
            className="absolute rounded-2xl left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0"
            style={{
              width: 'calc(100vw - 2rem)', // Mobile: viewport width minus padding
              maxWidth: '392px', // Desktop: fixed width
              height: '500px',
              top: '0',
              backgroundColor: 'rgb(32, 44, 60)', // Dark background
              zIndex: 0,
            }}
          />
          
          {/* Widget container */}
          <div 
            className="absolute z-10 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 overflow-hidden rounded-2xl"
            style={{
              width: 'calc(100vw - 2rem)',
              maxWidth: '392px',
            }}
          >
            <LiFiWidget
              integrator="Vaulto Swap"
              config={widgetConfig}
              formRef={formRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
