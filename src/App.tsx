import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useFavicon } from "./hooks/useFavicon";
import { Analytics } from "@vercel/analytics/react"; // Add this import
import Index from "./pages/Index";
import HowToUse from "./pages/HowToUse";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSiteContent from "./pages/admin/AdminSiteContent";
import AdminBlogPosts from "./pages/admin/AdminBlogPosts";
import AdminSeo from "./pages/admin/AdminSeo";
import AdminContact from "./pages/admin/AdminContact";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminAppearance from "./pages/admin/AdminAppearance";
import AdminIntegrations from "./pages/admin/AdminIntegrations";
import Chat from "./pages/Chat";
import { ChatWidget } from "./components/ChatWidget";
import { useEffect } from "react";
import { ScrollToTop } from "./components/ScrollToTop";
import Disclaimer from "./pages/Disclaimer";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const AppContent = () => {
  useFavicon(); 
  
  return (
    <BrowserRouter>
      <ScrollToTop /> 
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/content" element={<AdminSiteContent />} />
          <Route path="/admin/blog" element={<AdminBlogPosts />} />
          <Route path="/admin/seo" element={<AdminSeo />} />
          <Route path="/admin/contact" element={<AdminContact />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          <Route path="/admin/appearance" element={<AdminAppearance />} />
          <Route path="/admin/integrations" element={<AdminIntegrations />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </AuthProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics /> {/* Add Analytics component here */}
      <AppContent /> 
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;