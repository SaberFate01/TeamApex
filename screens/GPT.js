
import OpenAI from 'openai';



async function main() {
    const openai = new OpenAI({
        apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
    });
  console.log("Exec1");
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Tell a story' }],
    model: 'gpt-3.5-turbo',
  });

  console.log(chatCompletion.choices);
}

main();

module.exports = { main };