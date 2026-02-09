const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();

const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());

app.use(cors());

const expenseRoute = require("./routes/expenseRoute");

app.use("/api", expenseRoute);

const PORT = process.env.PORT || 5001;
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});