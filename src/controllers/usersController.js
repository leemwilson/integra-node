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

exports.addUser = async (req, res) => {
  const { username, name, lastName, password, role_id = 1, group_id = 1 } = req.body;

  const first_name = name;
  const last_name = lastName;

  // Check if all required fields are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (username, first_name, last_name, password, role_id, group_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [username, first_name, last_name, password, role_id, group_id]
    );

    // Respond with the inserted user's ID
    res.status(201).json({ message: "User added successfully", userId: result[0].insertId });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Error adding user to the database" });
  }
};