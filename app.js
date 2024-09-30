const express = require('express'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const formRoutes = require('./routes/forms'); // Updated path for routes

dotenv.config(); // Load .env file

const app = express();

// Connect to MongoDB without deprecated options
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit the app if the connection fails
});

// Middleware to parse JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Updated route for form submission
app.use('/submit-form', formRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
