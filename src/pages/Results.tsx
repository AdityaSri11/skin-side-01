import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, MapPin, Clock, Users, Euro, Car, Info, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Results = () => {
  const matches = [
    {
      id: 1,
      title: "Advanced Eczema Treatment Study",
      hospital: "Mater Hospital",
      location: "North Dublin",
      distance: "2.3 km from you",
      duration: "12 weeks",
      description: "Testing a new topical immunomodulator for moderate to severe atopic dermatitis. This cutting-edge treatment shows promising results in early trials.",
      eligibility: "Ages 18-65, moderate to severe eczema, no biologics in last 6 months",
      matchScore: 95,
      compensation: "€300",
      benefits: ["Travel reimbursement", "Free medication", "Regular check-ups"],
      badges: ["compensation", "travel", "location"],
      urgency: "high"
    },
    {
      id: 2,
      title: "Biologics for Eczema Research",
      hospital: "St. Vincent's Hospital",
      location: "South Dublin",
      distance: "8.1 km from you",
      duration: "24 weeks",
      description: "Comparing effectiveness of two biological treatments for patients with treatment-resistant eczema.",
      eligibility: "Ages 21-70, severe eczema, failed conventional treatments",
      matchScore: 87,
      compensation: "€500",
      benefits: ["Specialist care", "24/7 support line", "Parking provided"],
      badges: ["compensation", "location"],
      urgency: "medium"
    },
    {
      id: 3,
      title: "Digital Health Monitoring Trial",
      hospital: "Beaumont Hospital",
      location: "North Dublin",
      distance: "5.7 km from you",
      duration: "16 weeks",
      description: "Innovative study using smart patches to monitor eczema symptoms and treatment response in real-time.",
      eligibility: "Ages 16-60, mild to moderate eczema, smartphone required",
      matchScore: 78,
      compensation: "€200",
      benefits: ["Latest technology", "Flexible schedule", "Remote monitoring"],
      badges: ["travel", "pediatric"],
      urgency: "low"
    }
  ];

  const getBadgeVariant = (badge: string) => {
    const variants: { [key: string]: any } = {
      compensation: "compensation",
      travel: "travel",
      location: "location",
      pediatric: "pediatric"
    };
    return variants[badge] || "secondary";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-destructive";
      case "medium": return "bg-warning";
      case "low": return "bg-success";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-trust py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/questionnaire" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questionnaire
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Trial Matches</h1>
          <p className="text-muted-foreground">Found {matches.length} clinical trials that match your profile</p>
        </div>

        {/* AI Explanation */}
        <Card variant="healing" className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">How Our AI Found These Matches</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Our ethical AI considered your age (25), eczema condition, North Dublin location, and willingness to travel locally. 
                  We prioritized trials with good travel support and matched your availability preferences.
                </p>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  <Info className="h-4 w-4 mr-2" />
                  Learn more about our AI ethics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {matches.map((match) => (
            <Card key={match.id} variant="trial" className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getUrgencyColor(match.urgency)}`}></div>
                    <span className="text-xs text-muted-foreground">
                      {match.urgency === "high" ? "Urgent recruitment" : 
                       match.urgency === "medium" ? "Active recruitment" : "Open enrollment"}
                    </span>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" className="text-xs">
                      {match.matchScore}% match
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {match.badges.map((badge) => (
                    <Badge key={badge} variant={getBadgeVariant(badge)} className="text-xs">
                      {badge === "compensation" && <Euro className="h-3 w-3 mr-1" />}
                      {badge === "travel" && <Car className="h-3 w-3 mr-1" />}
                      {badge === "location" && <MapPin className="h-3 w-3 mr-1" />}
                      {badge === "pediatric" && <Users className="h-3 w-3 mr-1" />}
                      {badge === "compensation" ? `${match.compensation} compensation` :
                       badge === "travel" ? "Travel support" :
                       badge === "location" ? "Near you" :
                       "All ages welcome"}
                    </Badge>
                  ))}
                </div>

                <CardTitle className="text-xl text-foreground">{match.title}</CardTitle>
                <CardDescription className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {match.hospital} • {match.location} • {match.distance}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{match.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Duration & Timeline</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {match.duration}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Key Benefits</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {match.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-success rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium text-foreground mb-2">Eligibility Requirements</h4>
                  <p className="text-sm text-muted-foreground">{match.eligibility}</p>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Link to={`/trial/${match.id}`}>
                    <Button variant="outline">
                      View Details
                      <Info className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  
                  <Button variant="hero">
                    Apply Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-muted-foreground">
            Don't see the right match? We can help you find more options.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline">
              Refine Search
            </Button>
            <Button variant="soft">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;