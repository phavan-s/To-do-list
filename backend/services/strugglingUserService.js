const User = require("../models/userModel");
const { getUserAnalytics } = require("./adminAnalytics");

const identifyStrugglingUsers = async () => {

    const users = await User.findAll();

    const strugglingUsers = [];

    for (const user of users) {

        const analytics = await getUserAnalytics(user.id);

        const isStruggling =
            analytics.completionRate < 40 &&
            analytics.totalTasks >= 5;

        if (isStruggling) {
            strugglingUsers.push({
                userId: analytics.userId,
                name: analytics.name,
                totalTasks: analytics.totalTasks,
                completedTasks: analytics.completedTasks,
                pendingTasks: analytics.pendingTasks,
                completionRate: analytics.completionRate
            });
        }
    }

    return strugglingUsers;
};

module.exports = {
    identifyStrugglingUsers
};