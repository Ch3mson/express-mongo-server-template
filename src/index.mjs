import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

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
app.get('/', (request, response) => {
    response.status(201).send({ msg: "hello world" });
});

// use /api/... 
// localhost:3000/api/users?filter=username&value=an
app.get('/api/users', (request, response) => {
    console.log(request.query);
    const { query: { filter, value } } = request;


    if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    );

    // when the filter is undefined
    return response.send(mockUsers);
});

app.post

app.get('/api/users/:id', (request, response) => {
    console.log(request.params); // tells us the parameter id
    const parsedId = parseInt(request.params.id); // is it valid?

    // if invalid, return 400
    if (isNaN(parsedId)) return response.status(400).send({ msg: "bad request. invalid id"}); 
    
    // find the user
    const findUser = mockUsers.find((user) => user.id === parsedId);

    if (!findUser) return response.sendStatus(404);
    return response.send(findUser)
})

app.get('/api/products', (request, response) => {
    response.send([{ id: 123, name: "chicken breast", price: 12.99}])
});

// post requests have data in its 'request body' or 'payload'








app.listen(PORT, () => { // npm run start:dev 
    console.log(`running on port ${PORT}`)
});


