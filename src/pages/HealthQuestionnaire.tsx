import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";

interface FormData {
  // Personal Information
  first_name: string;
  last_name: string;
  date_of_birth: Date | undefined;
  gender: string;
  address: string;
  travel_distance: string;
  phone_number: string;
  email_address: string;
  
  // Medical History
  previous_medical_conditions: string;
  existing_medical_conditions: string;
  previous_surgical_history: string;
  allergies: string;
  immunization_status: string;
  
  // Medications
  current_prescription_medications: string;
  over_counter_medications: string;
  recent_medication_changes: string;
  
  // Primary Condition
  primary_condition: string;
  other_condition?: string;
  condition_stage_severity: string;
  date_of_diagnosis: Date | undefined;
  recent_test_results: File | null;
  prior_clinical_trials: string;
  treatments_for_condition: string;
  
  // Lifestyle Factors
  smoke_history: string;
  alcohol_intake: string;
  pregnant_breastfeeding: string;
  other_substances: string;
}

const HealthQuestionnaire = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const totalSteps = 5;

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    date_of_birth: undefined,
    gender: "",
    address: "",
    travel_distance: "",
    phone_number: "",
    email_address: "",
    previous_medical_conditions: "",
    existing_medical_conditions: "",
    previous_surgical_history: "",
    allergies: "",
    immunization_status: "",
    current_prescription_medications: "",
    over_counter_medications: "",
    recent_medication_changes: "",
    primary_condition: "",
    other_condition: "",
    condition_stage_severity: "",
    date_of_diagnosis: undefined,
    recent_test_results: null,
    prior_clinical_trials: "",
    treatments_for_condition: "",
    smoke_history: "",
    alcohol_intake: "",
    pregnant_breastfeeding: "",
    other_substances: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      setFormData(prev => ({ ...prev, email_address: session.user.email || "" }));
    };

    checkUser();
  }, [navigate]);

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.first_name && formData.last_name && formData.date_of_birth && 
               formData.gender && formData.email_address && formData.address && formData.travel_distance;
      case 2:
        return formData.immunization_status;
      case 3:
        return true; // All fields optional
      case 4:
        return formData.condition_stage_severity && formData.prior_clinical_trials;
      case 5:
        return formData.smoke_history && formData.alcohol_intake && formData.pregnant_breastfeeding;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    
    let testResultsPath: string | null = null;
    
    // Upload PDF if one was selected
    if (formData.recent_test_results) {
      const fileExt = formData.recent_test_results.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('derm_test_results')
        .upload(fileName, formData.recent_test_results);
      
      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload test results. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      testResultsPath = fileName;
    }
    
    // Exclude fields that don't exist in the database schema
    const { recent_test_results: _, other_condition, ...cleanFormData } = formData;
    
    const profileData = {
      user_id: user.id,
      ...cleanFormData,
      date_of_birth: formData.date_of_birth?.toISOString().split('T')[0],
      date_of_diagnosis: formData.date_of_diagnosis?.toISOString().split('T')[0],
      recent_test_results: testResultsPath,
    };

    const { error } = await supabase
      .from('user_profiles')
      .insert(profileData);

    if (error) {
      console.error('Profile insert error:', error);
      toast({
        title: "Error",
        description: `Failed to save your information: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your health profile has been saved successfully!",
      });
      navigate('/');
    }

    setLoading(false);
  };

  const progress = (currentStep / totalSteps) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value.slice(0, 150))}
                  maxLength={150}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value.slice(0, 150))}
                  maxLength={150}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_of_birth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_of_birth ? format(formData.date_of_birth, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border border-border z-50">
                  <Calendar
                    mode="single"
                    selected={formData.date_of_birth}
                    onSelect={(date) => handleInputChange('date_of_birth', date)}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    className="p-3 pointer-events-auto bg-background"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <LocationAutocomplete
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                placeholder="Start typing your address..."
              />
              <p className="text-xs text-muted-foreground">
                Select your exact location from the suggestions
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="travel_distance">Maximum Travel Distance *</Label>
              <Select value={formData.travel_distance} onValueChange={(value) => handleInputChange('travel_distance', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select travel distance" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="0-5km">Within 5 km (Walking distance)</SelectItem>
                  <SelectItem value="5-25km">5-25 km (Short commute)</SelectItem>
                  <SelectItem value="25km+">25+ km (Willing to travel far)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value.slice(0, 150))}
                maxLength={150}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="previous_medical_conditions">Previous Medical Conditions</Label>
              <Textarea
                id="previous_medical_conditions"
                value={formData.previous_medical_conditions}
                onChange={(e) => handleInputChange('previous_medical_conditions', e.target.value.slice(0, 150))}
                maxLength={150}
                placeholder="List any previous medical conditions..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="existing_medical_conditions">Existing Medical Conditions</Label>
              <Textarea
                id="existing_medical_conditions"
                value={formData.existing_medical_conditions}
                onChange={(e) => handleInputChange('existing_medical_conditions', e.target.value.slice(0, 150))}
                maxLength={150}
                placeholder="List any current medical conditions..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previous_surgical_history">Previous Surgical History</Label>
              <Textarea
                id="previous_surgical_history"
                value={formData.previous_surgical_history}
                onChange={(e) => handleInputChange('previous_surgical_history', e.target.value.slice(0, 150))}
                maxLength={150}
                placeholder="List any previous surgeries..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value.slice(0, 150))}
                maxLength={150}
                placeholder="List any allergies..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="immunization_status">Immunization Status *</Label>
              <Select value={formData.immunization_status} onValueChange={(value) => handleInputChange('immunization_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select immunization status" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="up_to_date">Up to date</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_prescription_medications">Current Prescription Medications</Label>
              <Textarea
                id="current_prescription_medications"
                value={formData.current_prescription_medications}
                onChange={(e) => handleInputChange('current_prescription_medications', e.target.value.slice(0, 150))}
                maxLength={150}
                placeholder="List current prescription medications..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="over_counter_medications">Over-the-Counter Medications</Label>
              <Textarea
                id="over_counter_medications"
                value={formData.over_counter_medications}
                onChange={(e) => handleInputChange('over_counter_medications', e.target.value.slice(0, 150))}
                maxLength={150}
                placeholder="List over-the-counter medications..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recent_medication_changes">Recent Changes in Medications (Last 30 Days)</Label>
              <Textarea
                id="recent_medication_changes"
                value={formData.recent_medication_changes}
                onChange={(e) => handleInputChange('recent_medication_changes', e.target.value.slice(0, 150))}
                maxLength={150}
                placeholder="Describe any recent medication changes..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary_condition">Primary Condition</Label>
              <Select value={formData.primary_condition} onValueChange={(value) => handleInputChange('primary_condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary condition" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="psoriasis">Psoriasis</SelectItem>
                  <SelectItem value="eczema">Eczema</SelectItem>
                  <SelectItem value="acne">Acne</SelectItem>
                  <SelectItem value="hidradenitis">Hidradenitis Suppurativa</SelectItem>
                  <SelectItem value="melanoma">Melanoma</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.primary_condition === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="other_condition">Please specify (max 50 characters)</Label>
                  <Input
                    id="other_condition"
                    value={formData.other_condition || ''}
                    onChange={(e) => handleInputChange('other_condition', e.target.value.slice(0, 50))}
                    maxLength={50}
                    placeholder="Enter your condition"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition_stage_severity">Stage / Severity of Condition *</Label>
              <Select value={formData.condition_stage_severity} onValueChange={(value) => handleInputChange('condition_stage_severity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date of Diagnosis</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_of_diagnosis && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_of_diagnosis ? format(formData.date_of_diagnosis, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border border-border z-50">
                  <Calendar
                    mode="single"
                    selected={formData.date_of_diagnosis}
                    onSelect={(date) => handleInputChange('date_of_diagnosis', date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto bg-background"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recent_test_results">Most Recent Test Results (PDF Upload)</Label>
              <Input
                id="recent_test_results"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleInputChange('recent_test_results', file);
                }}
                className="cursor-pointer"
              />
              {formData.recent_test_results && (
                <p className="text-sm text-muted-foreground">
                  Selected: {formData.recent_test_results.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prior_clinical_trials">Prior Participation in Clinical Trials *</Label>
              <Select value={formData.prior_clinical_trials} onValueChange={(value) => handleInputChange('prior_clinical_trials', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unsure">Unsure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatments_for_condition">Treatments for Condition</Label>
              <Textarea
                id="treatments_for_condition"
                value={formData.treatments_for_condition}
                onChange={(e) => handleInputChange('treatments_for_condition', e.target.value.slice(0, 150))}
                maxLength={150}
                placeholder="Describe treatments you've tried..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smoke_history">Smoke History *</Label>
              <Select value={formData.smoke_history} onValueChange={(value) => handleInputChange('smoke_history', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select smoking history" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="former">Former smoker</SelectItem>
                  <SelectItem value="current_light">Current - Light (1-10 cigarettes/day)</SelectItem>
                  <SelectItem value="current_moderate">Current - Moderate (11-20 cigarettes/day)</SelectItem>
                  <SelectItem value="current_heavy">Current - Heavy (20+ cigarettes/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alcohol_intake">Alcohol Intake *</Label>
              <Select value={formData.alcohol_intake} onValueChange={(value) => handleInputChange('alcohol_intake', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select alcohol intake" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="occasional">Occasional (1-2 drinks/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
                  <SelectItem value="heavy">Heavy (8+ drinks/week)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pregnant_breastfeeding">Pregnant or Breastfeeding? *</Label>
              <Select value={formData.pregnant_breastfeeding} onValueChange={(value) => handleInputChange('pregnant_breastfeeding', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="pregnant">Pregnant</SelectItem>
                  <SelectItem value="breastfeeding">Breastfeeding</SelectItem>
                  <SelectItem value="neither">Neither</SelectItem>
                  <SelectItem value="not_applicable">Not applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="other_substances">Any Other Substances or Recreational Drugs?</Label>
              <Textarea
                id="other_substances"
                value={formData.other_substances}
                onChange={(e) => handleInputChange('other_substances', e.target.value.slice(0, 150))}
                maxLength={150}
                placeholder="Describe any other substances..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Personal Information";
      case 2: return "Health & Medical History";
      case 3: return "Current Medications";
      case 4: return "Primary Condition Details";
      case 5: return "Lifestyle Factors";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Tell us about yourself";
      case 2: return "Your medical background and health status";
      case 3: return "Current and recent medications";
      case 4: return "Details about your primary condition";
      case 5: return "Lifestyle factors that may affect treatment";
      default: return "";
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Health Questionnaire</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{getStepTitle()}</CardTitle>
            <CardDescription>{getStepDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || loading}
                >
                  {loading ? "Saving..." : "Complete Profile"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthQuestionnaire;