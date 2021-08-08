require('dotenv').config();

const express = require('express'),
    app = express(),
    db = require('./lib/db'),
    http = require('http').Server(app),
    Handlebars = require('handlebars'),
    hb = require('express-handlebars'),
	bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken');

process.on('uncaughtException', (err) => {
    console.log("Uncaught Exception:", err);
    process.exit();
});

global.express = express;
global.db = db;
global.HB = Handlebars;

global.tokenAuth = function(req, res, next){
    var token = req.body.token;
    if(!token){
        return res.status(401).send({ status: "error", error: 'No token provided.'});
    }

    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if(err){
            return res.status(500).send({ status: "error", error: 'Failed to authenticate token.'});
        }
        next();
    });
};

global.User = {
	id: 0,
	name: 'Guest',
	email: '',
	joined: 0,
	admin: 0,
	token: ''
};

const BlogService = require('./lib/services/blog');
BlogService.getCategories((cats) => {
	var catString = "";
	cats.forEach(el => {
		if(el.public){
			catString += `<a class="p-2 link-secondary" href="/blog/category/${el.slug}/">${el.name}</a>`;
		}
	});
	app.locals.blogMenu = catString;
});

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/assets/'));

handlebars = hb.create({
    extname: ".html",
    defaultLayout: "site",
    layoutsDir: __dirname+'/views/layouts/',
    partialsDir: __dirname+'/views/partials/'
});
app.engine('html', handlebars.engine);
app.set('view engine', 'html');

app.locals.site = {
    name: "z3r0 | sign41",
    host: process.env.HOST,
    baseURL: 'https://'+process.env.HOST,
    copyDate: new Date().getFullYear()
};

var apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

var userRoutes = require('./routes/user');
app.use('/user', userRoutes);

var blogRoutes = require('./routes/blog');
app.use('/blog', blogRoutes);

var siteRoutes = require('./routes/base');
app.use('/', siteRoutes);

global.theApp = app;

http.listen(process.env.PORT, () => {
    console.log('Application running on '+process.env.HOST+':'+process.env.PORT);
})
