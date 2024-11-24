const pool = require("../models/db");

exports.getAllProjects = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving users from database" });
  }
};
