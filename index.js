const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data storage for users
const users = new Map(); // Using a Map for efficient CRUD operations

// Helper function to validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// CREATE: Add a new user
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;

    // Input validation
    if (!name || !email || !age) {
        return res.status(400).json({ error: 'Name, email, and age are required.' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Create user object
    const id = uuidv4();
    const newUser = { id, name, email, age };

    users.set(id, newUser);
    console.log(users);
    res.status(201).json({ message: 'User created successfully.', user: newUser });
});

// READ: Get all users
app.get('/users', (req, res) => {
    const allUsers = Array.from(users.values());
    console.log(users);
    res.status(200).json(allUsers);
});

// READ: Get user by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;

    if (!users.has(id)) {
        return res.status(404).json({ error: 'User not found.' });
    }

    console.log(users);
    res.status(200).json(users.get(id));
});

// UPDATE: Update user by ID
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    if (!users.has(id)) {
        return res.status(404).json({ error: 'User not found.' });
    }

    // Input validation
    if (!name || !email || !age) {
        return res.status(400).json({ error: 'Name, email, and age are required.' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Update user data
    const updatedUser = { id, name, email, age };
    users.set(id, updatedUser);
    console.log(users);

    res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
});

// DELETE: Delete user by ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    if (!users.has(id)) {
        return res.status(404).json({ error: 'User not found.' });
    }

    users.delete(id);
    console.log(users);
    res.status(200).json({ message: 'User deleted successfully.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
