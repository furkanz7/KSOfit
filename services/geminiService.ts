import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

// Using gemini-1.5-flash as the stable modern fast model (User asked for 2.5, using 1.5/2.0 as appropriate)
const MODEL_NAME = "gemini-2.5-pro";

const generationConfig = {
  temperature: 0.4, // Lower temperature for faster, more deterministic output
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// --- API FUNCTIONS ---

// Helper to repair and parse JSON response
const cleanAndParseJSON = (text: string) => {
  try {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Attempt to repair truncated JSON
    // If it doesn't end with } or ], try to close it.
    // This is a naive heuristic but works for common list truncation.
    if (!cleaned.endsWith('}') && !cleaned.endsWith(']')) {
      // Heuristic: If we are deep in a string, close it first
      if (!cleaned.endsWith('"') && cleaned.match(/"[^"]*$/)) {
        // Unclosed string
        cleaned += '"';
      }

      // If we are likely inside an object (more opens than closes)
      // or inside an array.
      // Easiest fallback for "unexpected end": try closing everything.
      // But for this specific use case (lists of meals/exercises), 
      // usually it cuts off in the middle of an item.

      // Let's try appending standard closing sequence
      // Many plans end with ... ] }
      // If we suspect it's the main object:
      if (cleaned.lastIndexOf(']') < cleaned.lastIndexOf('[')) {
        cleaned += ']';
      }
      if (cleaned.lastIndexOf('}') < cleaned.lastIndexOf('{')) {
        cleaned += '}';
      }
    }

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // Second attempt: Find the last valid "}," sequence and close from there
      // This sacrifices the last partial item but saves overall structure.
      const lastObjectEnd = cleaned.lastIndexOf('},');
      if (lastObjectEnd !== -1) {
        let recovered = cleaned.substring(0, lastObjectEnd + 1);
        // We likely need to close the array and root object
        if (recovered.lastIndexOf(']') < recovered.lastIndexOf('[')) {
          recovered += ']';
        }
        if (recovered.lastIndexOf('}') < recovered.lastIndexOf('{')) {
          recovered += '}';
        }
        return JSON.parse(recovered);
      }
      throw e;
    }

  } catch (error) {
    console.error("JSON Parse Error:", error, "Cleaned Text:", text);
    throw new Error("Failed to parse AI response. Please try again.");
  }
};

export const generateWorkoutPlan = async (stats: any) => {
  try {
    const prompt = `You are a fitness engine. GENERATE FAST.
    Create a workout plan for:
    - Age: ${stats.age}, Goal: ${stats.goal}, Level: ${stats.experience}, Weight: ${stats.weight}kg
    - Days: ${stats.selectedDays?.join(', ') || stats.daysPerWeek}
    
    INSTRUCTIONS:
    1. Directly map stats to standard workouts. No deep custom analysis.
    2. Exercises: name, sets, reps, short tip.
    3. JSON Only.
    
    FORMAT:
    {
      "planName": "string",
      "description": "Short summary",
      "schedule": [
        { 
          "day": "Monday", 
          "focus": "Legs", 
          "workout": "Leg Hypertrophy", 
          "exercises": [
            { "name": "Squat", "sets": "4", "reps": "8-10", "tips": "Chest up" }
          ] 
        }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig });
    const result = await model.generateContent(prompt);
    return cleanAndParseJSON(result.response.text());
  } catch (error) {
    console.error("Gemini Workout Error:", error);
    throw error;
  }
};

export const generateNutritionPlan = async (stats: any) => {
  try {
    const prompt = `You are a nutrition engine. GENERATE FAST.
    Create a diet plan for:
    - Age: ${stats.age}, Weight: ${stats.weight}kg, Goal: ${stats.goal}, Meals: ${stats.mealsPerDay}
    
    INSTRUCTIONS:
    1. Standard meal distribution. No complex recipes.
    2. Calculate calories/macros once.
    3. JSON Only.
    
    FORMAT:
    {
      "planName": "string",
      "dailyCalories": "2500 kcal",
      "macroTargets": { "protein": 180, "carbs": 250, "fats": 80 },
      "meals": [
        { 
          "name": "Breakfast", 
          "ingredients": ["3 Eggs", "Oats"], 
          "calories": "500 kcal", 
          "macros": "P:30g C:40g F:15g", 
          "prepInstructions": "Cook and eat."
        }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig });
    const result = await model.generateContent(prompt);
    return cleanAndParseJSON(result.response.text());
  } catch (error) {
    console.error("Gemini Nutrition Error:", error);
    throw error;
  }
};

export const suggestChefMeal = async (ingredients: { name: string, amount: string }[]) => {
  try {
    const prompt = `You are "FUR-AI", a world-class professional fit-chef. 
    Analyze these ingredients and their amounts: ${ingredients.map(i => `${i.amount}g ${i.name}`).join(', ')}.
    
    1. Create ONE realistic recipe that uses these ingredients. 
    2. Calculate ACCURATE calories and macro percentages (protein, carbs, fats) based on the specific weights provided. Do NOT give extreme values like 9500kcal unless the ingredients actually add up to that.
    3. Provide step-by-step instructions.
    
    Return ONLY a valid JSON object (no markdown):
    {
      "name": "Meal Name",
      "description": "Short appetizing description",
      "calories": "Total kcal (number only as string)",
      "macros_distribution": { "protein": 0, "carbs": 0, "fats": 0 },
      "instructions": ["Step 1", "Step 2", "..."]
    }`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig });
    const result = await model.generateContent(prompt);
    return cleanAndParseJSON(result.response.text());
  } catch (error) {
    console.error("FUR-AI Chef Error:", error);
    return null;
  }
};

export const chatWithCoach = async (message: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const safeMessage = message.replace(/"/g, "'");
    const prompt = `Sen "FUR-AI PT CHAT", dünyanın en disiplinli ve profesyonel kişisel antrenörüsün.
    
    KURALLAR:
    1. Sadece spor, fitness, vücut geliştirme, beslenme, egzersiz ve mental motivasyon konularında cevap ver.
    2. Dilin son derece profesyonel, ciddi ve otoriter olsun. Asla samimiyet kurma, "naber", "nasılsın" gibi soruları ciddiyetle reddet.
    3. Eğer kullanıcı hedef dışı (siyaset, eğlence, genel kültür, oyun vb.) bir şey sorarsa, ÇOK SERT bir dille uyar ve cevap vermeyi reddet.
    4. Kullanıcıya bir asker gibi disiplin aşıla. Boş vakit harcamasına izin verme.
    
    ÖRNEK SERT UYARI: "Ben senin arkadaşın değil, FUR-AI PT CHAT'im. Burada magazin ya da oyun konuşmuyoruz. Ya antrenmanın hakkında soru sor ya da bu ekranı kapat ve git şınav çek! Vaktimi çalma!"
    
    Kullanıcının mesajı: "${safeMessage}"`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    return `PT Error: ${error.message}`;
  }
};

export const getDailyMotivation = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent("Give a short fitness quote.");
    return result.response.text().trim();
  } catch (error) {
    return "Keep going!";
  }
};

export const getDailyFitnessTask = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = "Give a very short, simple fitness task for today (e.g., 'Do 30 Pushups' or '1 Minute Plank'). No long explanations, just the task name and count.";
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return "Do 20 Pushups";
  }
};

export const predictNextWorkout = async (exercise: string, weight: string, reps: string) => {
  try {
    const prompt = `Progressive overload for ${exercise} (${weight}kg x ${reps}). Return JSON: { "suggestion": "string", "reason": "string" }`;
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig });
    const result = await model.generateContent(prompt);
    return cleanAndParseJSON(result.response.text());
  } catch (error) {
    return { suggestion: "Add 2.5kg", reason: "Standard overload." };
  }
};
