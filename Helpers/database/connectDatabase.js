const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connection Successful");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);  
    }
};

module.exports = connectDatabase;
