"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useChainId } from "wagmi";
import { useEffect, useState } from "react";
import { trackWalletConnectClick } from "@/lib/utils/analytics";
import TokenSearch from "./components/TokenSearch";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Dynamically import the Li.Fi widget to prevent SSR issues
const LiFiWidgetWrapper = dynamic(
  () => import("./components/swap/LiFiWidgetWrapper"),
  { 
    ssr: false
  }
);


// Wallet button component - uses RainbowKit
function WalletButton() {
  return (
    <div onClick={() => trackWalletConnectClick()}>
      <ConnectButton 
        chainStatus="icon"
        showBalance={false}
      />
    </div>
  );
}

export default function Home() {
  const chainId = useChainId();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-black flex flex-col md:block md:overflow-y-auto">
      <main className="relative flex-1 flex flex-col md:block">
      {/* Hero Section - Fixed at viewport height on desktop */}
      <div className="relative min-h-screen md:h-screen md:overflow-hidden bg-black md:bg-gradient-to-br md:from-black md:via-gray-900 md:to-black flex flex-col">
      {/* Subtle Gold Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-left gold glow */}
        <div className="absolute -top-32 -left-32 w-[800px] h-[800px] animate-[float_20s_ease-in-out_infinite]">
          <div className="w-full h-full bg-gradient-to-br from-yellow-400/20 via-yellow-300/15 to-transparent blur-3xl"></div>
        </div>
        
        {/* Top-right gold glow */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] animate-[float_25s_ease-in-out_infinite_reverse]">
          <div className="w-full h-full bg-gradient-to-bl from-yellow-300/18 via-yellow-400/12 to-transparent blur-3xl"></div>
        </div>
        
        {/* Bottom center gold shimmer */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] animate-[pulse_30s_ease-in-out_infinite]">
          <div className="w-full h-full bg-gradient-to-t from-yellow-500/20 via-yellow-300/12 to-transparent blur-3xl"></div>
        </div>
        
        {/* Bottom-right purple glow - hidden on mobile to prevent showing below footer */}
        <div className="absolute -bottom-32 -right-32 w-[800px] h-[800px] animate-[float_22s_ease-in-out_infinite] hidden md:block">
          <div className="w-full h-full bg-gradient-to-tl from-purple-500/35 via-purple-400/25 to-transparent blur-3xl"></div>
        </div>
      </div>
      {/* Mobile Gold Banner - Join our Community */}
      <div className="block md:hidden left-0 right-0 z-[60] w-full">
        <a
          href="https://discord.gg/wxXsxm7GGb"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black text-sm font-semibold py-2.5 px-4 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-yellow-500/25"
          aria-label="Join our Discord community"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Join our Community
        </a>
      </div>
      {/* Header - Sticky on desktop only */}
      <header className="md:sticky md:top-0 left-0 right-0 z-50 backdrop-blur-sm pt-2 w-full bg-transparent border-transparent" role="banner">
        <div className="container mx-auto px-4 py-3 md:py-3 relative">
          {/* Desktop Header Layout */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-6 flex-shrink-0">
              {/* Desktop Logo */}
              <Image 
                src="/logo.png" 
                alt="Vaulto Swap" 
                width={120} 
                height={40}
                className="object-contain w-24 h-auto"
                priority
              />
              <nav aria-label="Main navigation">
                <ul className="flex items-center gap-4">
                  <li>
                    <a 
                      href="https://search.vaulto.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Search
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://docs.vaulto.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Docs
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            
            {/* Right side: Connect Wallet Button */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Connect Wallet Button */}
              <WalletButton />
            </div>
          </div>
          
          {/* Desktop Token Search Bar - Centered in header */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-md px-4 pointer-events-none">
            <div className="flex justify-center pointer-events-auto">
              <TokenSearch chainId={chainId} onDropdownToggle={setIsSearchDropdownOpen} />
            </div>
          </div>
          
          {/* Join our Community Tab - Positioned below search bar */}
          {!isSearchDropdownOpen && (
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-[calc(50%+1.25rem)] w-full max-w-md px-4 pointer-events-none">
            <div className="flex justify-center pointer-events-auto">
              <a
                href="https://discord.gg/wxXsxm7GGb"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black text-xs font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-yellow-500/25 whitespace-nowrap flex items-center gap-1.5"
                aria-label="Join our Discord community"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join our Community
              </a>
            </div>
          </div>
          )}

          {/* Mobile Header Layout */}
          <div className="block md:hidden space-y-3">
            {/* Top row: Logo and Wallet Button */}
            <div className="flex items-center justify-between gap-3">
              <Image
                src="/mobilelogo.png"
                alt="Vaulto Swap"
                width={48}
                height={48}
                className="object-contain w-12 h-12 flex-shrink-0"
                priority
              />
              <div className="flex-shrink-0">
                <WalletButton />
              </div>
            </div>
            
            {/* Second row: Search Bar */}
            <div className="w-full">
              <TokenSearch chainId={chainId} />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center flex-1 md:h-full pt-8 md:pt-16 pb-8">
        <section aria-label="Token swap interface" className="w-full max-w-md mx-auto">
          <h1 className="sr-only">Vaulto Swap - Trade Tokenized Stocks with Stablecoins</h1>
          
          {/* LiFi Widget Centered */}
          <div className="w-full">
            <LiFiWidgetWrapper />
          </div>
        </section>
      </div>
      </div>
      {/* End Hero Section */}

        {/* Private Markets Section */}
        <section className="relative z-10 w-full bg-black pt-16 sm:pt-20 md:pt-24 pb-20 md:pb-0 overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Social Media Icons - Mobile only, above Private Markets text */}
            <div className="flex items-center justify-center gap-4 mb-6 md:hidden">
              {/* Twitter */}
              <a 
                href="https://twitter.com/vaultoai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-yellow-300 transition-colors duration-200 rounded-lg hover:bg-yellow-400/15 shadow-sm hover:shadow-yellow-400/20"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://instagram.com/vaultoai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-yellow-300 transition-colors duration-200 rounded-lg hover:bg-yellow-400/15 shadow-sm hover:shadow-yellow-400/20"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/company/vaulto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-yellow-300 transition-colors duration-200 rounded-lg hover:bg-yellow-400/15 shadow-sm hover:shadow-yellow-400/20"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@VaultoAI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-yellow-300 transition-colors duration-200 rounded-lg hover:bg-yellow-400/15 shadow-sm hover:shadow-yellow-400/20"
                aria-label="Subscribe to our YouTube channel"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              
              {/* Discord */}
              <a 
                href="https://discord.gg/wxXsxm7GGb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-yellow-300 transition-colors duration-200 rounded-lg hover:bg-yellow-400/15 shadow-sm hover:shadow-yellow-400/20"
                aria-label="Join our Discord server"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>

            {/* Section Header */}
            <div className="text-center px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 via-yellow-500 to-yellow-400 mb-2 sm:mb-3 drop-shadow-lg" style={{textShadow: '0 0 15px rgba(255, 215, 0, 0.2)'}}>
                Private Markets, Public Access
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-3 sm:mb-4">
                Unlock institutional-grade investment opportunities through tokenized securities
              </p>
              
              {/* Email Signup - Desktop only */}
              <div className="hidden md:block max-w-md mx-auto relative z-10">
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const email = formData.get('EMAIL') as string;
                    
                    try {
                      await fetch('https://vaulto.us15.list-manage.com/subscribe/post?u=4e3f80ec414b40367852952ec&id=dc4af6dff9&f_id=00728ce0f0', {
                        method: 'POST',
                        mode: 'no-cors',
                        body: formData
                      });
                      
                      // Show success message
                      const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                      const originalText = button.textContent;
                      button.textContent = 'Subscribed!';
                      button.className = 'px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg transition-colors duration-200';
                      
                      // Reset after 3 seconds
                      setTimeout(() => {
                        button.textContent = originalText;
                        button.className = 'px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold rounded-lg transition-colors duration-200';
                        form.reset();
                      }, 3000);
                    } catch (error) {
                      console.error('Subscription error:', error);
                    }
                  }}
                  noValidate
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    name="EMAIL"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-yellow-400/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300 relative z-10 shadow-sm shadow-yellow-400/10"
                    style={{ pointerEvents: 'auto' }}
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-yellow-500/25"
                  >
                    Notify Me
                  </button>
                  {/* Hidden fields for Mailchimp */}
                  <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
                    <input type="text" name="b_4e3f80ec414b40367852952ec_dc4af6dff9" tabIndex={-1} defaultValue="" />
                  </div>
                </form>
              </div>
            </div>

            {/* Private Markets Image */}
            <div className="flex justify-center -mt-20 sm:-mt-24 md:-mt-32 lg:-mt-40 xl:-mt-48 -mb-32 sm:-mb-40 md:-mb-48 lg:-mb-56 xl:-mb-64">
              <Image
                src="/private.avif"
                alt="Private Markets Access"
                width={800}
                height={800}
                className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl h-auto"
                priority
              />
            </div>
            
            {/* Disclaimer */}
            <div className="w-full max-w-4xl mx-auto px-4 mt-24 mb-8">
              <p className="text-xs text-gray-500 leading-relaxed">
                Disclaimer: All products and services provided through this platform are offered on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. This platform does not provide investment, legal, tax, or financial advice. Any information or assets made available through this interface, including but not limited to tokenized real-world assets (RWA), stocks, bonds, and Treasury bills, are for informational and transactional purposes only and do not constitute an offer to sell or a solicitation of an offer to buy any security or financial instrument in any jurisdiction where such offer or solicitation would be unlawful.
                <br /><br />
                Participation in transactions may be subject to U.S. federal and state securities laws, regulations, and reporting requirements. Users are solely responsible for ensuring compliance with all applicable laws and regulations, including any restrictions on investment, transfer, or resale. Users must conduct their own due diligence and risk assessment prior to engaging in any transaction.
                <br /><br />
                Certain assets available through this platform may not be registered under the U.S. Securities Act of 1933 and may only be offered to accredited or otherwise eligible investors pursuant to an applicable exemption. Access to certain products and services may be restricted based on residency, investor status, or other eligibility criteria.
                <br /><br />
                This platform does not issue, underwrite, or guarantee any tokenized assets. All tokenized assets are created, maintained, and represented by independent third-party issuers. This platform does not make any representation or warranty regarding the accuracy, completeness, legality, or enforceability of any asset or instrument made available through the platform.
                <br /><br />
                This platform is non-custodial. It does not hold, manage, or control user assets or private keys. Users maintain full custody of their own wallets and are solely responsible for securing their credentials, private keys, and devices. All transactions are executed directly by the user through their own wallet.
                <br /><br />
                This platform does not guarantee market performance, liquidity, valuation, redemption rights, or regulatory treatment of any asset. Past performance is not indicative of future results. Trading and holding tokenized assets involves significant risk, including the possible loss of principal.
                <br /><br />
                By using this platform, you acknowledge and agree to all applicable terms, conditions, and disclosures, and you represent that you are in compliance with all laws and regulations that apply to you. Neither the platform nor its affiliates, officers, directors, employees, contractors, or agents shall be liable for any losses, damages, or claims arising out of or related to your use of the platform or participation in any transaction.
              </p>
            </div>
            
            {/* Footer Image - Full width */}
            <div className="w-full mt-8 mb-8">
              <Image
                src="/FooterImage.png"
                alt="Vaulto Footer"
                width={1920}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            
            {/* Mobile Email Signup - positioned even further down below private image */}
            <div className="block md:hidden w-full max-w-sm mx-auto relative z-10 mt-8">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const email = formData.get('EMAIL') as string;
                  
                  try {
                    await fetch('https://vaulto.us15.list-manage.com/subscribe/post?u=4e3f80ec414b40367852952ec&id=dc4af6dff9&f_id=00728ce0f0', {
                      method: 'POST',
                      mode: 'no-cors',
                      body: formData
                    });
                    
                    // Show success message
                    const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                    const originalText = button.textContent;
                    button.textContent = 'Subscribed!';
                    button.className = 'w-full px-4 py-3 bg-amber-500 text-black font-semibold rounded-lg transition-colors duration-200 text-sm';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                      button.textContent = originalText;
                      button.className = 'w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold rounded-lg transition-colors duration-200 text-sm';
                      form.reset();
                    }, 3000);
                  } catch (error) {
                    console.error('Subscription error:', error);
                  }
                }}
                noValidate
                className="flex flex-col gap-2"
              >
                <input
                  type="email"
                  name="EMAIL"
                  placeholder="Enter your email for updates"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300 text-sm relative z-10"
                  style={{ pointerEvents: 'auto' }}
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold rounded-lg transition-colors duration-200 text-sm"
                >
                  Get Notified
                </button>
                {/* Hidden fields for Mailchimp */}
                <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
                  <input type="text" name="b_4e3f80ec414b40367852952ec_dc4af6dff9" tabIndex={-1} defaultValue="" />
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Fixed at bottom for desktop, positioned after private markets for mobile */}
      <footer className={`fixed bottom-0 left-0 right-0 md:block hidden z-50 transition-all duration-300 border-t ${isScrolled ? 'bg-black/90 border-gray-800' : 'bg-transparent border-transparent'}`} role="contentinfo">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              © 2024 Vaulto. All rights reserved.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-2">
              {/* Twitter */}
              <a 
                href="https://twitter.com/vaultoai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://instagram.com/vaultoai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/company/vaulto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@VaultoAI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-200"
                aria-label="Subscribe to our YouTube channel"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              
              {/* Discord */}
              <a 
                href="https://discord.gg/wxXsxm7GGb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-200"
                aria-label="Join our Discord server"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer - Fixed at bottom for mobile viewing */}
      <footer className="fixed bottom-0 left-0 right-0 block md:hidden z-50 bg-black border-t border-gray-800" role="contentinfo">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center">
            <p className="text-xs text-gray-400 text-center">
              © 2024 Vaulto. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

