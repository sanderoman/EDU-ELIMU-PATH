
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
  const dPoints = GradeToPoints['D'];
  const dMinusPoints = GradeToPoints['D-'];
  
  return courses.filter(course => {
    const minPoints = GradeToPoints[course.minGrade];
    
    // RULE 1: Universities (Degree) require C+ and above strictly.
    if (course.type === 'University' && meanPoints < cpPoints) {
      return false;
    }
    
    // RULE 2: C Plain and below students are matched with Colleges, TVETs, and TTCs.
    // The filter naturally allows them if their points meet the course minGrade.
    
    // Check general point eligibility
    return meanPoints >= minPoints;
  });
};
