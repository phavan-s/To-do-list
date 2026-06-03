const User = require("../models/userModel");
const Todo = require("../models/todoModel");

const getUserAnalytics = async (userId) => {

    const user = await User.findByPk(userId);

    const totalTasks = await Todo.count({
        where: { userId }
    });

    const completedTasks = await Todo.count({
        where: {
            userId,
            status: "completed"
        }
    });

    const pendingTasks = await Todo.count({
        where: {
            userId,
            status: "pending"
        }
    });

    const completionRate =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    return {
        userId,
        name: user.name,
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate
    };
};

module.exports = {
    getUserAnalytics
};