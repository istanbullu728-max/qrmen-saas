
/**
 * Mock translation service.
 * In a real production environment, this would call OpenAI, DeepL, or Google Translate API.
 * For now, we will simulate "high quality" translation for common menu items or just append " (EN)" for testing.
 * 
 * TODO: Integrate with OpenAI API for "extreme quality" translations.
 */

const DICTIONARY: Record<string, string> = {
    "Mercimek Çorbası": "Lentil Soup",
    "Adana Kebap": "Adana Kebab",
    "İskender": "Iskender Kebab",
    "Lahmacun": "Lahmacun (Turkish Pizza)",
    "Ayran": "Ayran (Yoghurt Drink)",
    "Kola": "Coke",
    "Su": "Water",
    "Tatlılar": "Desserts",
    "Ana Yemekler": "Main Courses",
    "Başlangıçlar": "Starters",
    "İçecekler": "Beverages",
    "Salatalar": "Salads",
    "Kahvaltı": "Breakfast",
};

export async function translateText(text: string, targetLang: 'en' = 'en'): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!text) return "";

    // 1. Check dictionary first (for perfect common translations)
    if (DICTIONARY[text]) {
        return DICTIONARY[text];
    }

    // 2. Heuristic fallbacks for simple demo purposes
    // Real implementation should use an LLM here.

    // Just return the text if we can't translate it, maybe with a marker or try to look cool.
    // For the user request "otomati olacak", we really need something better than this.
    // But without an API key, I can't do magic. I'll add a note.

    return text + " (EN)";
}
