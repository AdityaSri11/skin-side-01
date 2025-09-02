import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, MapPin, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-diverse-patients.jpg";

const Home = () => {
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
              <Link to="/questionnaire">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Start Matching
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

            <Card variant="healthcare">
              <CardHeader className="text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <CardTitle className="text-xl">HSE Approved</CardTitle>
                <CardDescription>
                  Working with Ireland's health service for your safety
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="trial">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="pediatric">Pediatric</Badge>
                  <Badge variant="compensation">€200 compensation</Badge>
                </div>
                <CardTitle className="text-lg">Eczema Treatment Study</CardTitle>
                <CardDescription>Mater Hospital • 12 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Testing a new topical treatment for moderate to severe eczema in children aged 6-17.
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Enrolling now
                </div>
              </CardContent>
            </Card>

            <Card variant="trial">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="travel">Travel support</Badge>
                  <Badge variant="location">City Centre</Badge>
                </div>
                <CardTitle className="text-lg">Psoriasis Research</CardTitle>
                <CardDescription>St. Vincent's Hospital • 24 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Investigating biological therapy effectiveness for moderate psoriasis.
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Starting March 2024
                </div>
              </CardContent>
            </Card>

            <Card variant="trial">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="success">Fast track</Badge>
                  <Badge variant="compensation">€150 compensation</Badge>
                </div>
                <CardTitle className="text-lg">Acne Prevention Study</CardTitle>
                <CardDescription>Beaumont Hospital • 16 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Evaluating a new preventive approach for teenage acne.
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Urgent recruitment
                </div>
              </CardContent>
            </Card>
          </div>
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
          <Link to="/questionnaire">
            <Button variant="hero" size="lg">
              Start Your Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;