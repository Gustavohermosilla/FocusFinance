const fs = require('fs');
const { groq } = require('@ai-sdk/groq');
const { generateText, tool } = require('ai');
const { z } = require('zod');

const env = fs.readFileSync('.env.local', 'utf8');
const key = env.match(/GROQ_API_KEY=(.*)/)[1].trim();

// To intercept the fetch request, we can mock the fetch function in the groq provider locally
const provider = groq('llama-3.3-70b-versatile');
const customFetch = async (url, options) => {
  console.log('--- INTERCEPTED FETCH TO GROQ ---');
  console.log('URL:', url);
  console.log('PAYLOAD:', JSON.stringify(JSON.parse(options.body), null, 2));
  console.log('-----------------------------------');
  // Just return a dummy response so it doesn't actually call the API
  return new Response(JSON.stringify({choices: []}), { status: 200, headers: {'Content-Type': 'application/json'} });
};

// Vercel AI SDK 6.0 allows setting custom fetch on provider instances?
// Actually @ai-sdk/groq exports a setup function to inject fetch, but we can also just use global fetch mock:
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  if (url.includes('api.groq.com')) {
    return customFetch(url, options);
  }
  return originalFetch(url, options);
};

async function main() {
  try {
    const customGroq = groq.text('llama-3.3-70b-versatile');
    console.log("Starting tool generation...");
    await generateText({
      model: customGroq,
      prompt: 'Ayer gasté 5 dólares en comida.',
      tools: {
        add_ledger_entry: tool({
          description: 'Record a new financial transaction (income or expense) into the ledger.',
          parameters: z.object({
            amount: z.number().describe('The monetary amount of the transaction. Must be a standard JSON number.'),
            type: z.enum(['income', 'expense']).describe('The type of the transaction, either income or expense.'),
            description: z.string().describe('A very brief description of the transaction.'),
            category: z.string().describe('The categorical group, such as Food, Salary, Leisure, etc.'),
            transaction_date: z.string().describe('The date of the transaction in ISO format (YYYY-MM-DD). Pass an empty string if unspecified.')
          }),
          execute: async () => { return { success: true }; }
        })
      }
    });
  } catch(e) {
    console.log("Caught:", e.message);
  }
}
main();
