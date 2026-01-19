import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
    <Toaster 
      position="top-right" 
      toastOptions={{
        style: {
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(147, 51, 234, 0.5)',
          color: 'rgb(255, 255, 255)',
          fontFamily: '"Inter", system-ui, sans-serif',
          fontWeight: '600',
          padding: '16px 20px',
          borderRadius: '12px',
        },
        className: 'backdrop-blur-xl',
        duration: 4000,
        classNames: {
          success: 'toast-success',
          error: 'toast-error',
        },
      }}
    />
  </StrictMode>
);
