import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { getAllMastersWithProfiles, categories } from "@/lib/mock/data";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, imageBase64, imageMimeType, audioBase64, audioMimeType } =
      (await req.json()) as {
        message?: string;
        imageBase64?: string;
        imageMimeType?: string;
        audioBase64?: string;
        audioMimeType?: string;
      };

    if (!message && !imageBase64 && !audioBase64) {
      return NextResponse.json(
        { error: "Xabar, rasm yoki audio kerak" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const categoryList = categories
      .map((c) => `  "${c.id}": ${c.name} (${getCategoryHints(c.id)})`)
      .join("\n");

    const userContext = message
      ? `Foydalanuvchi muammosi: ${message}`
      : audioBase64
      ? "Foydalanuvchi audio yozuvida muammosini o'zbek tilida tasvirlab berdi. Audio tarkibidagi muammoni diqqat bilan eshit va tahlil qil."
      : "Rasmda ko'rinadigan muammoni tahlil qil";

    const prompt = `Sen USTAM platformasining AI yordamchisisisan. Foydalanuvchining muammosini tahlil qilib, quyidagi kategoriyalardan birini tanla:

${categoryList}

FAQAT quyidagi JSON formatda javob ber, boshqa matn yozma:
{
  "categoryId": "cat-X",
  "diagnosis": "Muammo tavsifi o'zbek tilida (1-2 jumla)",
  "suggestion": "Qaysi turdagi usta kerakligi va nima ish qilishi haqida maslahat (2-3 jumla)",
  "urgency": "low"
}

Urgency qiymatlari: "low" (shoshilmasa ham bo'ladi), "medium" (tez orada kerak), "high" (tezkor yordam kerak).

${userContext}`;

    const parts: Part[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: { data: imageBase64, mimeType: imageMimeType || "image/jpeg" },
      });
    }

    if (audioBase64) {
      // Normalize MIME type: strip codec params Gemini doesn't accept
      const normalizedAudioMime = (audioMimeType || "audio/webm").split(";")[0];
      parts.push({
        inlineData: { data: audioBase64, mimeType: normalizedAudioMime },
      });
    }

    parts.push({ text: prompt });

    const result = await model.generateContent(parts);
    const raw = result.response.text().trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI javobi noto'g'ri formatda" },
        { status: 500 }
      );
    }

    const aiData = JSON.parse(jsonMatch[0]) as {
      categoryId: string;
      diagnosis: string;
      suggestion: string;
      urgency: string;
    };

    const allMasters = getAllMastersWithProfiles();
    const matched = allMasters
      .filter((m) => m.profile.categories.includes(aiData.categoryId))
      .sort((a, b) => b.profile.rating - a.profile.rating)
      .slice(0, 4);

    const category = categories.find((c) => c.id === aiData.categoryId);

    return NextResponse.json({
      categoryId: aiData.categoryId,
      categoryName: category?.name ?? "Usta",
      categoryIcon: category?.icon ?? "🔧",
      diagnosis: aiData.diagnosis,
      suggestion: aiData.suggestion,
      urgency: aiData.urgency ?? "medium",
      masters: matched,
    });
  } catch (err) {
    console.error("AI assistant error:", err);
    return NextResponse.json(
      { error: "Xizmat vaqtincha ishlamayapti" },
      { status: 500 }
    );
  }
}

function getCategoryHints(id: string): string {
  const hints: Record<string, string> = {
    "cat-1":  "quvur, kran, vannaxona, hojatxona, suv oqishi",
    "cat-2":  "tok, chiroq, rozetka, simlash, qisqa tutashuv",
    "cat-3":  "eshik, deraza, mebel, yog'och, parket",
    "cat-4":  "veb-sayt, ilova, dastur, kompyuter, IT",
    "cat-5":  "foto, video, to'y, tadbir, suratga olish",
    "cat-6":  "dizayn, logotip, brending, UI, grafika",
    "cat-7":  "bo'yash, devor, potolok, kraska, dekor",
    "cat-8":  "payvandlash, metall, temir, darvoza, panjara",
    "cat-9":  "qulf, kalit, seyf, eshik ochish",
    "cat-10": "dars, repetitor, matematika, fizika, DTM",
  };
  return hints[id] ?? "";
}
