import express from 'express';
import routes from './routes/index.mjs'

const app = express();

app.use(express.json()) // register middleware
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { // npm run start:dev 
    console.log(`running on port ${PORT}`)
});


// second argument is a callback function with a request and response object
app.get('/', (request, response) => {
    response.cookie('hello', 'world', { maxAge: 60000 });
    response.status(201).send({ msg: "hello world" });
});
