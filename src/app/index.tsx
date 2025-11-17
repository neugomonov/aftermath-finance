import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary, ThemeProvider } from "./providers";
import App from "./App";
import "./styles/main.css";

const style = document.createElement("style");
style.textContent = `
  [data-radix-portal] {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 999999 !important;
    pointer-events: auto !important;
  }

  [data-radix-dialog-overlay] {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(0, 0, 0, 0.75) !important;
    backdrop-filter: blur(8px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 999999 !important;
    pointer-events: auto !important;
    opacity: 1 !important;
    visibility: visible !important;
    animation: fadeIn 0.2s ease-out !important;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  [data-radix-dialog-content],
  div[role="dialog"] > div {
    background: var(--bg-card, rgba(23, 24, 28, 0.98)) !important;
    backdrop-filter: blur(32px) saturate(180%) !important;
    border: 2px solid var(--border-card, rgba(144, 252, 211, 0.2)) !important;
    border-radius: 24px !important;
    padding: 0 !important;
    max-width: 440px !important;
    width: 90% !important;
    max-height: 90vh !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.6),
      0 0 60px rgba(144, 252, 211, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
    z-index: 1000000 !important;
    position: relative !important;
    margin: auto !important;
    pointer-events: auto !important;
    opacity: 1 !important;
    visibility: visible !important;
    display: flex !important;
    flex-direction: column !important;
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  [data-radix-dialog-content] > *,
  div[role="dialog"] > div > * {
    display: block !important;
    width: 100% !important;
  }

  [data-radix-dialog-content]::-webkit-scrollbar,
  div[role="dialog"] > div::-webkit-scrollbar {
    width: 8px !important;
    height: 0 !important;
  }

  [data-radix-dialog-content]::-webkit-scrollbar:horizontal,
  div[role="dialog"] > div::-webkit-scrollbar:horizontal {
    display: none !important;
  }

  [data-radix-dialog-content]::-webkit-scrollbar-track,
  div[role="dialog"] > div::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.3) !important;
    border-radius: 4px !important;
  }

  [data-radix-dialog-content]::-webkit-scrollbar-thumb,
  div[role="dialog"] > div::-webkit-scrollbar-thumb {
    background: rgba(144, 252, 211, 0.3) !important;
    border-radius: 4px !important;
  }

  [data-radix-dialog-content]::-webkit-scrollbar-thumb:hover,
  div[role="dialog"] > div::-webkit-scrollbar-thumb:hover {
    background: rgba(144, 252, 211, 0.5) !important;
  }

  div[role="dialog"] {
    position: fixed !important;
    z-index: 1000000 !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    pointer-events: auto !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  div[role="dialog"] > div {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 1rem !important;
    width: 100% !important;
    background: transparent !important;
  }

  [data-state="open"] {
    opacity: 1 !important;
    visibility: visible !important;
    display: flex !important;
  }

  [data-dapp-kit] {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    color: var(--text-primary, #f1f5f9) !important;
  }

  [data-dapp-kit] h1,
  [data-dapp-kit] h2,
  [data-dapp-kit] h3 {
    margin: 0;
    font-weight: 700;
    color: var(--text-primary, #f1f5f9) !important;
  }

  [data-dapp-kit] h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  [data-dapp-kit] h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  [data-dapp-kit] h3 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  [data-dapp-kit] p {
    margin: 0;
    line-height: 1.6;
    color: var(--text-secondary, #cbd5e1) !important;
  }

  [data-dapp-kit] button {
    cursor: pointer !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    font-weight: 600 !important;
  }

  [data-dapp-kit] ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  [data-dapp-kit] li {
    padding: 0 !important;
    margin: 0 !important;
    border-radius: 0 !important;
    cursor: default !important;
    border: none !important;
    transition: none !important;
    background: transparent !important;
    display: block !important;
  }

  [data-dapp-kit] li:hover {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }

  [data-dapp-kit] li img,
  [data-dapp-kit] li svg {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  div[role="dialog"] > div > div {
    padding: 2rem !important;
  }

  @media (max-width: 640px) {
    div[role="dialog"] > div > div {
      padding: 1.5rem !important;
    }
  }

  div[role="dialog"] section,
  div[role="dialog"] article {
    padding: 1.25rem !important;
    background: rgba(30, 41, 59, 0.4) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(144, 252, 211, 0.1) !important;
    border-radius: 12px !important;
    margin: 1rem 0 !important;
    display: block !important;
  }

  div[role="dialog"] section > *,
  div[role="dialog"] article > * {
    display: block !important;
    width: 100% !important;
  }

  div[role="dialog"] section h3,
  div[role="dialog"] article h3 {
    color: var(--text-primary, #f1f5f9) !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    margin-bottom: 0.5rem !important;
  }

  div[role="dialog"] section p,
  div[role="dialog"] article p {
    color: var(--text-secondary, #cbd5e1) !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
  }

  div[role="dialog"] button[aria-label="Close"],
  [data-radix-dialog-content] button[aria-label="Close"],
  button[data-radix-dialog-close],
  button[class*="IconButton_container"],
  button[class*="closeButtonContainer"] {
    position: absolute !important;
    top: 1.25rem !important;
    right: 1.25rem !important;
    min-width: 36px !important;
    max-width: 36px !important;
    width: 36px !important;
    height: 36px !important;
    padding: 0 !important;
    border-radius: 10px !important;
    border: 2px solid rgba(144, 252, 211, 0.2) !important;
    background: rgba(30, 41, 59, 0.6) !important;
    backdrop-filter: blur(8px) !important;
    color: var(--text-secondary, #cbd5e1) !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    z-index: 10 !important;
  }

  div[role="dialog"] button[aria-label="Close"] svg,
  [data-radix-dialog-content] button[aria-label="Close"] svg,
  button[data-radix-dialog-close] svg,
  button[class*="IconButton_container"] svg,
  button[class*="closeButtonContainer"] svg {
    width: 14px !important;
    height: 14px !important;
    flex-shrink: 0 !important;
    color: currentColor !important;
  }

  div[role="dialog"] button[aria-label="Close"] svg path,
  [data-radix-dialog-content] button[aria-label="Close"] svg path,
  button[data-radix-dialog-close] svg path,
  button[class*="IconButton_container"] svg path,
  button[class*="closeButtonContainer"] svg path {
    fill: currentColor !important;
  }

  div[role="dialog"] button[aria-label="Close"]:hover,
  [data-radix-dialog-content] button[aria-label="Close"]:hover,
  button[data-radix-dialog-close]:hover,
  button[class*="IconButton_container"]:hover,
  button[class*="closeButtonContainer"]:hover {
    background: rgba(144, 252, 211, 0.15) !important;
    border-color: rgba(144, 252, 211, 0.4) !important;
    color: var(--text-primary, #f1f5f9) !important;
    transform: scale(1.1) rotate(90deg) !important;
    box-shadow: 0 4px 12px rgba(144, 252, 211, 0.2) !important;
  }

  div[role="dialog"] button[aria-label="Close"]:active,
  [data-radix-dialog-content] button[aria-label="Close"]:active,
  button[data-radix-dialog-close]:active,
  button[class*="IconButton_container"]:active,
  button[class*="closeButtonContainer"]:active {
    transform: scale(0.95) rotate(90deg) !important;
  }
  
  [data-radix-portal] [role="dialog"] {
    background: var(--bg-card, rgba(23, 24, 28, 0.98)) !important;
    backdrop-filter: blur(32px) saturate(180%) !important;
    border: 2px solid var(--border-card, rgba(144, 252, 211, 0.3)) !important;
    border-radius: 24px !important;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.6),
      0 0 60px rgba(144, 252, 211, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
    padding: 0 !important;
    max-width: 440px !important;
    min-width: 360px !important;
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  @media (max-width: 640px) {
    [data-radix-portal] [role="dialog"] {
      max-width: calc(100vw - 2rem) !important;
      min-width: auto !important;
      margin: 1rem !important;
    }
  }

  [data-radix-portal] h2,
  [data-radix-portal] h3 {
    font-weight: 700 !important;
    font-size: 1.5rem !important;
    margin-bottom: 20px !important;
    background: linear-gradient(to right, #5eead4, #2dd4bf, #14b8a6) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    color: transparent !important;
  }

  [data-radix-portal] p {
    color: var(--text-secondary, #cbd5e1) !important;
    font-size: 14px !important;
    margin: 0 0 16px 0 !important;
    line-height: 1.6 !important;
  }

  [data-dapp-kit] ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
    margin-top: 1.5rem !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
  }

  [data-dapp-kit] li {
    margin: 0 !important;
  }

  [data-dapp-kit] li button {
    width: 200px !important;
    padding: 16px 20px !important;
    text-align: left !important;
    background: var(--bg-input, rgba(30, 41, 59, 0.5)) !important;
    border: 2px solid var(--border-input, rgba(144, 252, 211, 0.2)) !important;
    border-radius: 12px !important;
    color: var(--text-primary, #f1f5f9) !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative !important;
    overflow: hidden !important;
  }
  
  [data-dapp-kit] li button::before {
    content: '' !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: linear-gradient(135deg, rgba(144, 252, 211, 0.1), rgba(94, 234, 212, 0.1)) !important;
    opacity: 0 !important;
    transition: opacity 0.3s ease !important;
    z-index: 0 !important;
  }

  [data-dapp-kit] li button:hover {
    background: var(--bg-input, rgba(30, 41, 59, 0.8)) !important;
    border-color: var(--border-focus, rgba(144, 252, 211, 0.5)) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 16px rgba(144, 252, 211, 0.3) !important;
  }
  
  [data-dapp-kit] li button:hover::before {
    opacity: 1 !important;
  }
  
  [data-dapp-kit] li button:active {
    transform: translateY(0) !important;
    box-shadow: 0 2px 8px rgba(144, 252, 211, 0.3) !important;
  }
  
  [data-dapp-kit] li button > * {
    position: relative !important;
    z-index: 1 !important;
  }
  
  [data-dapp-kit] li button img,
  [data-dapp-kit] li button svg {
    width: 40px !important;
    height: 40px !important;
    border-radius: 10px !important;
    border: 1px solid rgba(144, 252, 211, 0.1) !important;
    background: rgba(30, 41, 59, 0.3) !important;
    padding: 4px !important;
  }

  [data-dapp-kit] li button:hover img,
  [data-dapp-kit] li button:hover svg {
    border-color: rgba(144, 252, 211, 0.3) !important;
    background: rgba(144, 252, 211, 0.05) !important;
  }

  [data-dapp-kit] li button span {
    color: var(--text-primary, #f1f5f9) !important;
    font-weight: 600 !important;
    font-size: 15px !important;
  }

  [data-dapp-kit] li button:hover span {
    color: var(--text-primary, #f1f5f9) !important;
  }

    [data-dapp-kit] button[aria-label*="What is a Wallet"],
  [data-dapp-kit] button[aria-label*="what is a wallet"],
  [data-dapp-kit] a[href*="wallet"],
  button[class*="whatIsAWalletButton"] {
    width: 200px !important;
    min-width: 200px !important;
    padding: 0.875rem 1.75rem !important;
    background: rgba(30, 41, 59, 0.5) !important;
    backdrop-filter: blur(8px) !important;
    border: 2px solid rgba(144, 252, 211, 0.2) !important;
    border-radius: 10px !important;
    color: var(--text-primary, #f1f5f9) !important;
    font-size: 0.875rem !important;
    font-weight: 600 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative !important;
    overflow: hidden !important;
    margin: 0.5rem 0 !important;
    margin-bottom: 1.5rem !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 0.5rem !important;
    text-align: left !important;
  }

  [data-dapp-kit] button[aria-label*="What is a Wallet"]:hover,
  [data-dapp-kit] button[aria-label*="what is a wallet"]:hover,
  [data-dapp-kit] a[href*="wallet"]:hover,
  button[class*="whatIsAWalletButton"]:hover {
    background: rgba(144, 252, 211, 0.15) !important;
    border-color: rgba(144, 252, 211, 0.4) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 12px rgba(144, 252, 211, 0.3) !important;
  }

  [data-dapp-kit] button[aria-label*="What is a Wallet"]:active,
  [data-dapp-kit] button[aria-label*="what is a wallet"]:active,
  [data-dapp-kit] a[href*="wallet"]:active,
  button[class*="whatIsAWalletButton"]:active {
    transform: translateY(0) !important;
    box-shadow: 0 2px 6px rgba(144, 252, 211, 0.3) !important;
  }

  [data-dapp-kit] button[aria-label*="Back"],
  [data-dapp-kit] button[aria-label*="back"],
  [data-dapp-kit] button:has(svg[width="16"]):not([aria-label="Close"]):not([data-radix-dialog-close]),
  [data-radix-portal] button:has(svg):not([aria-label="Close"]):not([data-radix-dialog-close]),
  [data-radix-dialog-content] button:has(svg):not([aria-label="Close"]):not([data-radix-dialog-close]),
  [data-dapp-kit] button:first-of-type:not([aria-label="Close"]):not([data-radix-dialog-close]):not([aria-label*="Close"]) {
    position: relative !important;
    width: 200px !important;
    height: 44px !important;
    padding: 0.75rem 1.25rem !important;
    border-radius: 10px !important;
    border: 2px solid rgba(144, 252, 211, 0.2) !important;
    background: rgba(30, 41, 59, 0.6) !important;
    backdrop-filter: blur(8px) !important;
    color: var(--text-secondary, #cbd5e1) !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    margin: 0 0 0 1.5rem !important;
    clear: both !important;
    width: 90% !important;
  }

  [data-dapp-kit] button[aria-label*="Back"]:hover,
  [data-dapp-kit] button[aria-label*="back"]:hover,
  [data-dapp-kit] button:has(svg[width="16"]):not([aria-label="Close"]):not([data-radix-dialog-close]):hover,
  [data-radix-portal] button:has(svg):not([aria-label="Close"]):not([data-radix-dialog-close]):hover,
  [data-radix-dialog-content] button:has(svg):not([aria-label="Close"]):not([data-radix-dialog-close]):hover,
  [data-dapp-kit] button:first-of-type:not([aria-label="Close"]):not([data-radix-dialog-close]):not([aria-label*="Close"]):hover {
    background: rgba(144, 252, 211, 0.15) !important;
    border-color: rgba(144, 252, 211, 0.4) !important;
    color: var(--text-primary, #f1f5f9) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 12px rgba(144, 252, 211, 0.2) !important;
  }

  [data-dapp-kit] button[aria-label*="Back"]:active,
  [data-dapp-kit] button[aria-label*="back"]:active,
  [data-dapp-kit] button:has(svg[width="16"]):not([aria-label="Close"]):not([data-radix-dialog-close]):active,
  [data-radix-portal] button:has(svg):not([aria-label="Close"]):not([data-radix-dialog-close]):active,
  [data-radix-dialog-content] button:has(svg):not([aria-label="Close"]):not([data-radix-dialog-close]):active,
  [data-dapp-kit] button:first-of-type:not([aria-label="Close"]):not([data-radix-dialog-close]):not([aria-label*="Close"]):active {
    transform: translateY(0) !important;
  }

  [data-dapp-kit] button:first-of-type:not([aria-label="Close"]):not([data-radix-dialog-close]) svg,
  [data-radix-portal] button:has(svg):not([aria-label="Close"]):not([data-radix-dialog-close]) svg,
  [data-radix-dialog-content] button:has(svg):not([aria-label="Close"]):not([data-radix-dialog-close]) svg {
    width: 24px !important;
    height: 24px !important;
    color: currentColor !important;
    stroke: currentColor !important;
    fill: none !important;
  }
`;
document.head.appendChild(style);

const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function initApp() {
  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider
              networks={networkConfig}
              defaultNetwork="mainnet"
            >
              <WalletProvider
                autoConnect={true}
                storage={
                  typeof window !== "undefined" ? localStorage : undefined
                }
                storageKey="sui-wallet-kit"
              >
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "rgba(30, 41, 59, 0.95)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(144, 252, 211, 0.3)",
                      color: "#fff",
                      borderRadius: "12px",
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: "#10b981",
                        secondary: "#fff",
                      },
                      style: {
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                      },
                      style: {
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                      },
                    },
                  }}
                />
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </React.StrictMode>
  );
}
