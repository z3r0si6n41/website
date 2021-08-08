const router = global.express.Router();
var jwt = require('jsonwebtoken');

const UserService = require('../lib/services/user');
const BlogService = require('../lib/services/blog');

var Router = function(){
	router.get('/dashboard/', (req, res) => {
		var token = req.query.t;
		
		if(token == null || token == "undefined"){
			return res.redirect('user/login');
		}
		
		jwt.verify(token, process.env.SECRET, (err, decoded) => {
			if(err){
				console.log(err);
				res.redirect('/user/login');
			}
			
			UserService.get(decoded.data, (u) => {
				if(u.id == 'undefined'){
					return res.redirect('/user/login');
				}
				
				res.render('blog-dashboard', {
					layout: 'blog',
					pageTitle: 'Dashboard',
					token: token
				});
			});
		});
	});
	
	router.get('/', (req, res) => {
		var hasArticles = true,
			articles = [];
		BlogService.getHomeArticles((results) => {
			if(!Array.isArray(results) && results.length == 0){
				hasArticles = false;
			}else{
				results.forEach((el) => {
					if(el.public){
						BlogService.getCategoryBySlug(el.category, (result) => {
							var category = '<a href="https://z3r0sign41.com/blog/category/'+result[0].slug+'">'+result[0].name+'</a>';
							UserService.getUser(el.author, (result) => {
								console.log(result);
								var author = '<a href="https://z3r0sign41.com/blog/user/'+result.id+'">'+result.name+'</a>',
									d = new Date(el.date * 1000),
									options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
								var date = d.toLocaleDateString("en-US", options),
									text = el.text;
								var trimmedString = text.substr(0, 200);
								trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

								var obj = {
									title: el.title,
									category: category,
									author: author,
									date: date,
									slug: el.slug,
									text: trimmedString+"..."
								};
								articles.push(obj);
							});
						});
					}
				});
			}
			console.log(articles);
			res.render('blog-home', {
				token: jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60),
					data: 'guest'
				}, 	process.env.SECRET),
				layout: 'blog',
				pageTitle: 'B10g ]-[0m3',
				hasArticles: hasArticles,
				articles: articles
			});
		});
	});
	
	return router;
};

module.exports = Router();
