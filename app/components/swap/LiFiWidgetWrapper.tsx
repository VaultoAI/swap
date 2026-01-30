'use client';

import { useEffect, useState, useRef } from 'react';
import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';
import { ClientOnly } from './ClientOnly';
import { useAccount } from 'wagmi';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

// Solana constants
// Note: TokenSearch uses 101, but LiFi uses 1151111081099710 for Solana
const SOLANA_USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOLANA_CHAIN_ID_TOKENSEARCH = 101; // What TokenSearch dispatches
const SOLANA_CHAIN_ID_LIFI = 1151111081099710; // What LiFi expects

// Ethereum constants
const ETHEREUM_USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const ETHEREUM_CHAIN_ID = 1;

export default function LiFiWidgetWrapper() {
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  
  // FormRef to control the widget programmatically
  const formRef = useRef<any>(null);
  
  const config: Partial<WidgetConfig> = {
    buildUrl: true, // Enable URL updates for form changes
    variant: 'wide',
    appearance: 'dark',
    theme: {
      colorSchemes: {
        light: {
          palette: {
            primary: {
              main: '#5C67FF',
            },
            secondary: {
              main: '#F7C2FF',
            },
          },
        },
        dark: {
          palette: {
            primary: {
              main: '#ffc800',
            },
            secondary: {
              main: '#fff700',
            },
            background: {
              default: '#292929',
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
    },
    // Initialize with USDC to NVDA (NVDAon) on Ethereum mainnet, $100 amount
    fromChain: ETHEREUM_CHAIN_ID,
    toChain: ETHEREUM_CHAIN_ID,
    fromToken: ETHEREUM_USDC,
    toToken: '0x2d1f7226bd1f780af6b9a49dcc0ae00e8df4bdee',
    fromAmount: '100',
  };

  // Handle token selection from search bar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleTokenSelect = (event: CustomEvent<{ token: Token; type: 'sell' | 'buy' }>) => {
      const { token, type } = event.detail;
      console.log('LiFi: Token selected:', { symbol: token.symbol, type, address: token.address, chainId: token.chainId });

      // Check if formRef is ready
      if (!formRef.current) {
        console.warn('LiFi formRef not ready yet');
        return;
      }

      // Check if selected token is a private stock (Solana - chainId 101 from TokenSearch)
      const isPrivateStock = token.chainId === SOLANA_CHAIN_ID_TOKENSEARCH;
      // Check if selected token is a public tokenized stock (Ethereum mainnet - chainId 1)
      const isPublicTokenizedStock = token.chainId === ETHEREUM_CHAIN_ID && token.address.toLowerCase() !== ETHEREUM_USDC.toLowerCase();

      if (type === 'sell') {
        // Update "from" side using formRef with setUrlSearchParam
        formRef.current.setFieldValue('fromChain', token.chainId, { setUrlSearchParam: true });
        formRef.current.setFieldValue('fromToken', token.address, { setUrlSearchParam: true });
      } else {
        // When selecting a "buy" token
        if (isPrivateStock) {
          // If it's a private stock, force Solana USDC as "from" token
          console.log('Private stock selected, switching to Solana with USDC', {
            fromChain: SOLANA_CHAIN_ID_LIFI,
            fromToken: SOLANA_USDC,
            toChain: SOLANA_CHAIN_ID_LIFI,
            toToken: token.address,
            tokenSymbol: token.symbol
          });
          formRef.current.setFieldValue('fromChain', SOLANA_CHAIN_ID_LIFI, { setUrlSearchParam: true });
          formRef.current.setFieldValue('fromToken', SOLANA_USDC, { setUrlSearchParam: true });
          formRef.current.setFieldValue('toChain', SOLANA_CHAIN_ID_LIFI, { setUrlSearchParam: true });
          formRef.current.setFieldValue('toToken', token.address, { setUrlSearchParam: true });
        } else if (isPublicTokenizedStock) {
          // If it's a public tokenized stock, force Ethereum USDC as "from" token
          console.log('Public tokenized stock selected, setting USDC as input', {
            fromChain: ETHEREUM_CHAIN_ID,
            fromToken: ETHEREUM_USDC,
            toChain: ETHEREUM_CHAIN_ID,
            toToken: token.address
          });
          formRef.current.setFieldValue('fromChain', ETHEREUM_CHAIN_ID, { setUrlSearchParam: true });
          formRef.current.setFieldValue('fromToken', ETHEREUM_USDC, { setUrlSearchParam: true });
          formRef.current.setFieldValue('toChain', ETHEREUM_CHAIN_ID, { setUrlSearchParam: true });
          formRef.current.setFieldValue('toToken', token.address, { setUrlSearchParam: true });
        } else {
          // Regular token selection - only update destination
          formRef.current.setFieldValue('toChain', token.chainId, { setUrlSearchParam: true });
          formRef.current.setFieldValue('toToken', token.address, { setUrlSearchParam: true });
        }
      }
    };

    window.addEventListener('tokenSelect' as any, handleTokenSelect as EventListener);
    
    return () => {
      window.removeEventListener('tokenSelect' as any, handleTokenSelect as EventListener);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <ClientOnly fallback={<WidgetSkeleton config={config} />}>
        <LiFiWidget config={config} integrator="vaulto-swap" formRef={formRef} />
      </ClientOnly>
    </div>
  );
}
