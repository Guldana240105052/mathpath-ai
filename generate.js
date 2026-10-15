export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for this endpoint." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "The AI service is not configured yet. Add OPENAI_API_KEY in your deployment environment variables."
    });
  }

  const { topic, level, task, action } = req.body || {};
  const allowedLevels = ["foundation", "standard", "advanced"];
  const safeTopic = String(topic || "linear equations").slice(0, 120);
  const safeTask = String(task || "").slice(0, 500);
  if (!allowedLevels.includes(level)) {
    return res.status(400).json({ error: "Choose Foundation, Standard, or Advanced." });
  }
  if (!["generate", "hint", "solution", "check"].includes(action)) {
    return res.status(400).json({ error: "Unsupported action." });
  }

  const levelGuidance = {
    foundation: "Foundation: use friendly, simple language, small numbers, a guided step-by-step breakdown, and one direct hint. Avoid skipping steps.",
    standard: "Standard: use a typical school-level problem and concise reasoning. Give a useful hint without revealing the full answer immediately.",
    advanced: "Advanced: use a multi-step or applied challenge, require justification, and give a strategic hint rather than the full method immediately."
  };

  const actionGuidance = {
    generate: "Create one new problem appropriate to the selected level, with a short context if useful.",
    hint: "Give one level-appropriate hint only. Do not reveal the final answer.",
    solution: "Provide a correct, clearly explained step-by-step solution and final answer.",
    check: "Check the learner's submitted answer. Say whether it is correct, explain briefly, and if it is incorrect give a next-step hint without simply giving away the whole solution."
  };

  const prompt = `You are a careful mathematics tutor for a differentiated-learning web app.
Topic: ${safeTopic}
Level: ${level}
Level requirements: ${levelGuidance[level]}
Requested action: ${actionGuidance[action]}
${safeTask ? `Current problem or learner answer: ${safeTask}` : ""}
Return only valid JSON with this exact shape:
{
  "title": "short title",
  "problem": "the problem statement",
  "hint": "a level-appropriate hint",
  "solution": "a correct explanation; for hint actions, do not disclose the final answer",
  "answer": "the final answer, or an empty string if the action is hint",
  "feedback": "short learner-facing response"
}
Math correctness matters. Verify your algebra/arithmetic before responding. Keep the response age-appropriate and encouraging. Do not include Markdown fences.`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
        max_output_tokens: 900
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(502).json({ error: "The AI provider could not complete the request. Check your API key, model access, and billing settings." });
    }

    const outputText = data.output_text || (data.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("");

    let result;
    try {
      result = JSON.parse(outputText);
    } catch {
      console.error("Could not parse model output:", outputText);
      return res.status(502).json({ error: "The AI returned an unreadable response. Please try again." });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI request failed:", error);
    return res.status(500).json({ error: "Could not connect to the AI service. Please try again." });
  }
}
