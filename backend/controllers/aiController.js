const groq = require("../services/groqServices.js");
const Todo = require("../models/todoModel");

const testAI = async (req, res) => {
    try {
        const { prompt } = req.body;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Generate 5 tasks for this: ${prompt}`
                    
                }
            ],
            model: "llama-3.3-70b-versatile"
        });

        res.status(200).json({
            success: true,
            response: completion.choices[0].message.content
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

function generateFallbackTasks(prompt) {
    const words = prompt.trim().split(/\s+/).slice(0, 6).join(" ");
    return [
        `Research and plan: ${words}`,
        `Draft outline for: ${words}`,
        `Set deadline and milestones for: ${words}`,
        `Assign resources to: ${words}`,
        `Review and finalize: ${words}`
    ];
}

const generateTasks = async (req, res) => {
    try {
        const { prompt } = req.body;    
        const tasks = await groq.chat.completions.create({
            messages: [
                {
    
    role: "system",
    content: `

    You are a task generation API.

    Generate exactly 5 tasks based on the prompt.

    Dont generate random tasks. Only generate tasks that are relevant to the prompt.

    Each task must be under 8 words.

    Return one task per line.

No numbering.
No explanations.
No extra text.

`

},
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile", 
            temperature: 0.2
        });

        const aiResponse = tasks.choices[0].message.content;

        const taskList = aiResponse
        .split("\n")
        .map(task => task.trim())
        .filter(task => task.length > 0);

        return res.status(200).json({
            success: true,
            tasks: taskList
        });

    } catch (error) {
        const isNetworkError = error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED'
            || error.code === 'EACCES' || error.message?.includes('fetch') 
            || error.message?.includes('network') || error.message?.includes('connect');

        if (isNetworkError) {
            const { prompt } = req.body;
            return res.status(200).json({
                success: true,
                tasks: generateFallbackTasks(prompt || "task")
            });
        }

        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDailySummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const todos = await Todo.findAll({ where: { userId } });

        if (todos.length === 0) {
            return res.status(200).json({
                success: true,
                summary: "No tasks yet! Start by creating your first task."
            });
        }

        const todoData = todos.map(t => ({
            title: t.title,
            status: t.status,
            ...(t.description ? { description: t.description } : {})
        }));

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a productivity assistant. Write a brief daily summary (2-3 sentences) based on the user's task list. Mention completed tasks, pending tasks, and end with an encouraging note."
                },
                {
                    role: "user",
                    content: JSON.stringify(todoData)
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.4
        });

        return res.status(200).json({
            success: true,
            summary: completion.choices[0].message.content
        });
    } catch (error) {
        const isNetworkError = error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED'
            || error.code === 'EACCES' || error.message?.includes('fetch')
            || error.message?.includes('connect');

        if (isNetworkError) {
            return res.status(200).json({
                success: true,
                summary: "AI summary unavailable (network restricted). You have tasks in progress — keep going!"
            });
        }
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    testAI,
    generateTasks,
    getDailySummary
};