const { getUserAnalytics } = require("../services/adminAnalytics.js");

console.log("Attempting to import adminAiSummary...");
const adminAiSummaryModule = require("../services/adminAiSummary.js");
console.log("adminAiSummaryModule exports:", Object.keys(adminAiSummaryModule));
const { getUserSummary } = adminAiSummaryModule;
console.log("getUserSummary function:", typeof getUserSummary);

const getAdminUserSummary = async (req, res) => {
    try{

        const userId = req.params.userId;
        const analytics = await getUserAnalytics(userId);
        const summary = await getUserSummary(analytics);

        return res.status(200).json({
            success: true,
            analytics,
            summary
        });

    } catch (error) {
        console.error("Error in getAdminUserSummary:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getUserStats= async (req, res) => {
    try {
        const userId = req.params.userId;   
        const analytics = await getUserAnalytics(userId);

        return res.status(200).json({
            success: true,
            analytics
        }); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }   

};

module.exports = {
    getAdminUserSummary,
    getUserStats
};