const router = global.express.Router();
var { body, validationResult } = require('express-validator');
var UserService = require('../lib/services/user');

router.get('/login/', (req, res) => {
    res.render('user-login', {
        layout: 'site',
        pageTitle: 'Login'
    });
});

router.post('/login/', (req, res) => {
    var data = {
        username: req.body.username,
        password: req.body.password
    };

    UserService.login(data, (result) => {
        if(result.status == "error"){
            res.send(result.error);
        }else{
            global.User = result.data;
            res.json(User);
        }
    });
});

router.get('/register/', (req, res) => {
    res.render('user-register', {
        layout: 'site',
        pageTitle: 'Register'
    });
});

router.post('/register/', body('email').isEmail().normalizeEmail(), (req, res) => {
    const errors = validationResult(req);
    var data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    UserService.create(data, (uid) => {

    });
});

router.get('/forgot-password/', (req, res) => {
    res.render('user-forgot-pass', {
        layout: 'site',
        pageTitle: 'Forgot Password'
    });
});

router.post('/forgot-password/', (req, res) => {
    
});

router.get('/forgot-username/', (req, res) => {
    res.render('user-forgot-user', {
        layout: 'site',
        pageTitle: 'Forgot Username'
    });
});

router.post('/forgot-username/', (req, res) => {
    
});

module.exports = router;
