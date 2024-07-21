import { mockUsers } from "../utils/constants.mjs";
import { validationResult, matchedData } from "express-validator";
import { hashPassword } from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

export const getUserByIdHandler = (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex]
    if (! findUser) return response.sendStatus(404);
    return response.send(findUser)
}

export const createUserHandler = async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());
    const data = matchedData(request);
    data.password = hashPassword(data.password);
    const newUser = new User(data); // constructor from schema
    try {
        const savedUser = await newUser.save(); // save is async so need await
        return response.status(201).send(savedUser)
    } catch (err) {
        return response.sendStatus(400);
    }
};