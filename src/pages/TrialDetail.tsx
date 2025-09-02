import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, MapPin, Clock, Users, Euro, Car, Phone, Mail, Info, Shield, Calendar, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const TrialDetail = () => {
  const { id } = useParams();

  // Mock trial data - in real app this would come from an API
  const trial = {
    id: 1,
    title: "Advanced Eczema Treatment Study",
    hospital: "Mater Hospital",
    location: "North Dublin",
    address: "Eccles Street, Dublin 7, D07 R2WY",
    distance: "2.3 km from you",
    duration: "12 weeks",
    description: "This innovative clinical trial is testing a new topical immunomodulator for moderate to severe atopic dermatitis. The treatment has shown promising results in Phase II trials, with significant improvements in skin clearance and quality of life measures.",
    eligibility: {
      age: "18-65 years old",
      condition: "Moderate to severe atopic dermatitis",
      requirements: [
        "Diagnosed with eczema for at least 1 year",
        "Current flare affecting at least 10% of body surface",
        "No biologic treatments in the last 6 months",
        "Willing to discontinue current topical treatments during washout period",
        "Available for all scheduled visits"
      ],
      exclusions: [
        "Pregnant or breastfeeding",
        "Active skin infections",
        "Immunocompromised conditions",
        "Participation in other trials within 30 days"
      ]
    },
    compensation: "€300 total compensation",
    benefits: [
      "Free study medication and supplies",
      "Comprehensive dermatological assessments",
      "24/7 medical support hotline",
      "Travel expense reimbursement",
      "Regular monitoring by specialist team",
      "Early access to innovative treatment"
    ],
    schedule: [
      { visit: "Screening", week: "Week -2", duration: "2 hours", description: "Medical history, physical exam, eligibility confirmation" },
      { visit: "Baseline", week: "Week 0", duration: "1.5 hours", description: "Initial assessments, treatment initiation" },
      { visit: "Follow-up 1", week: "Week 2", duration: "1 hour", description: "Safety check, medication review" },
      { visit: "Follow-up 2", week: "Week 4", duration: "1 hour", description: "Efficacy assessment, side effect monitoring" },
      { visit: "Follow-up 3", week: "Week 8", duration: "1 hour", description: "Progress evaluation, medication adjustment if needed" },
      { visit: "Final Visit", week: "Week 12", duration: "2 hours", description: "Final assessments, study completion" }
    ],
    contact: {
      coordinator: "Dr. Sarah O'Connor",
      phone: "+353 1 803 2000",
      email: "trials@mater.ie",
      hours: "Monday-Friday, 9:00-17:00"
    },
    ethics: {
      approved: "Irish Health Research Ethics Committee",
      protocol: "IHREC Protocol #2024-EZ-001",
      sponsor: "Trinity College Dublin"
    }
  };

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
              
              <h1 className="text-3xl font-bold text-foreground mb-2">{trial.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {trial.hospital} • {trial.location} • {trial.distance}
              </div>
              <p className="text-muted-foreground">{trial.description}</p>
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
                    <span className="text-sm">Duration: {trial.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Phase: III Clinical Trial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{trial.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">Ethics Approved</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card variant="healthcare">
              <CardHeader>
                <CardTitle>Eligibility Requirements</CardTitle>
                <CardDescription>Check if you meet the criteria for this study</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">You must have:</h4>
                  <ul className="space-y-2">
                    {trial.eligibility.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-2">You cannot have:</h4>
                  <ul className="space-y-2">
                    {trial.eligibility.exclusions.map((exc, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
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
                  Why This Trial Matches You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Age match:</strong> You're 25 years old, within the 18-65 age range
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Condition match:</strong> Study targets moderate to severe eczema
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Location preference:</strong> Mater Hospital is in your preferred North Dublin area
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Compensation:</strong> Includes travel support which you indicated was important
                    </p>
                  </div>
                </div>
                <Button variant="default" className="w-full">
                  Check Eligibility
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