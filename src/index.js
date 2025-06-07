

import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({ 
    path: './.env'
 })

connectDB()
.then(()=>{
    app.on('error',(error)=>{
        console.log("errrors: ", error);
        throw error
    })
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running on port ${process.env.PORT}`)  // `process.env.PORT` is automatically set by Herok
    })
})
.catch((error)=>{
    console.log("MONGO DB CONNECTION FAILED !!!!!" ,error)
})
