import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: any;
}

export const AIMatchDialog = ({ open, onOpenChange, profileData }: AIMatchDialogProps) => {
  const [matching, setMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<any>(null);
  const { toast } = useToast();

  const handleMatchTrials = async () => {
    if (!profileData) return;

    setMatching(true);
    setMatchResults(null);

    try {
      // Fetch all trials from database
      const { data: trials, error: trialsError } = await supabase
        .from('derm')
        .select('*');

      if (trialsError) throw trialsError;

      if (!trials || trials.length === 0) {
        toast({
          title: "No Trials Available",
          description: "There are no clinical trials in the database to match against.",
          variant: "destructive",
        });
        return;
      }

      // Call the matching edge function
      const { data, error } = await supabase.functions.invoke('match-trials', {
        body: {
          userProfile: profileData,
          trials: trials
        }
      });

      if (error) throw error;

      setMatchResults(data);

      if (data.matches && data.matches.length > 0) {
        toast({
          title: "Matches Found!",
          description: `Found ${data.matches.length} potential trial match${data.matches.length > 1 ? 'es' : ''} for you.`,
        });
      } else {
        toast({
          title: "No Matches",
          description: "No suitable clinical trials were found based on your profile.",
        });
      }
    } catch (error) {
      console.error('Error matching trials:', error);
      toast({
        title: "Error",
        description: "Failed to match trials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMatching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Sparkles className="h-6 w-6 mr-2" />
            AI Trial Matching
          </DialogTitle>
          <DialogDescription>
            Find clinical trials that match your health profile using AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!matchResults && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-6">
                Click the button below to match your profile against available clinical trials
              </p>
              <Button 
                variant="hero" 
                size="lg"
                onClick={handleMatchTrials}
                disabled={matching || !profileData}
              >
                {matching ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing Trials...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Start AI Matching
                  </>
                )}
              </Button>
            </div>
          )}

          {matchResults && matchResults.matches && matchResults.matches.length > 0 && (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="font-semibold text-primary">
                  {matchResults.matches.length} Trial{matchResults.matches.length > 1 ? 's' : ''} Matched Your Profile
                </p>
              </div>

              {matchResults.matches.map((match: any, idx: number) => (
                <Card key={idx} variant="soft">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold">Trial {match.trialNumber}</h4>
                      <Badge variant={match.matchScore >= 80 ? "default" : "secondary"} className="text-base px-3 py-1">
                        {match.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Match Reasons:</Label>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                          {match.matchReasons.map((reason: string, i: number) => (
                            <li key={i} className="text-foreground">{reason}</li>
                          ))}
                        </ul>
                      </div>
                      {match.concerns && match.concerns.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold text-muted-foreground">Considerations:</Label>
                          <ul className="list-disc list-inside space-y-2 mt-2">
                            {match.concerns.map((concern: string, i: number) => (
                              <li key={i} className="text-orange-600">{concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {match.recommendation && (
                        <div>
                          <Label className="text-sm font-semibold text-muted-foreground">Recommendation:</Label>
                          <p className="text-foreground mt-2 leading-relaxed">{match.recommendation}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setMatchResults(null);
                    onOpenChange(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {matchResults && matchResults.matches && matchResults.matches.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-6">
                No suitable clinical trials were found based on your current profile.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setMatchResults(null);
                  onOpenChange(false);
                }}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
