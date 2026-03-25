const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const key = env.match(/GROQ_API_KEY=(.*)/)[1].trim();
const { createGroq } = require('@ai-sdk/groq');
const { generateText, tool } = require('ai');
const { z } = require('zod');

async function main() {
  const groq = createGroq({
    apiKey: key
  });

  const groqModel = groq('llama-3.3-70b-versatile');

  try {
    const result = await generateText({
      model: groqModel,
      messages: [{ role: 'user', content: 'ayer gaste 5 dolares en comida' }],
      tools: {
        add_ledger_entry: tool({
          description: 'Record a new financial transaction (income or expense) into the ledger.',
          parameters: z.object({
            transaction_json_string: z.string().describe('A JSON string containing: {"amount": number, "type": "income"|"expense", "description": "string", "category": "string", "transaction_date": "YYYY-MM-DD"}')
          }),
          execute: async (args) => {
            console.log("TOOL EXECUTED:", args);
            return { success: true };
          }
        })
      }
    });

    console.log("Result:", result.toolCalls);
  } catch (error) {
    console.error("AI Error:", error);
  }
}

main();
