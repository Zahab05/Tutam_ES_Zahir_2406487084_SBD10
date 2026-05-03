const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/notes error:", err.message);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.post("/", async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (content) VALUES ($1) RETURNING *",
      [content.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/notes error:", err.message);
    res.status(500).json({ error: "Failed to create note" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully", note: result.rows[0] });
  } catch (err) {
    console.error("DELETE /api/notes/:id error:", err.message);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
