import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateTrialTitle } from "@/lib/utils";

const AllTrials = () => {
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrials = async () => {
      try {
        // First sync RSS data
        console.log('Syncing RSS data...');
        const { error: syncError } = await supabase.functions.invoke('sync-trials-rss');
        
        if (syncError) {
          console.error('Error syncing RSS:', syncError);
        } else {
          console.log('RSS sync completed');
        }

        // Then fetch updated trials
        const { data, error } = await supabase
          .from('derm')
          .select('*');

        if (error) {
          console.error('Error fetching trials:', error);
          return;
        }

        setTrials(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  }, []);

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
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading trials...</p>
          </div>
        ) : trials.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No trials found.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trials.map((trial, index) => (
              <Card key={trial.id || index} variant="healthcare" className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg leading-tight">
                    {generateTrialTitle(trial.Description, trial.Number)}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Status: {trial.Status} | Phase: {trial.Phase}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm text-muted-foreground">
                      Trial Entry
                    </div>
                    <Link to={`/trial/${trial.Number}`}>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllTrials;