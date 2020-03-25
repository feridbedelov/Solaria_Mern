const mongoose = require("mongoose")
const config = require("config")

const mongoURI = config.get("mongoURI")

const connectDb = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
        console.log("DB Connected...")
    } catch (error) {
        console.error(error.message)
        process.exit(1);
    }
}

module.exports = connectDb;