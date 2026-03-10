
export type Grade = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E';

export interface SubjectGrade {
  name: string;
  grade: Grade;
  points: number;
}

export interface University {
  id: string;
  name: string;
  logo: string;
  category: 'PUBLIC' | 'PRIVATE' | 'KMTC' | 'TVET';
  description: string;
  topCourses: Course[];
  apiSlug: string; // Used for hypothetical /api/universities/:apiSlug/courses
}

export interface CutoffInfo {
  /** numeric cluster point cutoff from KUCCPS data */
  clusterPoints: number;
  /** minimum mean grade requirement if specified (e.g. C+, B- etc) */
  minGradeRequirement?: Grade;
  /** list of subjects required by the programme (cluster-specific) */
  requiredSubjects?: string[];
  /**
   * Notes about sponsorship or category-specific variations (public/private/etc).
   * KUCCPS cutoffs generally apply to all categories but this field can document
   * known differences if necessary.
   */
  comments?: string;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  type: 'University' | 'College' | 'TVET' | 'TTC';
  duration: string;
  minGrade: Grade;
  clusterSubjects: string[];
  /**
   * Representative cluster point cutoff used by eligibility filter.
   * Numeric value (e.g. sum of top 3 subject points) on a 0–36 scale.
   * May be overridden by `cutoffPoints` from real data.
   */
  clusterPoints?: number;
  /**
   * Explicit KUCCPS cutoff information (takes precedence over clusterPoints)
   */
  cutoffPoints?: number;
  /**
   * Subjects that must be present among the student's best subjects.
   */
  requiredSubjects?: string[];
  description?: string;
  kuccpsLink?: string;
}

export interface PaymentRecord {
  id: string;
  studentName: string;
  phone: string;
  amount: number;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'FraudAttempt';
  transactionId?: string;
  verifiedBy: 'AI' | 'MANUAL' | 'OTP';
  rawMessage?: string; // Captured for auditing
  reason?: string;
}

export interface MasterKey {
  id: string;
  code: string;
  label: string;
  createdAt: string;
  activatedAt?: string;
  expiresAt?: string;
  status: 'active' | 'inactive' | 'expired';
  createdBy: string;
  lastValidatedAt?: string;
  usageCount: number;
  linkedPhones: string[];
}

export const GradeToPoints: Record<Grade, number> = {
  'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
};
