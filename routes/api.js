const router = global.express.Router();
var Tpl = require('../lib/tpl');

//router.use(global.tokenAuth);

router.post('/tpl/', (req, res) => {
	var id = req.body.id;
	Tpl.render(id, function(html){
		var r = {
			data: {},
			html: html
		};
		if(id === 'contact' || id === 'register'){
			var svgCaptcha = require('svg-captcha');
			var captcha = svgCaptcha.create({
				size: 6,
				ignoreChars: '0oO1iIlL',
				noise: 2,
			});
			
			global.captcha = captcha.text;
			r.data.captcha = captcha.text;
		}
		res.json(r);
	});
});

module.exports = router;