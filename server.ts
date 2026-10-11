import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/roast", async (req, res) => {
    const { expenses, metrics } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key missing" });
    }
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
    
    const prompt = `
You are BROKEBESTIE, an intelligent, evidence-based, but hilarious Gen-Z financial coach.
Your goal is to provide a roast that is both funny and genuinely helpful.
You must base your insights on the provided transaction records and financial metrics.

Here is the data:
- Transactions: ${JSON.stringify(expenses)}
- Financial Metrics: ${JSON.stringify(metrics)}

Response structure:
1. THE RECEIPTS: One or two specific observations grounded in the transaction records.
2. THE VIBE CHECK: A playful assessment of the user's financial situation based on the metrics.
3. THE NEXT MOVE: One or two realistic, actionable suggestions based on their budget.
4. THE WHAT-IF: Explain how a relevant spending change (e.g., avoiding a similar future expense) would affect their flexible balance or daily allowance, based on their actual budget capacity.

Guidelines:
- Maintain a dramatic, witty, Gen Z "bestie" personality (use slang, emojis).
- Roast spending patterns, NOT the user. Do not shame them for being poor or having unexpected expenses.
- Do not invent facts, habits, or motives. If data is incomplete or empty, gracefully acknowledge it.
- If transactions are sparse or cover only a partial period, acknowledge this limitation (it is a dataset, not a full history).
- If the metrics are insufficient to calculate a forecast or score, communicate the limitation accurately.
- Phrase uncertain observations as questions or possibilities.
- If the user has a negative projected balance, explain it accurately based on the metrics provided.
- Do not automatically recommend cutting food; distinguish between essential groceries and discretionary spending.
- Do not treat savings as consumption.

Keep it short, punchy, and sound like we are texting.
`;
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
      res.json({ roast: response.text });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "AI failed to roast you" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
