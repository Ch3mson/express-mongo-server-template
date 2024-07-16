import passport from 'passport';
import { Strategy } from 'passport-local';
import { mockUsers } from '../utils/constants.mjs';

passport.serializeUser((user, done) => {
    console.log(`inside serialize user:`);
    console.log(user);
    done(null, user.username); // make user argument unique, like its id
});

passport.deserializeUser((username, done) => { // that id is the used in deserializer
    console.log(`inside Deserializer:`);
    try {
        const findUser = mockUsers.find((user) => user.username === username)
        if (!findUser) throw new Error('user not found');
        done(null, findUser)
    } catch (err) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy((username, password, done) => {
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        try {
            const findUser = mockUsers.find((user) => user.username === username);
            if (!findUser) throw new Error('user not found');
            if (findUser.password !== password) throw new Error('invalid credentials');
            
            done (null, findUser);

        } catch (err) {
            done(err, null);
        }
    })
);