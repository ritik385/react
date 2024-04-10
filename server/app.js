const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
const { MONGOURI } = require('./config/keys');
mongoose.connect("mongodb+srv://hritikraj4000:uyfYEj17UopqG6PR@cluster0.tf1zehl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1); // Exit the process if unable to connect to MongoDB
});

// Models
require('./models/user');
require('./models/post');

// Routes
app.use(require('./routh/auth'));
app.use(require('./routh/post'));
app.use(require('./routh/user'));

// Serve React build in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
