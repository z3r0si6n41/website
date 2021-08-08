const mysql = require('mysql2');

const database = mysql.createPool({
	host: 'localhost',
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
  });

var Database = function(){};

Database.prototype.query = (sql) => {
    return new Promise((resolve, reject) => {
        database.query(sql, (error, results) => {
            if(error){
                return reject(error);
            }else{
                resolve(results);
            }
        });
    });
};

Database.prototype.close = () => {
    return new Promise((resolve, reject) => {
        database.end(err => {
            if(err) return reject(err);
            resolve();
        });
    });
};

module.exports = new Database();