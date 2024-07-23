
import mongoose from 'mongoose'
import './strategies/local-strategy.mjs'
import { createApp } from './createApp.mjs';


mongoose
    .connect('mongodb://localhost:27017')
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(`error: ${err}`)); 

const app = createApp(); 


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { // npm run start:dev 
    console.log(`running on port ${PORT}`)
});