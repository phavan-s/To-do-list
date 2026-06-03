const {
    identifyStrugglingUsers
} = require("../services/strugglingUserService");

const getStrugglingUsers = async (req, res) => {
    try {
        const strugglingUsers =
            await identifyStrugglingUsers();

        return res.status(200).json({
            success: true,
            count: strugglingUsers.length,
            strugglingUsers
        });

    } catch (error) {
        console.error("Error in getStrugglingUsers:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getStrugglingUsers
};
