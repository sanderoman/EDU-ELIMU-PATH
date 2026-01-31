
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

export interface Course {
  id: string;
  name: string;
  institution: string;
  type: 'University' | 'College' | 'TVET' | 'TTC';
  duration: string;
  minGrade: Grade;
  clusterSubjects: string[];
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
}

export const GradeToPoints: Record<Grade, number> = {
  'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
};
