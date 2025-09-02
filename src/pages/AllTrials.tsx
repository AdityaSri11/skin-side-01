import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AllTrials = () => {
  // Mock trial data - replace with real data later
  const trials = [
    {
      id: 1,
      title: "Advanced Psoriasis Treatment Study",
      description: "Evaluating a new topical treatment for moderate to severe plaque psoriasis",
      location: "Dublin City Centre",
      compensation: "€500",
      duration: "12 weeks",
      participants: "24/30",
      status: "Recruiting",
      condition: "Psoriasis",
      type: "Phase III Clinical Trial"
    },
    {
      id: 2,
      title: "Eczema Therapy Research",
      description: "Testing innovative treatment approaches for atopic dermatitis patients",
      location: "Trinity College Dublin",
      compensation: "€350",
      duration: "8 weeks",
      participants: "18/25",
      status: "Recruiting",
      condition: "Eczema",
      type: "Phase II Clinical Trial"
    },
    {
      id: 3,
      title: "Melanoma Prevention Study",
      description: "Long-term study on skin cancer prevention strategies and early detection",
      location: "St. James's Hospital",
      compensation: "€750",
      duration: "24 weeks",
      participants: "45/50",
      status: "Recruiting",
      condition: "Skin Cancer",
      type: "Observational Study"
    },
    {
      id: 4,
      title: "Acne Treatment Breakthrough",
      description: "Revolutionary approach to treating severe acne in young adults",
      location: "UCD Hospital",
      compensation: "€400",
      duration: "16 weeks",
      participants: "12/20",
      status: "Recruiting",
      condition: "Acne",
      type: "Phase II Clinical Trial"
    },
    {
      id: 5,
      title: "Rosacea Management Trial",
      description: "Comprehensive study on managing rosacea symptoms and triggers",
      location: "Mater Hospital",
      compensation: "€300",
      duration: "10 weeks",
      participants: "30/35",
      status: "Recruiting",
      condition: "Rosacea",
      type: "Phase III Clinical Trial"
    },
    {
      id: 6,
      title: "Wound Healing Research",
      description: "Advanced wound healing techniques for chronic skin conditions",
      location: "Beaumont Hospital",
      compensation: "€600",
      duration: "20 weeks",
      participants: "8/15",
      status: "Starting Soon",
      condition: "Wound Healing",
      type: "Phase I Clinical Trial"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recruiting":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Starting Soon":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Active Clinical Trials
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover dermatology clinical trials in Dublin. Find studies that match your condition and help advance medical research.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trials by condition, location, or keywords..."
                    className="pl-10"
                  />
                </div>
                <Button variant="healthcare">
                  Search Trials
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trials.map((trial) => (
            <Card key={trial.id} variant="healthcare" className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {trial.type}
                  </Badge>
                  <Badge className={getStatusColor(trial.status)}>
                    {trial.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {trial.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {trial.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {trial.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {trial.duration}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {trial.participants} participants
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div>
                    <span className="text-sm text-muted-foreground">Compensation</span>
                    <p className="font-semibold text-healthcare">{trial.compensation}</p>
                  </div>
                  <Link to={`/trial/${trial.id}`}>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card variant="soft">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Don't See a Match?
              </h2>
              <p className="text-muted-foreground mb-6">
                Take our questionnaire to get personalized trial recommendations based on your specific condition and preferences.
              </p>
              <Link to="/questionnaire">
                <Button variant="healthcare" size="lg">
                  Take Questionnaire
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllTrials;