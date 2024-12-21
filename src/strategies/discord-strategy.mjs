import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

passport.serializeUser((user, done) => {
    console.log(`inside serialize user:`);
    console.log(user);
    done(null, user.id); // make user argument unique, like its id
});

passport.deserializeUser(async (id, done) => { // that id is the used in deserializer
    console.log(`inside Deserializer:`);
    console.log(`deserializing user ID: ${id}`);
    try {
        const findUser = await DiscordUser.findById(id);
        if (!findUser) throw new Error('user not found');
        done(null, findUser)
    } catch (err) {
        done(err, null);
    }
})



export default passport.use(
    new Strategy(
        {
            clientID: '1263328112016621640',
            clientSecret: 'Av3T6FdCJt7i4yR5XhcHSiofNUWvJK3D',
            callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
            scope: ["identify"],
        }, 
        async (accessToken, refreshToken, profile, done) => {
            let findUser;
            
            try {
                findUser = await DiscordUser.findOne({ discordId: profile.id }) // checks db if it has one
            } catch (err) {
                return done(err, null) // possible err if u cant find
            }

            try {
                if (!findUser) {
                    const newUser = new DiscordUser({ 
                        username: profile.username, 
                        discordId: profile.id,
                });
                const newSavedUser = await newUser.save(); // can be error here
                return done(null, newSavedUser);
            }
            return done(null, findUser)
            } catch (err) {
                console.log(err);
                return done(err, null);
            }
        }
    )
);
