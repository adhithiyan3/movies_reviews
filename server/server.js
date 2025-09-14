const express = require('express');
require('dotenv').config();
require('express-async-errors'); // handles async errors
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');


// routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Movie Review API is running'));


app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/movies', reviewRoutes);
app.use('/api/users', userRoutes);


// error handler (should be after routes)
app.use(errorHandler);


const PORT = process.env.PORT || 5000;


connectDB().then(() => {
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
console.error('Failed to connect to DB', err);
process.exit(1);
});