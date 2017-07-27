var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var mongoose = require('mongoose');
var Regex = require("regex");
var config_urls = require("./configFiles/DBconfigfile");
var config = require("./configFiles/appConfig").OUTLOOK_365;
var expressValidator = require('express-validator');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const uuid = require('uuid');
var uidaiRoutes = require('./routes/uidai/aadhaar');
const secret = uuid.v4();
//const MongoStore = require('connect-mongo')(session);

mongoose.connect(config_urls.url.mongoDB, function(err, db) {
    if (!err) {
        console.log("Connected to Database")
    } else {
        console.log("failed to connect");
    }
});


var app = express();


const callback = (iss, sub, profile, accessToken, refreshToken, done) => {
    console.log("Hello dude");
    done(null, {
        profile,
        accessToken,
        refreshToken
    });
};

passport.use(new OIDCStrategy(config.creds, callback));

const users = {};
passport.serializeUser((user, done) => {
    console.log(user, "Heelo", "serialize");
    const id = uuid.v4();
    users[id] = user;
    done(null, id);
});
passport.deserializeUser((id, done) => {
    console.log(id, "Heelo", "deserialize");
    const user = users[id];
    done(null, user);
});

var appRoutes = require('./routes/index');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(compression());


app.use(session({
    secret: secret,
    name: 'graphNodeCookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1800000 },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 1800000
    })
}));

app.use('/:app_id/*', function(req, res, next) {



    let app_id = req.params.app_id;
    if (app_id.length == 14 && app_id.startsWith('DB')) {
        if (req.session.app_id == app_id) {
            next();
        } else {
            res.redirect('/access_denied.jpg');
        }
    } else {
        next();
    }
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));


if (config.isOutlook365Enabled) {

    app.use(passport.initialize());
    app.use(passport.session());
    const redirects = {
        failureRedirect: '/'
    };


    app.get('/', function(req, res, next) {

        console.log("is auth", req.isAuthenticated());

        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/auth')
        }

    });


    app.get('/completeInformation', function(req, res, next) {

        console.log("is auth", req.isAuthenticated());

        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/auth')
        }

    });

    app.get('/completeInformation/:child', function(req, res, next) {

        console.log("is auth", req.isAuthenticated());

        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/auth')
        }

    });

    app.get('/auth', passport.authenticate('azuread-openidconnect', redirects), (req, res) => {
        next();
    })

    app.get('/home',
        passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
        (req, res) => {
            console.log("Token user", req.user);
            res.render('index');
        });

}

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/', appRoutes);

//oao
var api = require('./routes/oaoRoutes/api');
app.use('/api', api); //chandan

//onlinIdCheck
var idcheck = require('./routes/onlineIdCheckRoutes/idcheck');
app.use('/idcheck', idcheck);

//login
var loginUserAPI = require('./routes/loginRoutes/loginAPI'); //chandan
app.use('/loginAPI', loginUserAPI); //chandan

//chat bot actions
var actions = require('./routes/chatBotRoutes/action');
app.use('/action', actions);

var chatBots = require('./routes/skypeChatBotRoutes/chatBot');
app.use('/chatBot', chatBots); //Rajath

//aadhar actions
var verificationRoutes = require('./routes/docVerify/verification');
app.use('/', verificationRoutes);
app.use('/uidai', uidaiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.render('index');
});

app.use(expressValidator({
    customValidators: {
        isAuNumber: function(value) {
            // return Array.isArray(value);

            if (value != "") {

                // var regexqq = new Regex(/\^[a-zA-Z]{2}$/g);

                // var resul=regexqq.test('aa');

                // console.log("final result==>"+resul);

                // var pattern = /^(0[0-8]{8})$/;
                // var match = pattern.exec(value);
                // console.log(match);

                var regexp = /\^([a-z])\d{2}/;
                // var regexp =/^(0[0-8]{8,})$/;
                console.log(regexp);
                console.log(value);
                console.log(regexp.test(value));
                var result = regexp.test(value);
                console.log("custome\t" + result);

                // if(result==true){
                //     console.log("condition"+value);
                return value;
                // }
            }
            return value;
        }
    }
}));

module.exports = app;