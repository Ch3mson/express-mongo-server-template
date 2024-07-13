import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (request, response, next) => {
    const { params: { id }, } = request; // deconstruct body and params's id

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId) // we converted it to numeric instead of a number string

    if (findUserIndex === -1) return response.sendStatus(404) // returns -1 if doesn't exist
    request.findUserIndex = findUserIndex // future middlewares can use findUserIndex property
    next();
}