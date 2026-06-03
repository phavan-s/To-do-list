const groq = require("./groqServices");

const analyzeStrugglingUser = async (userData) => {

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
You are an admin productivity analyst.

Analyze struggling users.

Return ONLY:

Risk Level:
Issue:
Recommendation:

Keep the response under 50 words.
`
            },
            {
                role: "user",
                content: JSON.stringify(userData)
            }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3
    });

    return completion.choices[0].message.content;
};

module.exports = {
    analyzeStrugglingUser
};