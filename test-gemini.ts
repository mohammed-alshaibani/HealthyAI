import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "AQ.Ab8RN6JG3tadbRA-21Jc2xfna6CBBD-cSg4zJu7sGV2Jq6WAmg",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gemini-1.5-flash',
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log("Success:", response.choices[0].message.content);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
