import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, MapPin, Clock, Users, Euro, Car, Phone, Mail, Info, Shield, Calendar, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TrialDetail = () => {
  const { id } = useParams();
  const [trial, setTrial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrial = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await (supabase as any)
          .from('test')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching trial:', error);
          return;
        }

        setTrial(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrial();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-trust py-8">
        <div className="container max-w-4xl">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading trial details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="min-h-screen bg-gradient-trust py-8">
        <div className="container max-w-4xl">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Trial not found.</p>
            <Link to="/trials" className="text-primary hover:underline">
              Back to all trials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-trust py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/results" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="success">95% match</Badge>
                <Badge variant="compensation">
                  <Euro className="h-3 w-3 mr-1" />
                  €300 compensation
                </Badge>
                <Badge variant="travel">
                  <Car className="h-3 w-3 mr-1" />
                  Travel support
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-2">{trial.id}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {trial.school}
              </div>
              <p className="text-muted-foreground">Clinical trial entry for {trial.id} at {trial.school}</p>
            </div>
            
            <div className="lg:w-80">
              <Button variant="hero" size="lg" className="w-full">
                Apply for This Trial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Study Overview */}
            <Card variant="healthcare">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Study Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Trial ID: {trial.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Phase: Clinical Trial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{trial.school}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">Ethics Approved</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trial Information */}
            <Card variant="healthcare">
              <CardHeader>
                <CardTitle>Trial Information</CardTitle>
                <CardDescription>Details about this clinical trial</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Participant Name:</h4>
                  <p className="text-sm">{trial.id}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Associated Institution:</h4>
                  <p className="text-sm">{trial.school}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Trial Status:</h4>
                  <p className="text-sm">Active</p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Check Eligibility */}
            <Card variant="healing">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Trial Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Participant:</strong> {trial.id}
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Institution:</strong> {trial.school}
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Status:</strong> Active trial entry
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Type:</strong> Clinical research study
                    </p>
                  </div>
                </div>
                <Button variant="default" className="w-full">
                  Contact for Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialDetail;