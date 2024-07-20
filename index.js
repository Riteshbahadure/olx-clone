const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
dotenv.config({ path: "./.env" })
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URL)

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.static("dist"))//backent ch kontch folder access nhi krta yet kraych asel tr static lavtat
app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.LIVE_SEVER,
    credentials: true,
}))//credentials: true in CORS allows cross-origin requests 
//to include cookies, crucial for user sessions and authentication.

//ROUTES
app.use("/api/auth", require("./routes/auth.routes"))


app.use("*", (req, res) => {
    res.status(404).json({ message: "resource not found" })
});
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: err.message || "something went wrong" })
});

mongoose.connection.once("open", () => {
    console.log("MONGO SERVER RUNNING");
    app.listen(5000, console.log("http://localhost:5000"))
});
