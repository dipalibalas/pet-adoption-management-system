const express = require("express");
const cors = require("cors");
// const DB = require()

const PORT = process.env.PORT || 5000

const app = express();
// Connect to database

app.use(cors());
app.use(express.json());


app.listen(PORT,()=>
    console.log(`Server running on port ${PORT}`)
)