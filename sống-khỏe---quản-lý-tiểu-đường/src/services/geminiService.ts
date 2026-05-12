import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getNutritionSuggestion(bloodSugar: number, currentMeal: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Tôi là một bệnh nhân tiểu đường. Chỉ số đường huyết hiện tại của tôi là ${bloodSugar} mmol/L. 
      Lúc này tôi đang chuẩn bị ăn ${currentMeal}. Hãy gợi ý cho tôi một thực đơn chi tiết (món chính, món phụ, cách chế biến, lượng carb ước tính) 
      để giữ mức đường huyết ổn định và an toàn. Trả về kết quả chuyên nghiệp, ngắn gọn bằng tiếng Việt.`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Không thể lấy gợi ý lúc này. Vui lòng thử lại sau.";
  }
}
