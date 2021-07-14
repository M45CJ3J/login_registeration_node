const local = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrybt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new local({usernameField : 'email'},(email,password,done)=>{
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'email not  exist'});
                }
                bcrybt.compare(password,user.password,(err,isMatch)=>{
                    if(err)throw err;
                    if(isMatch){return done(null,user);}else {return done(null,false,{message : 'password incorrect'});}
                });
            })
            .catch(err=>consle.log(err))
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}