const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv").config();

const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());

const expenseRoute = require("./routes/expenseRoute");

app.use("/api", expenseRoute);

app.get("/", (req, res) => {
    res.send("MongoDB User Management API running");
  });
  
  const PORT = process.env.PORT || 5001;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });