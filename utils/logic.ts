
import { Grade, GradeToPoints, SubjectGrade, Course } from '../types';

export const calculateMeanGrade = (grades: SubjectGrade[]): Grade => {
  if (grades.length === 0) return 'E';
  
  // KNEC Official Method: Use BEST 7 subjects only
  const sortedGrades = grades
    .sort((a, b) => b.points - a.points) // Sort by points descending
    .slice(0, 7); // Take top 7 subjects
  
  // If student has less than 7 subjects, use all available
  const subjectsToUse = sortedGrades.length > 0 ? sortedGrades : grades;
  
  // Calculate total points from best 7 subjects
  const totalPoints = subjectsToUse.reduce((sum, g) => sum + g.points, 0);
  const averagePoints = totalPoints / subjectsToUse.length;
  
  // Round to nearest whole point (KNEC standard)
  const roundedPoints = Math.round(averagePoints);
  
  // Convert back to letter grade using official KNEC scale
  const entries = Object.entries(GradeToPoints) as [Grade, number][];
  entries.sort((a, b) => b[1] - a[1]);
  
  for (const [grade, points] of entries) {
    if (roundedPoints >= points) return grade;
  }
  
  return 'E';
};

export const getMeanGradeDetails = (grades: SubjectGrade[]) => {
  if (grades.length === 0) {
    return {
      meanGrade: 'E',
      totalPoints: 0,
      averagePoints: 0,
      roundedPoints: 0,
      bestSubjects: [],
      totalSubjects: grades.length
    };
  }
  
  // KNEC Official Method: Use BEST 7 subjects only
  const sortedGrades = grades
    .sort((a, b) => b.points - a.points) // Sort by points descending
    .slice(0, 7); // Take top 7 subjects
  
  // If student has less than 7 subjects, use all available
  const subjectsToUse = sortedGrades.length > 0 ? sortedGrades : grades;
  
  // Calculate total points from best 7 subjects
  const totalPoints = subjectsToUse.reduce((sum, g) => sum + g.points, 0);
  const averagePoints = totalPoints / subjectsToUse.length;
  
  // Round to nearest whole point (KNEC standard)
  const roundedPoints = Math.round(averagePoints);
  
  // Convert back to letter grade using official KNEC scale
  const entries = Object.entries(GradeToPoints) as [Grade, number][];
  entries.sort((a, b) => b[1] - a[1]);
  
  let meanGrade = 'E';
  for (const [grade, points] of entries) {
    if (roundedPoints >= points) {
      meanGrade = grade;
      break;
    }
  }
  
  return {
    meanGrade,
    totalPoints,
    averagePoints,
    roundedPoints,
    bestSubjects: subjectsToUse,
    totalSubjects: grades.length
  };
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
