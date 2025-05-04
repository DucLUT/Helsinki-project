import {openai} from "../config/openai.js";


// Controller for practice chat
export const practiceConversation = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a friendly and engaging conversation partner." },
        { role: "user", content: message },
      ],
    });

    const reply = response.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI Error (practice):", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

// Controller for generating pickup line
export const generatePickupLine = async (req, res) => {
  const { matchName, matchBio } = req.body;

  if (!matchName) {
    return res.status(400).json({ error: "matchName is required" });
  }

  try {
    const prompt = `Come up with a witty, respectful, and fun opening line to start a conversation with someone named ${matchName}. Their bio: "${matchBio || "No bio"}"`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const pickupLine = response.data.choices[0].message.content.trim();
    res.json({ pickupLine });
  } catch (err) {
    console.error("OpenAI Error (pickup line):", err);
    res.status(500).json({ error: "Failed to generate pickup line" });
  }
};
