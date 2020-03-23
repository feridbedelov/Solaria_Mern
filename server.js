const express = require("express")
const dbConnect = require("./config/db")
const app = express()
const PORT = process.env.PORT || 5000

dbConnect()



app.get("/",(req,res) => res.send("Okay"))


app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/users", require("./routes/api/users"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/posts"))


app.listen(PORT,()=>console.log(`Server is open on ${PORT}`))