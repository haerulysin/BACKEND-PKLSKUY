const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("user");
const keys = require("./globalkeys");
const passport = require("passport");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.JWTSecreyKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts,(jwtpayload,done) => {
            User.findById(jwtpayload.id)
            .then(user => {
                if(user){
                    return done(null,user);
                }
                return done(null,false);
            }).catch(err => console.log(err));
        })
    );
}