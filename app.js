const express = require('express');
const layout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
const db = require('./config/keys').MongoURL;
require('./config/passport')(passport);
mongoose.connect(db, {  useCreateIndex: true,
    keepAlive: 1,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true })
.then(()=>console.log('connected...'))
.catch((err) => console.log(err));

app.use(layout);

app.set('view engine','ejs')

app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
  app.use((req,res,next)=>{
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  });
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/user'));

const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log(`http://localhost:${PORT}`));