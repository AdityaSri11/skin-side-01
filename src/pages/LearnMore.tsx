import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-trust">
      {/* The Header is consistent with App.tsx. 
         We pass a dummy function to onAIMatchClick or let it handle its own logic.
      */}
      <Header onAIMatchClick={() => navigate('/auth')} />

      <main className="flex-1 flex flex-col">
        {/* Breadcrumb / Back Navigation */}
        <div className="container pt-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Content Section */}
        <section className="container py-16 flex-1 flex items-center justify-center">
          <div className="max-w-3xl w-full text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground tracking-tight">
              ADITYA SRIKANTH TEST
            </h1>
            
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              This page will contain detailed information about our trial selection process, 
              security protocols, and partnership with Dublin healthcare providers.
            </p>

            <div className="pt-10">
              <Button variant="hero" size="lg" onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LearnMore;
