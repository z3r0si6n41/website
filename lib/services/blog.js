const db = require("../db");

class BlogService {
	constructor(){}
	
	createArticle(data, callback){
	
	}
	
	getArticle(slug, callback){
		var query = 'SELECT * FROM articles WHERE slug = "'+slug+'"';
		db.query(query).then((results) => {
			callback(results[0]);
		});
	}

	getArticlesByCategorySlug(slug, callback){
		var query = 'SELECT * FROM articles WHERE category = "'+slug+'"';
		db.query(query).then((results) => {
			callback(results);
		});
	}
	
	createCategory(data){
	
	}
	
	getCategories(callback){
		var query = 'SELECT * FROM categories';
		db.query(query).then((results) => {
			callback(results);
		});
	}
	
	getCategoryById(id, callback){
		var query = 'SELECT * FROM categories WHERE id = '+id;
		db.query(query).then((results) => {
			callback(results[0]);
		});
	}

	getCategoryBySlug(slug, callback){
		var query = 'SELECT * FROM categories WHERE slug = "'+slug+'"';
		db.query(query).then((results) => {
			callback(results[0]);
		});
	}

	getFeaturedArticle(callback){
		var query = 'SELECT * FROM articles WHERE featured = 1';
		db.query(query).then((results) => {
			callback(results[0]);
		});
	}
	
	getHomeArticles(callback){
		var query = 'SELECT * FROM articles WHERE featured = 0 LIMIT 4';
		db.query(query).then((results) => {
			callback(results);
		});
	}
}

module.exports = new BlogService();