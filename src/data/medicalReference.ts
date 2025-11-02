export interface MedicalReference {
  condition: string;
  source: string;
  snippet: string;
}

export const medicalReferences: MedicalReference[] = [
  {
    condition: "Strep Throat",
    source: "Mayo Clinic",
    snippet: "White patches on the throat along with high fever are common signs of streptococcal infection. The bacteria causes inflammation and can lead to complications if untreated.",
  },
  {
    condition: "Influenza",
    source: "NIH",
    snippet: "Sudden onset of fever, chills, body aches, and fatigue are typical signs of influenza. Unlike common cold, flu symptoms appear rapidly and are more severe.",
  },
  {
    condition: "Common Cold",
    source: "CDC",
    snippet: "Gradual onset of symptoms including runny nose, congestion, and mild cough. Fever is uncommon in adults. Symptoms typically resolve within 7-10 days.",
  },
  {
    condition: "COVID-19",
    source: "WHO",
    snippet: "Loss of taste or smell, persistent cough, and difficulty breathing may indicate COVID-19. Fever and fatigue are common early symptoms.",
  },
  {
    condition: "Pneumonia",
    source: "MedlinePlus",
    snippet: "Chest pain when breathing, persistent cough with phlegm, and high fever suggest pneumonia. Shortness of breath is a serious indicator requiring immediate attention.",
  },
  {
    condition: "Allergic Rhinitis",
    source: "American Academy of Allergy",
    snippet: "Sneezing, itchy eyes, and clear nasal discharge without fever suggest allergic rhinitis. Symptoms often worsen with seasonal changes or exposure to allergens.",
  },
  {
    condition: "Bronchitis",
    source: "American Lung Association",
    snippet: "Persistent cough producing mucus, chest discomfort, and mild fever indicate bronchitis. Symptoms typically last 3 weeks and improve gradually.",
  },
  {
    condition: "Sinusitis",
    source: "Johns Hopkins Medicine",
    snippet: "Facial pain and pressure, thick nasal discharge, and headache suggest sinusitis. Symptoms persisting beyond 10 days may indicate bacterial infection.",
  },
  {
    condition: "Tonsillitis",
    source: "Cleveland Clinic",
    snippet: "Severely swollen tonsils with white or yellow coating, difficulty swallowing, and swollen lymph nodes are signs of tonsillitis requiring medical evaluation.",
  },
  {
    condition: "Migraine",
    source: "National Headache Foundation",
    snippet: "Severe throbbing headache, often on one side, accompanied by nausea and sensitivity to light suggests migraine. May last 4-72 hours if untreated.",
  },
];

export function findRelevantReferences(symptoms: string[]): MedicalReference[] {
  const lowerSymptoms = symptoms.map(s => s.toLowerCase());
  return medicalReferences.filter(ref => 
    lowerSymptoms.some(symptom => 
      ref.snippet.toLowerCase().includes(symptom) || 
      ref.condition.toLowerCase().includes(symptom)
    )
  );
}
