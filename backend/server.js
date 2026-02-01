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

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/pets", require("./routes/petRoutes"));
app.use("/api/adoptions", require("./routes/adoptionRoutes"));
app.listen(PORT,()=>
    console.log(`Server running on port ${PORT}`)
)