const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const formRoutes = require('./routes/forms'); // Import form routes
const cors = require('cors'); // Import CORS to handle cross-origin requests

dotenv.config(); // Load environment variables

const app = express();

// CORS configuration for proxying frontend requests to backend API
app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace this with your frontend URL during production
    methods: ['GET', 'POST'], // Define allowed HTTP methods
    credentials: true, // Allow credentials to be sent in requests
}));

// Connect to MongoDB with secure options (no deprecated flags)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit if connection fails
});

// Middleware for parsing JSON requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Route for form submission
app.use('/api/form-submit', formRoutes); // Proxying API calls

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 ;