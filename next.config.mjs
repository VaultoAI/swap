import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/Uniswap/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/trustwallet/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'token-icons.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
      },
      {
        protocol: 'https',
        hostname: 'vaulto.dev',
      },
      {
        protocol: 'https',
        hostname: '*.vaulto.dev',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['wagmi'],
  },
  webpack: (config, { isServer, webpack }) => {
    // Externalize yahoo-finance2 for server-side only
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('yahoo-finance2');
    }
    
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false, 
      net: false, 
      tls: false,
      '@react-native-async-storage/async-storage': false
    };
    
    // Replace React Native async-storage with an empty stub to prevent build errors
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^@react-native-async-storage\/async-storage$/,
        path.resolve(__dirname, 'webpack-stubs/async-storage-stub.js')
      )
    );
    
    // Ignore React Native modules during build
    if (!config.ignoreWarnings) {
      config.ignoreWarnings = [];
    }
    config.ignoreWarnings.push(
      { module: /@react-native-async-storage\/async-storage/ },
      { message: /Cannot find module '@react-native-async-storage\/async-storage'/ }
    );
    
    // Optimize bundle splitting - simplified to avoid module resolution issues
    if (!isServer && config.optimization && config.optimization.splitChunks && config.optimization.splitChunks !== false) {
      if (!config.optimization.splitChunks.cacheGroups) {
        config.optimization.splitChunks.cacheGroups = {};
      }
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        wagmi: {
          test: /[\\/]node_modules[\\/](wagmi|viem)[\\/]/,
          name: 'wagmi',
          chunks: 'all',
          priority: 20,
        },
      };
    }
    
    return config;
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/favicon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*.(png|jpg|jpeg|gif|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
    ];
  },
};

export default nextConfig;