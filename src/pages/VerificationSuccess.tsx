import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const handleVerification = async () => {
      // Give Supabase a moment to process the token from the URL hash
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if the user already has a completed profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('first_name')
          .eq('user_id', user.id)
          .single();
        
        if (profile && profile.first_name) {
          navigate('/');
        } else {
          navigate('/health-questionnaire');
        }
      } else {
        setChecking(false);
      }
    };

    handleVerification();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Account Verified!
            </CardTitle>
            <CardDescription className="text-base">
              Setting up your account...
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Account Verified!
          </CardTitle>
          <CardDescription className="text-base">
            Your account has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-muted-foreground mb-6">
            Click below to continue setting up your profile.
          </p>
          <Button onClick={() => navigate('/health-questionnaire')} className="w-full">
            Continue to Profile Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationSuccess;
