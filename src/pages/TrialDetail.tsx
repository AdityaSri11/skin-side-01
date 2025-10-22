import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, MapPin, Clock, Users, Euro, Car, Phone, Mail, Info, Shield, Calendar, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateTrialTitle } from "@/lib/utils";
import { MedicalTermTooltip } from "@/components/MedicalTermTooltip";

const TrialDetail = () => {
  const { id } = useParams();
  const [trial, setTrial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrial = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await (supabase as any)
          .from('derm')
          .select('*')
          .eq('Number', id)
          .maybeSingle();

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
              <h1 className="text-3xl font-bold text-foreground mb-2">{generateTrialTitle(trial.Description, trial.Number)}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {trial.Sponsor}
              </div>
              <p className="text-muted-foreground">
                <MedicalTermTooltip text={trial.Description || `Clinical trial ${trial.Number} sponsored by ${trial.Sponsor}`} />
              </p>
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
                    <span className="text-sm">Trial Number: {trial.Number}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Phase: <MedicalTermTooltip text={trial.Phase} />
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Sponsor: {trial.Sponsor}</span>
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
                  <h4 className="font-medium text-foreground mb-2">Medical Conditions:</h4>
                  <p className="text-sm">
                    <MedicalTermTooltip text={trial.Conditions} />
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Product Being Tested:</h4>
                  <p className="text-sm">
                    <MedicalTermTooltip text={trial.Product} />
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Trial Status:</h4>
                  <p className="text-sm">
                    <MedicalTermTooltip text={trial.Status} />
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Age Group:</h4>
                  <p className="text-sm">{trial.Age_group}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Gender:</h4>
                  <p className="text-sm">{trial.Gender}</p>
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
                      <strong>Trial Number:</strong> {trial.Number}
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Sponsor:</strong> {trial.Sponsor}
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Status:</strong> {trial.Status}
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Phase:</strong> <MedicalTermTooltip text={trial.Phase} />
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