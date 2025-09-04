import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTrialTitle(description: string, fallback: string = "Clinical Trial"): string {
  if (!description || description.trim().length === 0) {
    return fallback;
  }

  // Remove common clinical trial boilerplate words
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'within', 'without', 'against', 'across', 'around', 'under', 'over', 'upon', 'near', 'far', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall', 'study', 'trial', 'clinical', 'research', 'investigate', 'evaluation', 'assess', 'treatment', 'therapy', 'drug', 'medication', 'test', 'testing', 'participants', 'patients', 'subjects', 'phase', 'randomized', 'controlled', 'double', 'blind', 'placebo'];
  
  // Split into words and filter out stop words and short words
  const words = description
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !stopWords.includes(word) &&
      !/^\d+$/.test(word) // Remove pure numbers
    );

  // Prioritize medical/condition related terms
  const medicalTerms = words.filter(word => 
    word.includes('dermat') ||
    word.includes('skin') ||
    word.includes('acne') ||
    word.includes('psoriasis') ||
    word.includes('eczema') ||
    word.includes('melanoma') ||
    word.includes('cancer') ||
    word.includes('inflammatory') ||
    word.includes('autoimmune') ||
    word.includes('topical') ||
    word.includes('systemic') ||
    word.length > 6 // Longer words are often more specific
  );

  // Take the best terms (medical terms first, then other meaningful words)
  const selectedWords = [...medicalTerms, ...words]
    .slice(0, 5) // Max 5 words to stay under 6
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates

  if (selectedWords.length === 0) {
    return fallback;
  }

  // Capitalize first letter of each word
  const title = selectedWords
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return title.length > 50 ? title.substring(0, 50).trim() : title;
}
