import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import heroImage from "@/assets/hero-diverse-patients.jpg";
import { generateTrialTitle } from "@/lib/utils";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [trials, setTrials] = useState<any[]>([]);
  const [loadingTrials, setLoadingTrials] = useState(true);

  useEffect(() => {
    const checkUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        setHasProfile(!!profile);
      }
    };

    checkUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .single();
          
          setHasProfile(!!profile);
        } else {
          setHasProfile(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTrials = async () => {
      setLoadingTrials(true);
      try {
        // Force fresh data by adding timestamp to bypass any cache
        const { data, error } = await supabase
          .from('derm')
          .select('*')
          .limit(3);

        if (error) {
          console.error('Error fetching trials:', error);
          return;
        }

        setTrials(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingTrials(false);
      }
    };

    fetchTrials();

    // Refetch when window regains focus
    const handleFocus = () => {
      fetchTrials();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-light/20 to-healing-green/20 py-20">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="location" className="w-fit">
              <MapPin className="h-3 w-3 mr-1" />
              Dublin, Ireland
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Find Dermatology Trials
              <span className="block text-primary">Near You</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              We help match you to safe, ethical clinical trials in Dublin using responsible AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                hasProfile ? (
                  <Link to="/questionnaire">
                    <Button variant="hero" size="lg" className="w-full sm:w-auto">
                      Start Matching
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/health-questionnaire">
                    <Button variant="hero" size="lg" className="w-full sm:w-auto">
                      Complete Your Profile
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                )
              ) : (
                <Link to="/auth">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              )}
              <Button variant="soft" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Diverse patients in healthcare consultation" 
              className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-primary/20 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card variant="healthcare">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-healthcare-blue mx-auto mb-4" />
                <CardTitle className="text-xl">Ethical AI</CardTitle>
                <CardDescription>
                  Transparent algorithms that respect your privacy and dignity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="healthcare">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-healing-green mx-auto mb-4" />
                <CardTitle className="text-xl">Expert Care</CardTitle>
                <CardDescription>
                  Connected to Dublin's leading dermatology specialists
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How SkinSide Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, secure steps to connect you with the right clinical trial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Tell Us About You</h3>
              <p className="text-muted-foreground">
                Answer a few questions about your condition and preferences
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-healing-green rounded-full flex items-center justify-center text-accent-foreground text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">AI Finds Matches</h3>
              <p className="text-muted-foreground">
                Our ethical AI matches you with suitable trials in Dublin
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-healthcare-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Connect Safely</h3>
              <p className="text-muted-foreground">
                Review options and connect with qualified medical professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trials Preview */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Active Trials in Dublin</h2>
              <p className="text-muted-foreground">Current opportunities for different conditions</p>
            </div>
            <Link to="/trials">
              <Button variant="outline">
                View All Trials
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loadingTrials ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading trials...</p>
            </div>
          ) : trials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No trials found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trials.map((trial, index) => (
                <Card key={trial.Number || index} variant="trial">
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight">
                      {generateTrialTitle(trial.Description, trial.Number)}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Status: {trial.Status} | Phase: {trial.Phase}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        Trial Entry
                      </div>
                      <Link to={`/trial/${trial.Number}`}>
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-healing-green/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Find Your Match?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of patients who have found suitable clinical trials through our ethical AI matching system.
          </p>
          <Link to={user ? (hasProfile ? "/questionnaire" : "/health-questionnaire") : "/auth"}>
            <Button variant="hero" size="lg">
              {user ? (hasProfile ? "Start Your Journey" : "Complete Your Profile") : "Start Your Journey"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;