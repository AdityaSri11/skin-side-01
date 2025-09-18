import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const VerificationSuccess = () => {
  useEffect(() => {
    // Automatically close the tab after 10 seconds
    const timer = setTimeout(() => {
      window.close();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseTab = () => {
    window.close();
  };

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
            Please close this tab and return to the original window to continue using SkinSide.
          </p>
          <Button onClick={handleCloseTab} className="w-full">
            Close This Tab
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            This tab will automatically close in 10 seconds.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationSuccess;