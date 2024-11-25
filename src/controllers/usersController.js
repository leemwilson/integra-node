const pool = require("../models/db");
const bcrypt = require("bcrypt");

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
    // Check if the user exists in the database
    const [results] = await pool.query("SELECT * FROM `users` WHERE username = ?", [username]);

    if (results.length === 0) {
      // User not found
      return res.status(404).json({ error: "Invalid username or password" });
    }

    const user = results[0];

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Password does not match
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Login successful
    const { id, first_name, last_name, role_id, group_id } = user;
    res.json({ id, username, first_name, last_name, role_id, group_id });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Error retrieving data from MySQL" });
  }
};

exports.addUser = async (req, res) => {
  const { username, name, lastName, password, role_id = 1, group_id = 1 } = req.body;

  const first_name = name;
  const last_name = lastName;

  console.log("ran addUser call", last_name, first_name);

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Check if user already exists
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: "User already exists" }); // 409 Conflict
    }

    // Validate role_id
    const [roleCheck] = await pool.query("SELECT id FROM role_types WHERE id = ?", [role_id]);
    if (roleCheck.length === 0) {
      return res.status(400).json({ error: "Invalid role_id" });
    }

    // Validate group_id
    const [groupCheck] = await pool.query("SELECT id FROM `groups` WHERE id = ?", [group_id]);
    if (groupCheck.length === 0) {
      return res.status(400).json({ error: "Invalid group_id" });
    }

    const result = await pool.query(
      "INSERT INTO users (username, first_name, last_name, password, role_id, group_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [username, first_name, last_name, password, role_id, group_id]
    );

    res.status(201).json({
      message: "User added successfully",
      userId: result[0].insertId,
    });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Error adding user to the database" });
  }
};
