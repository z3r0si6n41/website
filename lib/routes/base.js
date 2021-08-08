const router = global.express.Router();
var jwt = require('jsonwebtoken');

const UserService = require('../lib/services/user');

var Router = function(){
    router.get('/', (req, res) => {
        res.render('site-home', {
			token: jwt.sign({
					exp: Math.floor(Date.now() / 1000) + (60 * 60),
					data: 'guest'
				}, 	process.env.SECRET),
            layout: 'site',
            pageTitle: 'Home'
        });
    });

    return router;
};

module.exports = Router();
