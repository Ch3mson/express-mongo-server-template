import express from 'express';
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo';
import "./strategies/discord-strategy.mjs"
// import './strategies/local-strategy.mjs'

const app = express();

mongoose
    .connect('mongodb://localhost:27017')
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(`error: ${err}`));  

app.use(express.json()); // register middleware
app.use(cookieParser("helloworld"));
app.use(session({
    secret: 'benson the dev',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}));

app.use(passport.initialize());
app.use(passport.session()); // attatches user object 

app.use(routes);

app.post('/api/auth', passport.authenticate('local'), (request, response) => {
    response.sendStatus(200);
})

app.get('/api/auth/status', (request, response) => {
    console.log(`inside /auth/status endpoint:`);
    console.log(request.user);
    console.log(request.session); // the session contains 
    console.log(request.sessionID); // same one in mongo
    return request.user ? response.send(request.user) : response.sendStatus(401)
})

app.post('/api/auth/logout', (request, response) => {
    if (!request.user) return response.sendStatus(401);
    request.logout((err) => {
        if (err) return response.sendStatus(400);
        return response.sendStatus(200);
    })
})

app.get('/api/auth/discord', passport.authenticate('discord'));
// authorize redirects to this url bellow
app.get('/api/auth/discord/redirect', passport.authenticate('discord'),
    (request, response) => {
        console.log(request.session);
        console.log(request.user);
        response.sendStatus(200);
    }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { // npm run start:dev 
    console.log(`running on port ${PORT}`)
});


// second argument is a callback function with a request and response object
app.get('/', (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true;
    response.cookie('hello', 'world', { maxAge: 30000, signed: true });
    response.status(201).send({ msg: "hello world" });
});
