const express = require('express');
const app = express();

app.use(express.json());

let users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
];

let nextId = 3;

app.get('/users', (req, res) => {
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User with id ${id} not found`
        });
    }
    
    res.status(200).json({
        success: true,
        data: user
    });
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }
    
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address"
        });
    }
    
    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
        return res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }
    
    const newUser = {
        id: nextId++,
        name: name,
        email: email
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser
    });
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to DecodeLabs API",
        endpoints: {
            "GET /users": "Get all users",
            "GET /users/:id": "Get a single user by ID",
            "POST /users": "Create a new user"
        }
    });
});

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    
    users.splice(userIndex, 1);
    res.status(204).send(); // 204 No Content
});

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const user = users.find(u => u.id === id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    
    res.status(200).json({
        success: true,
        data: user
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`   Try: http://localhost:3000/users`);
}); 