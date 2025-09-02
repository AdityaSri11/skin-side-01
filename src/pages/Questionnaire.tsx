import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, MapPin, HelpCircle, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    condition: "",
    location: "",
    consent: false,
    travelWillingness: "",
    previousTrials: false,
  });
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to results page
      navigate("/results");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.age && formData.condition;
      case 2:
        return formData.location;
      case 3:
        return formData.travelWillingness;
      case 4:
        return formData.consent;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-trust py-8">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Perfect Match</h1>
          <p className="text-muted-foreground">Help us understand your needs to find suitable clinical trials</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card variant="healthcare" className="mb-8">
          {currentStep === 1 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">About You</CardTitle>
                <CardDescription>Tell us some basic information to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Your Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Primary Skin Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eczema">Eczema / Atopic Dermatitis</SelectItem>
                      <SelectItem value="psoriasis">Psoriasis</SelectItem>
                      <SelectItem value="acne">Acne</SelectItem>
                      <SelectItem value="rosacea">Rosacea</SelectItem>
                      <SelectItem value="dermatitis">Contact Dermatitis</SelectItem>
                      <SelectItem value="vitiligo">Vitiligo</SelectItem>
                      <SelectItem value="other">Other / Multiple Conditions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-accent/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Why do we ask this?</h4>
                      <p className="text-sm text-muted-foreground">
                        This helps our AI match you with trials specifically designed for your condition and age group.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Location Preferences</CardTitle>
                <CardDescription>Where would you like to participate in trials?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Your Location in Dublin</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city-centre">Dublin City Centre</SelectItem>
                      <SelectItem value="north-dublin">North Dublin</SelectItem>
                      <SelectItem value="south-dublin">South Dublin</SelectItem>
                      <SelectItem value="west-dublin">West Dublin</SelectItem>
                      <SelectItem value="dun-laoghaire">Dún Laoghaire-Rathdown</SelectItem>
                      <SelectItem value="fingal">Fingal</SelectItem>
                      <SelectItem value="outside-dublin">Outside Dublin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card variant="soft">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-healthcare-blue" />
                        <div>
                          <h4 className="font-medium">Mater Hospital</h4>
                          <p className="text-sm text-muted-foreground">North Dublin</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="soft">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-healthcare-blue" />
                        <div>
                          <h4 className="font-medium">St. Vincent's</h4>
                          <p className="text-sm text-muted-foreground">South Dublin</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Travel & Commitment</CardTitle>
                <CardDescription>Help us understand your availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>How far are you willing to travel?</Label>
                  <Select value={formData.travelWillingness} onValueChange={(value) => setFormData({ ...formData, travelWillingness: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select travel preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walking">Walking distance (1-2km)</SelectItem>
                      <SelectItem value="local">Local area (5-10km)</SelectItem>
                      <SelectItem value="dublin">Anywhere in Dublin</SelectItem>
                      <SelectItem value="greater-dublin">Greater Dublin Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Have you participated in clinical trials before?</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="previousTrials"
                      checked={formData.previousTrials}
                      onCheckedChange={(checked) => setFormData({ ...formData, previousTrials: checked as boolean })}
                    />
                    <Label htmlFor="previousTrials" className="text-sm">
                      Yes, I have previous clinical trial experience
                    </Label>
                  </div>
                </div>

                <div className="bg-healing-green/20 rounded-xl p-4">
                  <h4 className="font-medium text-foreground mb-2">Travel Support Available</h4>
                  <p className="text-sm text-muted-foreground">
                    Many trials offer travel reimbursement or transport assistance. We'll show you which ones when we find your matches.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Privacy & Consent</CardTitle>
                <CardDescription>Your data protection and consent preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary-light/20 rounded-xl p-6 border border-primary-light">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Your Data is Protected</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• GDPR compliant data handling</li>
                        <li>• Encrypted storage and transmission</li>
                        <li>• You can withdraw consent anytime</li>
                        <li>• No data shared without your explicit permission</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="consent" className="text-sm leading-relaxed">
                        I consent to SkinSide using my information to find suitable clinical trials. 
                        I understand that my data will be handled according to GDPR regulations and that 
                        I can withdraw this consent at any time.
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Badge variant="success" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    HSE Approved Platform
                  </Badge>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            variant="hero"
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex items-center"
          >
            {currentStep === totalSteps ? "Find My Matches" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;