const pool = require("../models/db");

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving users from database" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  console.log('ran login call')

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const [results] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND BINARY password = ?",
      [username, password]
    );

    if (results.length > 0) {
      // User exists, send the user data
      res.json(results);
    } else {
      // User not found
      res.status(404).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Error retrieving data from MySQL" });
  }
};
