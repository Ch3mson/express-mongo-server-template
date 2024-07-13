import { Router } from 'express';
import { query, validationResult, checkSchema, matchedData } from 'express-validator';
import { mockUsers } from '../utils/constants.mjs'
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { resolveIndexByUserId } from '../utils/middleware.mjs';
const router = Router()


// use /api/... 
// localhost:3000/api/users?filter=username&value=an
router.get('/api/users', query('filter')
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

router.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex]
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser)
})

// post requests have data in its 'request body' or 'payload'
router.post('/api/users', checkSchema(createUserValidationSchema),
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

router.put('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request; // keep request body

    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body } // updates user with whatever you passed in
    return response.sendStatus(200);
});

router.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body } // keep the rest except whatever you send
    return response.sendStatus(200);
});

router.delete('/api/users/:id', resolveIndexByUserId, (request, response) => { // usually dont need a body
    const {  findUserIndex, } = request;

    mockUsers.splice(findUserIndex, 1); // deletes only 1

    return response.sendStatus(200);
})

export default router;