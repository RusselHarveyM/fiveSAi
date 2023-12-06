import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function evaluate(base64url) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "from 1-10 rate the images using first 4S in the 5s methodology, just respond with the score for each S in english without additional or explanatory information about the preceding word, and nothing else, then in another paragraph in short sentences explain how the score can be improved answer in a bullet format.",
          },
          {
            type: "image_url",
            image_url: {
              url: base64url,
            },
          },
        ],
      },
    ],
    max_tokens: 300,
  });
  console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
}

export default evaluate;
