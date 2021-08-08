const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');
const db = require('../db');

class UserService {
    constructor(){}

    create(data, callback){
        var error;
        var query = 'SELECT id FROM users WHERE email = "'+data.email+'"';
        db.query(query).then((result) => {
            if(Array.isArray(result) && result.length){
                error = 'You already have a registered account.';
            }else{
                bcrypt.hash(data.password, 10, (err, hash) => {
                    var token = jwt.sign({ data: data.id }, process.env.SECRET, { expiresIn: 60*60 });
					var joined = new Date();
					joined = Date.parse(joined);
                    var q = 'INSERT INTO users SET email = "'+data.email+'", name = "'+data.username+'", password = "'+hash+'", joined = '+parseInt(joined)+', token = "'+token+'"';
                    db.query(q).then((results) => {
                        callback();
                    }).catch((err) => {
                        console.log(err);
                    });
                });
            }
        });
    }

    login(data, callback){
        var _t = this;

        var query = 'SELECT * FROM users WHERE name = "'+data.username+'"';
        db.query(query).then((results) => {
            if(results.length){
                bcrypt.compare(data.password, results[0].password, (err, result) => {
                    if(err){
                        callback({
                            status: "error",
                            error: err
                        });
                    }else{
                        if(result){
                            var token = jwt.sign({ data: results[0].id }, process.env.SECRET, { expiresIn: 60*60 });

                            var u = {
                                id: results[0].id,
                                name: results[0].name,
                                email: results[0].email,
								joined: results[0].joined,
								admin: results[0].admin,
                                token: token
                            };

                            _t.update(results[0].id, u, () => {
                                callback({
                                    status: "ok",
                                    data: u
                                });
                            });
                        }else{
                            callback({
                                status: "error",
                                error: "Incorrect username or password."
                            });
                        }
                    }
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    forgot(type, target){
        
    }

	getUser(id, callback){
		var query = 'SELECT * FROM users WHERE id = '+id;
		db.query(query).then((results) => {
			var obj = {
				id: results[0].id,
				name: results[0].name,
				email: results[0].email,
				joined: results[0].joined,
				admin: results[0].admin,
				token: results[0].token
			};
			callback(obj);
		});
	}

	update(id, obj, callback){
		var t = this;
		
		if(typeof obj !== 'object'){
		 	console.log('user update error');
		}else{
			var value;
		 	var query = 'UPDATE users SET ';
		 
		 	var i = 1;
		 
		 	for(var key in obj){
		  		if(key == 'password'){
		   			value = bcrypt.hashSync(obj[key], 10);
		  		}else{
		   			value = obj[key];
		  		}
		  
		  		query += key+' = ';
		  		if(!t.isNumeric(value)){
		   			query += '"'+value+'"';
		  		}else{
		   			query += value;
		  		}
		  
		  		if(i < Object.keys(obj).length){
		   			query += ', '
		  		}
		  
		  		i++;
		 	}
		 
		 	query += ' WHERE id = '+id;
		 
		 	db.query(query).then((results) => {
				callback();
			}).catch((err) => {
				console.log(err);
			});
		}
	}
	   
	isNumeric(str){
		if (typeof str != "string") return false;
		return !isNaN(str) && isNaN(parseInt(str));
	}
}

module.exports = new UserService();