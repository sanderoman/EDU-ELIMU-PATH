import { CutoffInfo } from './types';

// Placeholder dataset containing actual KUCCPS cut-off information for selected
// programmes. The keys are of the form "<programme>|<institution>". In a real
// application this would be populated with authoritative data (perhaps fetched
// from a remote API or maintained manually by admins).

export const KUCCPS_CUTOFFS: Record<string, CutoffInfo> = {
  // law programmes
  'Bachelor of Laws (LLB)|University of Nairobi': {
    clusterPoints: 34,
    minGradeRequirement: 'B+',
    requiredSubjects: ['English', 'History & Government'],
    comments: 'Public and private applicants treated the same'
  },
  'Bachelor of Laws (LLB)|Moi University': {
    clusterPoints: 32,
    minGradeRequirement: 'B',
    requiredSubjects: ['English', 'History & Government']
  },

  // engineering examples
  'Bachelor of Science in Civil Engineering|Jomo Kenyatta University of Agriculture and Technology': {
    clusterPoints: 36,
    minGradeRequirement: 'A-',
    requiredSubjects: ['Mathematics', 'Physics']
  },
  'Bachelor of Science in Electrical Engineering|University of Nairobi': {
    clusterPoints: 35,
    minGradeRequirement: 'A-',
    requiredSubjects: ['Mathematics', 'Physics']
  },

  // medical example
  'Bachelor of Medicine & Surgery|University of Nairobi': {
    clusterPoints: 36,
    minGradeRequirement: 'A',
    requiredSubjects: ['Biology', 'Chemistry'],
    comments: 'Same cutoff across all sponsorship categories'
  },

  // generic fallback for illustration
  'default': { clusterPoints: 0 }
};
