const express = require("express");
const cors = require("cors");
const pool = require("./db");
const notesRouter = require("./routes/notes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id          SERIAL PRIMARY KEY,
        content     TEXT NOT NULL,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Notes table ready");
  } catch (err) {
    console.error("❌ Failed to initialize database:", err.message);
  }
};

app.get("/", (req, res) => {
  res.json({ message: "Note App API is running 🚀" });
});

app.use("/api/notes", notesRouter);

app.listen(PORT, async () => {
  await initDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
