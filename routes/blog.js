const router = global.express.Router();
var jwt = require('jsonwebtoken');

const UserService = require('../lib/services/user');
const BlogService = require('../lib/services/blog');

var Router = function(){
	router.use((req, res, next) => {
		theApp.locals.User = User;
		next();
	});
	
	router.get('/dashboard/', (req, res) => {
		console.log('User', User);
		res.render('dashboard', {
			layout: 'blog',
			pageTitle: 'Dashboard'
		});
	});

	router.get('/article/:id/', (req, res) => {
		BlogService.getArticle(req.params.id, (article) => {
			BlogService.getCategoryBySlug(article.category, (cat) => {
				UserService.getUser(article.author, (author) => {
					var d = new Date(article.date * 1000),
						options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
					var date = d.toLocaleDateString("en-US", options);

					var obj = {
						title: article.title,
						category: cat,
						author: author,
						date: date,
						slug: article.slug,
						text: article.text
					};

					res.render('blog-article', {
						layout: 'blog',
						pageTitle: cat.name+' :: '+article.title,
						article: obj
					});
				});
			});
		});
	});

	router.get('/category/:id/', (req, res) => {
		var hasArticles = true,
			articles = [],
			category = {};
		
		BlogService.getCategoryBySlug(req.params.id, (cat) => {
			category = cat;
			BlogService.getArticlesByCategorySlug(cat.slug, (results) => {
				if(!Array.isArray(results) && results.length == 0){
					hasArticles = false;
				}else{
					results.forEach((el) => {
						if(el.public){
							UserService.getUser(el.author, (author) => {
								var d = new Date(el.date * 1000),
									options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
								var date = d.toLocaleDateString("en-US", options),
									text = el.text;
								var trimmedText = text.substr(0, 200);
								trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));

								var obj = {
									title: el.title,
									category: category,
									author: author,
									date: date,
									slug: el.slug,
									text: trimmedText+'...'
								};

								articles.push(obj);
							});
						}
					});
				}
				res.render('blog-home', {
					token: jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60),
						data: 'guest'
					}, 	process.env.SECRET),
					layout: 'blog',
					pageTitle: category.name,
					hasArticles: hasArticles,
					articles: articles
				});
			});
		});
	});

	router.get('/user/:id/', (req, res) => {
		UserService.getUser(req.params.id, (user) => {
			console.log(user);
		});
	});
	
	router.get('/', (req, res) => {
		var articleArray = [];
		BlogService.getFeaturedArticle((featuredArticle) => {
			var fd = new Date(featuredArticle.date * 1000),
				fdOpts = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
			var fDate = fd.toLocaleDateString("en-US", fdOpts),
				fText = featuredArticle.text;
			var fTrimmedText = fText.substr(0, 200);
			fTrimmedText = fTrimmedText.substr(0, Math.min(fTrimmedText.length, fTrimmedText.lastIndexOf(" ")));

			var featured = {
				title: featuredArticle.title,
				date: fDate,
				slug: featuredArticle.slug,
				text: fTrimmedText+'...'
			};

			BlogService.getHomeArticles((articles) => {
				articles.forEach((e) => {
					BlogService.getCategoryBySlug(e.category, (category) => {
						UserService.getUser(e.author, (author) => {
							var d = new Date(e.date * 1000),
								options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
							var date = d.toLocaleDateString("en-US", options),
								text = e.text;
							var trimmedText = text.substr(0, 200);
							trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));

							var obj = {
								title: e.title,
								category: category,
								author: author,
								date: date,
								slug: e.slug,
								text: trimmedText+'...'
							};
							articleArray.push(obj);
						});
					});
				});

				res.render('blog-home', {
					token: jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60),
						data: 'guest'
					}, 	process.env.SECRET),
					layout: 'blog',
					pageTitle: 'B10g ]-[0m3',
					articles: articleArray,
					featured: featured
				});
			});
		});
	});
	
	return router;
};

module.exports = Router();
