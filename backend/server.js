const express = require("express");
const cors = require("cors");
const dotenv= require("dotenv");
dotenv.config();

const connectDB = require("./config/db")

const PORT = process.env.PORT || 5000

const app = express();
// Connect to database
connectDB();

app.use(cors());
app.use(express.json());


app.listen(PORT,()=>
    console.log(`Server running on port ${PORT}`)
)