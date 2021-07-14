const express = require('express');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
router.get('/login',(req,res)=>res.render('login'));
router.get('/register',(req,res)=>res.render('register'));
router.post('/register',(req,res)=>{
    const { name,email,password,password2 } = req.body;
    let errors = [];
    if(!name || !email || !password || !password2){ errors.push({ msg : 'please fill all'})};
    if(password !== password2){ errors.push({ msg : 'password and confirm must be matched'})};
    if(password < 3 ){ errors.push({ msg : 'password must be 6 charchter at least'})};
    if(errors.length >0 ){ res.render('register',{ errors,name,email,password,password2 });}
    else {
        User.findOne({email : email}).then(user=>
            {
                if(user){ errors.push({msg : 'user exist'}); res.render('register',{ errors,name,email,password,password2 });}
                else{
                    const user = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                   
                });
                bcryptjs.genSalt(10,(err,salt)=>bcryptjs.hash(user.password,salt,(err,hash)=>{
                    if(err)throw err;
                    user.password = hash;
                    user.save(user).then( user =>{
                      req.flash('success_msg','you are registered');
                        res.redirect('/users/login')
                    }).catch(err=>console.log(err));
                }))
               }
            
            });}});

    router.post('/login', (req, res, next)=> {
        passport.authenticate('local',{
            successRedirect:'/dashboard',
            failureRedirect:'/users/login',
            failureFlash:true
        })(req,res,next);});
    router.get('/logout',(req,res)=>{ req.logout(); req.flash('success_msg','you are logged out');res.redirect('/users/login') });    

    module.exports = router;