import * as validator from 'express-validator';
import * as helpers from '../utils/helpers.mjs'
import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { User } from '../mongoose/schemas/user.mjs';

jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: 'Invalid Username' }]),
    })),
    // we use matchedData and our post request gives these 3 keys
    matchedData: jest.fn(() => ({
        username: "test",
        password: "password",
        displayName: "displayName",
    })),
}));

jest.mock('../utils/helpers.mjs', () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`), // overriding its function return value
}))

jest.mock('../mongoose/schemas/user.mjs')

const mockRequest = {
    findUserIndex: 1,
};
const mockResponse = {
    sendStatus: jest.fn(),
    send: jest.fn(),
    status: jest.fn(() => mockResponse), // send its self so it has send and sendStatus in it
}; 


describe('get users', () => {

    it('should get user by id', () => {
        getUserByIdHandler(mockRequest, mockResponse);
        // test to make sure user is found and not found:
        expect(mockResponse.send).toHaveBeenCalled(); // expect the function was called
        expect(mockResponse.send).toHaveBeenCalledWith({
            id: 2,
            username: 'jack',
            displayName: 'Jack',
            password: 'hello123'
        });
        expect(mockResponse.send).toHaveBeenCalledTimes(1);
    });

    it('should call sendStatus 404 when user not found', () => {
        const copyMockRequest = { ...mockRequest, findUserIndex: 100 };
        getUserByIdHandler({mockRequest}, mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalled(); // make sure it works first 
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1)
        expect(mockResponse.send).not.toHaveBeenCalled(); 
    })
});

describe('create users', () => {
    it('should return a status of 400 when there are errors', async () => {
        await createUserHandler(mockRequest, mockResponse);
        expect(validator.validationResult).toHaveBeenCalled();
        expect(validator.validationResult).toHaveBeenCalledWith(mockRequest); // check if it used request
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith([{ msg: 'Invalid Username' }]);
    });

    it('should return status 201 and the user created', async () => {
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true),
        })); // changing mock validation result for isEmpty field to be true isntead
        
        const saveMethod = jest.spyOn(User.prototype, 'save').mockResolvedValueOnce({
            id: 1,
            username: "test",
            password: "hashed_password",
            displayName: "displayName",
        });

        await createUserHandler(mockRequest, mockResponse);
        expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
        expect(helpers.hashPassword).toHaveBeenCalledWith("password");
        expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
        expect(User).toHaveBeenCalledWith({
            username: "test",
            password: "hashed_password",
            displayName: "displayName",
        });
        expect(saveMethod).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith({
            id: 1,
            username: "test",
            password: "hashed_password",
            displayName: "displayName",
        });
    });
    it('should send status 400 if data base doesnt save user', async () => {
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true),
        }));
        const saveMethod = jest.spyOn(User.prototype, 'save').mockImplementationOnce(() => Promise.reject('failed to save user'));
        await createUserHandler(mockRequest, mockResponse);
        expect(saveMethod).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    })
});

// 'npm run test' to test