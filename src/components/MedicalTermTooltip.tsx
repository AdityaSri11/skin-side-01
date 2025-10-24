import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MEDICAL_TERMS: Record<string, string> = {
  "observational study": "Studies that don't give treatments — they simply watch and record what happens.",
  "clinical trial": "Studies actively give treatments to see if they work.",
  "clinical trials": "Studies actively give treatments to see if they work.",
  "treatment group": "Group of people in a clinical trial that gets the real medicine or procedure.",
  "control group": "Gets a placebo or standard care. Sometimes neither the patient nor doctor knows which one they got — this is called blinding.",
  "phase 0": "Tiny doses in a few people to learn how the body handles the drug.",
  "phase i": "Small study to test safety and dosage.",
  "phase 1": "Small study to test safety and dosage.",
  "phase ii": "Looks for signs the treatment works.",
  "phase 2": "Looks for signs the treatment works.",
  "phase iii": "Confirms effectiveness in large groups.",
  "phase 3": "Confirms effectiveness in large groups.",
  "phase iv": "Done after approval to watch for side effects over time.",
  "phase 4": "Done after approval to watch for side effects over time.",
  "placebo": "A fake pill or treatment used for comparison.",
  "randomization": "Choosing who gets which treatment by chance.",
  "endpoint": "What the study measures (like fewer heart attacks or lower blood pressure).",
  "adverse event": "A side effect or unwanted reaction.",
  "informed consent": "The process of explaining the study so people can decide if they want to join.",
};

interface MedicalTermTooltipProps {
  text: string;
  className?: string;
}

export const MedicalTermTooltip = ({ text, className = "" }: MedicalTermTooltipProps) => {
  const wrapTerms = (inputText: string): ReactNode[] => {
    const result: ReactNode[] = [];
    let remainingText = inputText;
    let keyCounter = 0;

    // Create regex pattern from all terms (longest first to match longer phrases first)
    const sortedTerms = Object.keys(MEDICAL_TERMS).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(
      `\\b(${sortedTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
      'gi'
    );

    while (remainingText.length > 0) {
      const match = pattern.exec(remainingText);
      
      if (!match) {
        result.push(<span key={`text-${keyCounter++}`}>{remainingText}</span>);
        break;
      }

      // Add text before match
      if (match.index > 0) {
        result.push(
          <span key={`text-${keyCounter++}`}>
            {remainingText.substring(0, match.index)}
          </span>
        );
      }

      // Add matched term with tooltip
      const matchedTerm = match[0];
      const definition = MEDICAL_TERMS[matchedTerm.toLowerCase()];
      
      result.push(
        <Tooltip key={`tooltip-${keyCounter++}`}>
          <TooltipTrigger asChild>
            <span className="underline decoration-dotted cursor-help text-emerald-600 dark:text-emerald-400 font-medium">
              {matchedTerm}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-card border-border shadow-lg">
            <p className="text-card-foreground">{definition}</p>
          </TooltipContent>
        </Tooltip>
      );

      // Update remaining text
      remainingText = remainingText.substring(match.index + matchedTerm.length);
      pattern.lastIndex = 0; // Reset regex
    }

    return result;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <span className={className}>{wrapTerms(text)}</span>
    </TooltipProvider>
  );
};
