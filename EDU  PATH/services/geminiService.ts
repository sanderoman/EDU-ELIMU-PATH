
import { GoogleGenAI, Type } from "@google/genai";

export interface GroundedResponse {
  text: string;
  sources: { title: string; uri: string }[];
}

export const getCareerAdvice = async (meanGrade: string, topSubjects: string[]) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY environment variable is not configured');
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Act as a senior Kenyan career consultant specializing in KUCCPS placement realism. 
    A KCSE 2025 student scored a Mean Grade of ${meanGrade}. 
    Their best subjects were: ${topSubjects.join(', ')}. 
    
    STRICT MERIT REALISM:
    - Only suggest Degree programs if the grade is C+ or above.
    - If grade is C+ exactly, steer them toward less competitive degrees (BA, Education) or high-level Medical Diplomas at KMTC. 
    - Inform them that A and A- students take all Medicine/Engineering slots.
    - Be brutally honest about the 2025 placement trends in Kenya.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Advice currently unavailable.";
  } catch (error) {
    console.error("Gemini advice error:", error);
    return "Your grade offers specific high-value paths. Focus on Diploma excellence in TVET centers or competitive standard degree programs.";
  }
};

export const getMarketableAnalysis = async (meanGrade: string, topSubjects: string[], courseList: string[]) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY environment variable is not configured');
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze the following courses for a student with Mean Grade ${meanGrade} and top subjects ${topSubjects.join(', ')}. 
    Out of these options: ${courseList.slice(0, 50).join(', ')}...
    
    TASK:
    Select the TOP 20 most MARKETABLE and RECOMMENDED courses for this specific student.
    Consider the 2025-2030 Kenyan Job Market (Health, ICT, Agriculture, Blue Economy, Infrastructure).
    
    Return a JSON array of 20 objects:
    [{"course": "Course Name", "institution": "Institution", "marketability": "90-99%", "reason": "Short growth-focused reason"}]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              course: { type: Type.STRING },
              institution: { type: Type.STRING },
              marketability: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["course", "institution", "marketability", "reason"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Marketable analysis error:", error);
    return [];
  }
};

export const getUniversityCourses = async (institutionName: string): Promise<GroundedResponse> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY environment variable is not configured');
    }
    const ai = new GoogleGenAI({ apiKey });
    // Refined prompt for more accurate grounding
    const prompt = `SEARCH FOR OFFICIAL 2025/2026 INTAKE RECORDS FOR: ${institutionName} in Kenya.
    
    TASK:
    1. Extract a structured list of ALL currently active Degrees, Diplomas, and Certificates.
    2. Identify the EXACT cluster weight/minimum grade requirements for top competitive programs (Medicine, Law, Engineering, Nursing).
    3. State approximate 2025 tuition fees for government-sponsored students vs private students.
    4. Provide the official registration/application link for the 2025 cycle.
    
    USE GOOGLE SEARCH GROUNDING TO ENSURE 100% ACCURACY AGAINST UNIVERSITY PORTALS.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'University Portal',
        uri: chunk.web?.uri || ''
      }))
      .filter((s: any) => s.uri !== '') || [];

    return {
      text: response.text || "No course data found for this institution.",
      sources: sources
    };
  } catch (error) {
    console.error("Course fetch error:", error);
    return {
      text: "Connection to institutional database failed. Please ensure you have a stable internet connection.",
      sources: []
    };
  }
};

export const getDetailedCourseBlueprint = async (courseName: string, institution: string): Promise<GroundedResponse> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY environment variable is not configured');
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `GENERATE A 2025/26 CAREER BLUEPRINT FOR: "${courseName}" at "${institution}".
    
    REQUIRED DATA POINTS:
    - Official 2025 Admission Requirements (Minimum Grade & Subject Cluster).
    - Current 2025 Semester Fees (Tuition + Admin Fees).
    - Market Readiness Index: Jobs available for this graduate in Kenya (2025-2030).
    - Career Ladder: Junior role to Senior role salary projections in KES.
    - Grounding: Cross-reference with KUCCPS and the institution's latest fee schedule.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Official Source',
        uri: chunk.web?.uri || ''
      }))
      .filter((s: any) => s.uri !== '') || [];

    return {
      text: response.text || "Blueprint generation failed.",
      sources: sources
    };
  } catch (error) {
    console.error("Blueprint error:", error);
    return { text: "Error generating blueprint. The AI server may be busy.", sources: [] };
  }
};

export const verifyMpesaMessage = async (message: string): Promise<{ isValid: boolean; transactionId?: string; reason?: string }> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY environment variable is not configured');
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze this M-Pesa notification: "${message}".
    Verify if exactly KES 150 was paid to "EDU PATH".
    Extract the 10-char Alphanumeric ID.
    Return JSON: {"isValid": boolean, "transactionId": string, "reason": string}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            transactionId: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["isValid", "transactionId", "reason"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Verification response was empty");
    return JSON.parse(text);
  } catch (error) {
    console.error("Verification error:", error);
    return { isValid: false, reason: "SYSTEM SECURITY ERROR: CHECK MESSAGE FORMAT" };
  }
};
