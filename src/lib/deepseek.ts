const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekResponse {
  choices: { message: { content: string } }[];
}

export async function chatCompletion(
  messages: ChatMessage[],
  model: string = "deepseek-chat"
): Promise<string> {
  const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.7 }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }

  const data: DeepSeekResponse = await res.json();
  return data.choices[0].message.content;
}

export async function getMochiInsight(
  summary: { income: number; expense: number; topCategory: string; budgetUsage: number }
): Promise<string> {
  const prompt = `คุณคือ "Mochi" ผู้ช่วยการเงินน่ารัก พูดภาษาไทย สั้นกระชับ 2-3 ประโยค ใช้อีโมจิบ้าง
สรุปเดือนนี้: รายรับ ${summary.income} บาท, รายจ่าย ${summary.expense} บาท, หมวดจ่ายเยอะสุดคือ "${summary.topCategory}", ใช้งบไป ${summary.budgetUsage}%
ให้คำแนะนำการเงินสั้นๆ`;

  return chatCompletion([{ role: "user", content: prompt }]);
}

export async function categorizeTransactions(
  rows: { date: string; description: string; amount: number }[],
  categories: string[]
): Promise<string[]> {
  const prompt = `จัดหมวดหมู่รายการเงินต่อไปนี้ให้ตรงกับหมวดที่มี: ${categories.join(", ")}
ตอบเป็น JSON array ของชื่อหมวดเท่านั้น (ตามลำดับ)

รายการ:
${rows.map((r, i) => `${i + 1}. ${r.date} | ${r.description} | ${r.amount}`).join("\n")}`;

  const result = await chatCompletion([{ role: "user", content: prompt }]);

  try {
    return JSON.parse(result);
  } catch {
    return rows.map(() => "อื่นๆ");
  }
}
