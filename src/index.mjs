import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, username: "anson", displayName: "Anson" },
    { id: 2, username: "jack", displayName: "Jack" },
    { id: 3, username: "adam", displayName: "Adam" }
];

// second argument is a callback function with a request and response object
app.get('/', (request, response) => {
    response.status(201).send({ msg: "hello world" });
});

// use /api/... 
app.get('/api/users', (request, response) => {
    response.send([
        { id: 1, username: "anson", displayName: "Anson" },
        { id: 2, username: "jack", displayName: "Jack" },
        { id: 3, username: "adam", displayName: "Adam" }
    ]);
});

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









app.listen(PORT, () => { // start port, response is to console log
    console.log(`running on port ${PORT}`)
});


