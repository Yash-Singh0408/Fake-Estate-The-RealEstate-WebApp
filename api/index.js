import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/database.js';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';

const app= express()

app.use(express.json())
app.use(cookieParser())


//Initialize Port Number
const PORT = process.env.PORT || 5000;


//Connect DB
connectDB();

//Listining
app.listen(PORT, () => console.log(`Server is Started On ${PORT}`));

// Routes
app.use('/api/user' , userRouter);
app.use('/api/auth' , authRouter)
app.use('/api/listing' , listingRouter)

// Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});