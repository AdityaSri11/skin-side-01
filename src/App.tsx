import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/results" element={<Results />} />
              <Route path="/trials" element={<AllTrials />} />
              <Route path="/trial/:id" element={<TrialDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/health-questionnaire" element={<HealthQuestionnaire />} />
              <Route path="/verification-success" element={<VerificationSuccess />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
