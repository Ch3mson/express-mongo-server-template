import express from 'express';
import { query, body, validationResult, matchedData, checkSchema } from 'express-validator' // for validating query parameters
import { createUserValidationSchema } from './utils/validationSchemas.mjs';
const app = express();

app.use(express.json()) // register middleware

const loggingMiddleware = (request, response, next) => { // next is what to do after middleware
    console.log(`${request.method} - ${request.url}`); // ie: GET - /
    next();
};

const PORT = process.env.PORT || 3000;

const resolveIndexByUserId = (request, response, next) => {
    const { params: { id }, } = request; // deconstruct body and params's id

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId) // we converted it to numeric instead of a number string

    if (findUserIndex === -1) return response.sendStatus(404) // returns -1 if doesn't exist
    request.findUserIndex = findUserIndex // future middlewares can use findUserIndex property
    next();
}

const mockUsers = [
    { id: 1, username: "anson", displayName: "Anson" },
    { id: 2, username: "jack", displayName: "Jack" },
    { id: 3, username: "adam", displayName: "Adam" },
    { id: 4, username: "tina", displayName: "Tina" },
    { id: 5, username: "jason", displayName: "Jason" },
    { id: 6, username: "henry", displayName: "Henry" },
    { id: 7, username: "marilyn", displayName: "Marilyn" }
];

// second argument is a callback function with a request and response object
app.get('/', 
    (request, response, next) => {
        console.log("base url 1");
        next()
    },
    (request, response, next) => {
        console.log("base url 2");
        next()
    }, (request, response, next) => {
        console.log("base url 3");
        next()
    }, (request, response) => {
    response.status(201).send({ msg: "hello world" });
});


// use /api/... 
// localhost:3000/api/users?filter=username&value=an
app.get('/api/users', query('filter')
    .isString()
    .notEmpty()
    .withMessage('must not be empty')
    .isLength({ min: 3, max: 10 })
    .withMessage('must be 3-10 characters'),

    (request, response) => {
        const result = validationResult(request);
        console.log(result)
        const { query: { filter, value } } = request;

        if (filter && value) return response.send(
            mockUsers.filter((user) => user[filter].includes(value))
        );

    // when the filter is undefined
    return response.send(mockUsers);
});

app.use(loggingMiddleware, (request, response, next) => { // calling 2 middlewares
    console.log("Finished logging...");
    next()
});


// post requests have data in its 'request body' or 'payload'
app.post('/api/users', checkSchema(createUserValidationSchema),
    (request, response) => {
        const result = validationResult(request);
        console.log(result)
        
        if(!result.isEmpty()) return response.status(400).send({ errors: result.array() });

        const data = matchedData(request); // use this matchedData instead of request.body
        console.log(data);

        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data}; // returns rest of user like whatever u sent
        mockUsers.push(newUser); // push onto the database

        return response.status(201).send(newUser);
    }
);


app.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex]
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser)
})

app.get('/api/products', (request, response) => {
    response.send([{ id: 123, name: "chicken breast", price: 12.99}])
});

app.put('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request; // keep request body

    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body } // updates user with whatever you passed in
    return response.sendStatus(200);
});

app.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body } // keep the rest except whatever you send
    return response.sendStatus(200);
});

app.delete('/api/users/:id', resolveIndexByUserId, (request, response) => { // usually dont need a body
    const {  findUserIndex, } = request;

    mockUsers.splice(findUserIndex, 1); // deletes only 1

    return response.sendStatus(200);
})



app.listen(PORT, () => { // npm run start:dev 
    console.log(`running on port ${PORT}`)
});


