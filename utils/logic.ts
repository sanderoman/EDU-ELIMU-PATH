
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

export const calculateClusterPoints = (selectedSubjects: SubjectGrade[], clusterSubjects: string[]): number => {
  if (!clusterSubjects || clusterSubjects.length === 0) return 0;

  // Check minimum mean grade of C+ for degree qualification
  const meanGrade = calculateMeanGrade(selectedSubjects);
  const meanPoints = GradeToPoints[meanGrade];
  const cPlusPoints = GradeToPoints['C+'];
  if (meanPoints < cPlusPoints) {
    return 0; // No cluster points for students below C+
  }

  // Get grades for cluster subjects
  const clusterSubjectGrades = selectedSubjects.filter(sub =>
    clusterSubjects.includes(sub.name)
  );

  if (clusterSubjectGrades.length < 4) return 0; // Need at least 4 cluster subjects

  // Calculate r: sum of best 4 cluster subjects
  const bestClusterGrades = clusterSubjectGrades
    .sort((a, b) => b.points - a.points)
    .slice(0, 4);
  const r = bestClusterGrades.reduce((sum, sub) => sum + sub.points, 0);

  // Calculate t: sum of best 7 subjects from all selected subjects
  const best7Subjects = selectedSubjects
    .sort((a, b) => b.points - a.points)
    .slice(0, 7);
  const t = best7Subjects.reduce((sum, sub) => sum + sub.points, 0);

  // National maximums for 2025
  const R = 48; // Maximum cluster points (4 subjects × 12 points)
  const T = 84; // Maximum aggregate points (7 subjects × 12 points)

  // KUCCPS Weighted Cluster Point formula: C = (r/R) * (t/T) * 48
  const weightedClusterPoints = (r / R) * (t / T) * 48;

  // Round to 3 decimal places to match KUCCPS accuracy
  return Math.round(weightedClusterPoints * 1000) / 1000;
};

export const getEligibleCourses = (
  meanGrade: Grade,
  selectedSubjects: SubjectGrade[],
  courses: Course[]
): Course[] => {
  const meanPoints = GradeToPoints[meanGrade];
  const cpPoints = GradeToPoints['C+'];
  const cPoints = GradeToPoints['C'];
  const cMinusPoints = GradeToPoints['C-'];
  const dPlusPoints = GradeToPoints['D+'];
  const dPoints = GradeToPoints['D'];

  return courses.filter(course => {
    // 1. Check Minimum Entry Grade
    const minGradePoints = GradeToPoints[course.minGrade];
    if (meanPoints < minGradePoints) {
      return false;
    }

    // 2. Check Minimum Subject Requirements
    if (course.requiredSubjects && course.requiredSubjects.length > 0) {
      const studentSubjectNames = selectedSubjects.map(s => s.name);
      const hasAllRequired = course.requiredSubjects.every(reqSub =>
        studentSubjectNames.includes(reqSub)
      );
      if (!hasAllRequired) {
        return false;
      }

      // Check minimum grades for required subjects
      for (const reqSub of course.requiredSubjects) {
        const studentGrade = selectedSubjects.find(s => s.name === reqSub)?.grade;
        if (!studentGrade) continue;

        const studentPoints = GradeToPoints[studentGrade];
        // For competitive programmes, required subjects often need B or above
        // This is a simplified check - in reality it varies by programme
        if (course.type === 'University' && studentPoints < GradeToPoints['B']) {
          return false;
        }
      }
    }

    // 3. For Degree programmes: Check Cluster Subject Grades and Calculate Points
    if (course.type === 'University') {
      if (course.clusterSubjects && course.clusterSubjects.length > 0) {
        // Use the official KUCCPS Weighted Cluster Point formula
        const weightedClusterPoints = calculateClusterPoints(selectedSubjects, course.clusterSubjects);

        // Compare with cut-off point
        const cutoffPoints = course.cutoffPoints ?? 35.0; // Default cutoff if not specified
        if (weightedClusterPoints < cutoffPoints) {
          return false;
        }
      }
    }

    // 4. For Diploma/Certificate/Artisan programmes: No cluster competition
    // They appear if mean grade and subject requirements are met
    if (course.type === 'College' || course.type === 'TVET' || course.type === 'TTC') {
      return true; // Already passed the grade and subject checks above
    }

    return true;
  });
};
