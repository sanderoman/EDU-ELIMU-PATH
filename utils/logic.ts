
import { Grade, GradeToPoints, SubjectGrade, Course } from '../types';

export const calculateMeanGrade = (grades: SubjectGrade[]): Grade => {
  if (grades.length === 0) return 'E';
  const totalPoints = grades.reduce((sum, g) => sum + g.points, 0);
  const average = totalPoints / grades.length;
  
  const entries = Object.entries(GradeToPoints) as [Grade, number][];
  entries.sort((a, b) => b[1] - a[1]);
  
  for (const [grade, points] of entries) {
    if (average >= points - 0.5) return grade;
  }
  return 'E';
};

export const getEligibleCourses = (meanGrade: Grade, courses: Course[]): Course[] => {
  const meanPoints = GradeToPoints[meanGrade];
  const cpPoints = GradeToPoints['C+'];
  const cPoints = GradeToPoints['C'];
  const cMinusPoints = GradeToPoints['C-'];
  const dPlusPoints = GradeToPoints['D+'];
  
  return courses.filter(course => {
    const minPoints = GradeToPoints[course.minGrade];
    
    // KUCCPS Grade-Based Programme Level System
    
    // RULE 1: C+ and above = Degree Programmes
    if (meanPoints >= cpPoints) {
      // Student qualifies for degree programmes
      return course.type === 'University' && meanPoints >= minPoints;
    }
    
    // RULE 2: C and C- = Diploma Programmes
    if (meanPoints >= cMinusPoints && meanPoints <= cPoints) {
      // Student qualifies for diploma programmes across universities, TVET, and colleges
      return (course.type === 'College' || course.type === 'TVET') && meanPoints >= minPoints;
    }
    
    // RULE 3: D+ = Certificate & Artisan Programmes
    if (meanPoints >= dPlusPoints && meanPoints < cMinusPoints) {
      // Student qualifies for technical certificate, artisan, and bridging courses
      return (course.type === 'TVET' || course.type === 'TTC') && meanPoints >= minPoints;
    }
    
    // Below D+ - no programmes available
    return false;
  });
};
