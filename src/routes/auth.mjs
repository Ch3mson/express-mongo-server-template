import { Router } from 'express';
import { mockUsers } from '../utils/constants.mjs';

const router = Router()

// router.post('/api/auth', (request, response) => {
//     const { body: { username, password } } = request;
//     const findUser = mockUsers.find((user) => user.username === username); // find user is the person object
//     if (!findUser || findUser.password !== password) {
//         return response.status(401).send( {msg: "bad credentials" });
//     }

//     request.session.user = findUser;  // session.user becomes the user you wanted
//     return response.status(200).send(findUser); // sends back user data

// })

// router.get('/api/auth/status', (request, response) => {
//     request.sessionStore.get(request.sessionID, (err, session) => { // logs the cookie age and info, and the users data
//         console.log(session);
//     });
//     return request.session.user 
//     ? response.status(200).send(request.session.user) // these 2 are the api requests
//     : response.status(401).send( {msg: "not authenticated" });
// })

export default router;