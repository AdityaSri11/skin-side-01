import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, Database, Sparkles, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-trust">
      <main className="flex-1 flex flex-col">
        {/* Navigation / Header Area */}
        <div className="container pt-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Hero Style Content Section */}
        <section className="container pb-16">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Header Block */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                Privacy & Clinical Data Usage
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                How SkinSide uses technology and data to connect you with Dublin's leading dermatology research.
              </p>
            </div>

            {/* How It Works Overview Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-primary/10">
                <Database className="h-8 w-8 text-healthcare-blue mb-4" />
                <h3 className="font-bold text-lg mb-2">Data Aggregation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Consolidates open-access data from HPRA CTIS, ClinicalTrials.gov, and WHO ICTRP.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-primary/10">
                <Sparkles className="h-8 w-8 text-healing-green mb-4" />
                <h3 className="font-bold text-lg mb-2">AI Translation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Transforms complex eligibility criteria into patient-friendly summaries.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-primary/10">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Smart Matching</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Matches you with relevant trials while maintaining full GDPR compliance.
                </p>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Main Legal/Info Text */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-border space-y-10">
              
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center">
                  <CheckCircle2 className="h-6 w-6 text-healing-green mr-2" />
                  How We Use Your Medical Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We collect and process the medical information you provide so that we can:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {[
                    "Determine your eligibility for clinical studies safely",
                    "Provide healthcare services in line with protocols",
                    "Comply with legal and regulatory safety reporting",
                    "Analyse health data to support scientific research"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start p-3 bg-muted/30 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <Separator />

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Legal Basis for Processing</h2>
                <p className="text-muted-foreground italic">
                  Medical information is considered a "special category of personal data" under the GDPR.
                </p>
                
                <div className="space-y-6">
                  <div className="pl-4 border-l-2 border-primary/20">
                    <h4 className="font-bold text-lg">1. Explicit Consent</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      We will obtain your explicit consent before collecting and using your information for clinical research. You may withdraw this consent at any time.
                    </p>
                  </div>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <h4 className="font-bold text-lg">2. Legal and Regulatory Obligations</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Processing is often necessary to comply with applicable laws relating to clinical trials, health and safety, or public health.
                    </p>
                  </div>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <h4 className="font-bold text-lg">3. Scientific Research & Public Interest</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Where permitted under GDPR Article 9(2), we may process data for scientific research purposes with appropriate safeguards like pseudonymisation.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Data Security & Retention</h2>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" /> 
                      Your medical information is processed securely using industry-standard encryption.
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" /> 
                      Access is restricted strictly to authorised medical and research personnel.
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" /> 
                      Data is retained only as long as necessary for the stated research purposes.
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Final CTA Area */}
            <div className="text-center py-12">
              <h3 className="text-xl font-bold mb-4">Have questions about your data?</h3>
              <Button variant="hero" size="lg" onClick={() => navigate('/profile')}>
                Review Profile Settings
              </Button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default LearnMore;
