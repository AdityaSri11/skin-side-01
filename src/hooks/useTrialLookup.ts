import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrialDetails {
  Number: string;
  Description: string | null;
  Product: string | null;
  Sponsor: string;
  Status: string | null;
  Phase: string | null;
  Conditions: string | null;
}

export function useTrialLookup(trialNumbers: string[]) {
  const [trialDetails, setTrialDetails] = useState<Record<string, TrialDetails>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trialNumbers || trialNumbers.length === 0) {
      setTrialDetails({});
      return;
    }

    const fetchTrials = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('derm')
        .select('Number, Description, Product, Sponsor, Status, Phase, Conditions')
        .in('Number', trialNumbers);

      if (!error && data) {
        const map: Record<string, TrialDetails> = {};
        data.forEach((trial) => {
          map[trial.Number] = trial;
        });
        setTrialDetails(map);
      }
      setLoading(false);
    };

    fetchTrials();
  }, [JSON.stringify(trialNumbers)]);

  return { trialDetails, loading };
}
