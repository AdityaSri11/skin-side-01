import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MedicalTermTooltip } from "@/components/MedicalTermTooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTrialLookup } from "@/hooks/useTrialLookup";

interface AIMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: any;
  savedMatches?: any;
  onMatchSaved?: () => void;
}

export const AIMatchDialog = ({ open, onOpenChange, profileData, savedMatches, onMatchSaved }: AIMatchDialogProps) => {
  const [matching, setMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<any>(null);
  const [canRematch, setCanRematch] = useState(true);
  const [profileChanged, setProfileChanged] = useState(false);
  const { toast } = useToast();

  const trialNumbers = useMemo(() => {
    const matches = matchResults?.matches || [];
    return matches.map((m: any) => m.trialNumber).filter(Boolean);
  }, [matchResults]);

  const { trialDetails, loading: trialLoading } = useTrialLookup(trialNumbers);

  useEffect(() => {
    if (savedMatches && profileData) {
      const profileSnapshot = savedMatches.profile_snapshot;
      const hasChanges = JSON.stringify(profileData) !== JSON.stringify(profileSnapshot);
      setProfileChanged(hasChanges);
      setCanRematch(hasChanges);
      
      if (!matchResults) {
        setMatchResults(savedMatches.match_data);
      }
    } else {
      setCanRematch(true);
      setProfileChanged(false);
    }
  }, [savedMatches, profileData, open]);

  const saveMatchResults = async (matches: any) => {
    if (!profileData) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const matchData = {
        user_id: user.id,
        match_data: matches,
        profile_snapshot: profileData,
      };

      const { error } = await supabase
        .from('ai_match_results')
        .upsert(matchData, { onConflict: 'user_id' });

      if (error) throw error;
      onMatchSaved?.();
    } catch (error) {
      console.error('Error saving match results:', error);
    }
  };

  const handleMatchTrials = async () => {
    if (!profileData) return;

    setMatching(true);
    setMatchResults(null);

    try {
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

      const { data, error } = await supabase.functions.invoke('match-trials', {
        body: {
          userProfile: profileData,
          trials: trials
        }
      });

      if (error) throw error;

      setMatchResults(data);
      await saveMatchResults(data);

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
          {!canRematch && !profileChanged && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You already have saved match results. Update your profile information to run AI matching again.
              </AlertDescription>
            </Alert>
          )}

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

              {matchResults.matches.map((match: any, idx: number) => {
                const dbTrial = trialDetails[match.trialNumber];
                const trialName = dbTrial?.Description || match.trialName || `Trial ${match.trialNumber}`;
                const trialNumber = match.trialNumber;
                const product = dbTrial?.Product || match.product || null;
                const sponsor = dbTrial?.Sponsor || match.sponsor || null;

                return (
                  <Card key={idx} variant="soft">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold">{trialName}</h4>
                        <Badge variant={match.matchScore >= 80 ? "default" : "secondary"} className="text-base px-3 py-1 shrink-0 ml-3">
                          {match.matchScore}% Match
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm bg-muted/50 rounded-lg p-3">
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Trial Number</Label>
                          <p className="text-foreground font-medium">{trialNumber}</p>
                        </div>
                        {product && (
                          <div>
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</Label>
                            <p className="text-foreground font-medium">{product}</p>
                          </div>
                        )}
                        {sponsor && (
                          <div>
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sponsor</Label>
                            <p className="text-foreground font-medium">{sponsor}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        {match.matchReasons && match.matchReasons.length > 0 && (
                          <div>
                            <Label className="text-sm font-semibold text-muted-foreground">Match Reasons:</Label>
                            <ul className="list-disc list-inside space-y-2 mt-2">
                              {match.matchReasons.map((reason: string, i: number) => (
                                <li key={i} className="text-foreground">
                                  <MedicalTermTooltip text={reason} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {match.concerns && match.concerns.length > 0 && (
                          <div>
                            <Label className="text-sm font-semibold text-muted-foreground">Considerations:</Label>
                            <ul className="list-disc list-inside space-y-2 mt-2">
                              {match.concerns.map((concern: string, i: number) => (
                                <li key={i} className="text-orange-600">
                                  <MedicalTermTooltip text={concern} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {match.recommendation && (
                          <div>
                            <Label className="text-sm font-semibold text-muted-foreground">Recommendation:</Label>
                            <p className="text-foreground mt-2 leading-relaxed">
                              <MedicalTermTooltip text={match.recommendation} />
                            </p>
                          </div>
                        )}
                        <div className="pt-2">
                          <Button 
                            variant="default" 
                            className="w-full"
                            onClick={() => {
                              window.open(`/trial/${encodeURIComponent(trialNumber)}`, '_blank');
                            }}
                          >
                            View All Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex justify-center gap-4 pt-4">
                <Button 
                  variant="hero"
                  onClick={handleMatchTrials}
                  disabled={matching}
                >
                  {matching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Re-run AI Matching
                    </>
                  )}
                </Button>
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
