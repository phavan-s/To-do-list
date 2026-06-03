const groq = require("./groqServices");

const getUserSummary = async (analytics) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an admin productivity analyst.

Analyze user productivity metrics and provide insights.

Return a concise summary with:
1. Productivity Level
2. Key Strengths
3. Areas for Improvement
4. Actionable Recommendation

The points should be in a paragraph format, not a list. Keep it under 100 words. If the stats are not good, try to motivate the user with a positive tone and constructive feedback. If the stats are good, provide positive reinforcement and encourage continued productivity.  `

                },
                {
                    role: "user",
                    content: JSON.stringify(analytics)
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error in getUserSummary:", error.message);
        console.error("Full error:", error);
        throw error;
    }
};

module.exports = {
    getUserSummary
};