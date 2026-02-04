import { GoogleGenAI, Type } from '@google/genai';
import { callModel } from '../_lib/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { meanGrade, topSubjects, courseList } = req.body || {};
  if (!meanGrade || !Array.isArray(topSubjects) || !Array.isArray(courseList)) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const prompt = `Analyze the following courses for a student with Mean Grade ${meanGrade} and top subjects ${topSubjects.join(', ')}. \nOut of these options: ${courseList.slice(0, 50).join(', ')}...\n\nTASK:\nSelect the TOP 20 most MARKETABLE and RECOMMENDED courses for this specific student.\nConsider the 2025-2030 Kenyan Job Market (Health, ICT, Agriculture, Blue Economy, Infrastructure).\n\nReturn a JSON array of 20 objects:\n[{"course": "Course Name", "institution": "Institution", "marketability": "90-99%", "reason": "Short growth-focused reason"}]`;

    const response = await callModel(prompt, { config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT
        }
      }
    }});

    const text = response.text || '[]';
    try {
      const parsed = JSON.parse(text);
      return res.status(200).json(parsed);
    } catch (err) {
      console.error('marketable parse error', err, text);
      return res.status(200).json([]);
    }
  } catch (error: any) {
    console.error('marketable error', error);
    
    // Fallback marketable courses when AI fails
    const fallbackCourses = [
      { course: "Medicine & Surgery", institution: "University of Nairobi", marketability: "98%", reason: "High demand in healthcare sector" },
      { course: "Nursing", institution: "KMTC", marketability: "95%", reason: "Critical healthcare workforce need" },
      { course: "Computer Science", institution: "Kenyatta University", marketability: "92%", reason: "Digital transformation driving demand" },
      { course: "Data Science", institution: "Strathmore", marketability: "94%", reason: "Big data analytics growth" },
      { course: "Software Engineering", institution: "JKUAT", marketability: "93%", reason: "Tech sector expansion" },
      { course: "Business Analytics", institution: "USIU", marketability: "89%", reason: "Data-driven decision making" },
      { course: "Electrical Engineering", institution: "UoN", marketability: "87%", reason: "Infrastructure development" },
      { course: "Mechanical Engineering", institution: "KU", marketability: "85%", reason: "Manufacturing sector growth" },
      { course: "Civil Engineering", institution: "TUK", marketability: "86%", reason: "Construction boom" },
      { course: "Information Technology", institution: "Daystar", marketability: "88%", reason: "Digital adoption across sectors" },
      { course: "Cybersecurity", institution: "Zetech", marketability: "91%", reason: "Security threats increasing" },
      { course: "Digital Marketing", institution: "Multimedia", marketability: "84%", reason: "E-commerce growth" },
      { course: "Finance", institution: "KCA", marketability: "83%", reason: "Financial services expansion" },
      { course: "Accounting", institution: "Egerton", marketability: "82%", reason: "Always in demand" },
      { course: "Human Resource", institution: "Moi", marketability: "79%", reason: "Talent management critical" },
      { course: "Supply Chain", institution: "Kenyatta", marketability: "81%", reason: "Logistics optimization" },
      { course: "Agriculture", institution: "Egerton", marketability: "78%", reason: "Food security focus" },
      { course: "Environmental Science", institution: "KU", marketability: "80%", reason: "Climate change adaptation" },
      { course: "Project Management", institution: "USIU", marketability: "77%", reason: "Complex project execution" },
      { course: "International Relations", institution: "UoN", marketability: "75%", reason: "Global connectivity" }
    ];
    
    return res.status(200).json(fallbackCourses);
  }
}
