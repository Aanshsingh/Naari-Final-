import "dotenv/config";

import {app } from "./app.js";

import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'https://naari-final-git-main-artansscript.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

import connectDB  from "./config/db.js"
connectDB()
const PORT = process.env.PORT || 8000

   app.listen(PORT,()=>{
        console.log(`Server is running on ${PORT}`)
    })

