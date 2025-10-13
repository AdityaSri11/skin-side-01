import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Questionnaire from "./pages/Questionnaire";
import Results from "./pages/Results";
import TrialDetail from "./pages/TrialDetail";
import Profile from "./pages/Profile";
import AllTrials from "./pages/AllTrials";
import Auth from "./pages/Auth";
import HealthQuestionnaire from "./pages/HealthQuestionnaire";
import VerificationSuccess from "./pages/VerificationSuccess";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import NotFound from "./pages/NotFound";
import { useAutoSignOut } from "./hooks/useAutoSignOut";
import { AIMatchDialog } from "./components/AIMatchDialog";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  // Auto sign out when tab closes (WARNING: Creates poor UX)
  useAutoSignOut();

  const [aiMatchOpen, setAiMatchOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setProfileData(profile);
        }
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAIMatchClick = () => {
    setAiMatchOpen(true);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header onAIMatchClick={handleAIMatchClick} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/results" element={<Results />} />
                <Route path="/trials" element={<AllTrials />} />
                <Route path="/trial/:id" element={<TrialDetail />} />
                <Route path="/profile" element={<Profile onAIMatchClick={handleAIMatchClick} />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/health-questionnaire" element={<HealthQuestionnaire />} />
                <Route path="/verification-success" element={<VerificationSuccess />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <AIMatchDialog 
            open={aiMatchOpen} 
            onOpenChange={setAiMatchOpen}
            profileData={profileData}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
