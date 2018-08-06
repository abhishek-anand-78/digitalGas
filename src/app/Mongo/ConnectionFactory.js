let mongoClient = require('mongodb').MongoClient;
var logger = require('../logger/logger.js');
//var url = "mongodb://"+HOST+":"+PORT+"/"+DB_NAME;
var ConnectionPool = null;
function ConnectionFactory(host, port, db_name){
	//return {
		console.log(typeof ConnectionFactory.instance)
		if(typeof ConnectionFactory.instance === 'object'){
			console.log('returning existing');
			let mstToWrite = {info : true, message: 'returning existing'};
			logger.writeLog(mstToWrite);
			return ConnectionFactory.instance
		};

		console.log('creating new');

    var url = "mongodb://"+host+":"+port+"/"+db_name;
		let mstToWrite = {info : true, message: 'creating new pool '+url};
		logger.writeLog(mstToWrite);
		this.createPool = function (){
			console.log('in');
			return new Promise(function(reslove, reject){
				console.log(typeof ConnectionFactory.instance === 'object' , ConnectionPool)
				if(typeof ConnectionFactory.instance === 'object' && ConnectionPool){
					let mstToWrite = {info : true, message: 'returning existing connection from pool'};
					logger.writeLog(mstToWrite);
					console.log('returning existing connection from pool');
					reslove(ConnectionPool);
					return;
				}
        var option = {
          poolSize : 10,
          autoReconnect : true,
          numberOfRetries : 5,
          connectTimeoutMS : 160000
          };
			    mongoClient.connect(url, option, function(err,db){
					if(err){
						let mstToWrite = {info : true, message: 'authentication failed', err: err};
						logger.writeLog(mstToWrite);
						console.log("error :: authentication failed");
						ConnectionPool = null;
						reject(err);
					}else{
						let mstToWrite = {info : true, message: 'Creating new pool'};
						logger.writeLog(mstToWrite);
						console.log("Creating new pool");
						ConnectionPool = db;
						reslove(db);
					}
				});
			})

		};

		this.getConnection = function (){
			return new Promise(function(reslove, reject){
				console.log('returning existing connection from pool main');
        if(ConnectionPool){
           reslove(ConnectionPool);
        }else{
          reject('No connection crrated');
        }

			});
		}

		this.closeConnection = function (con){
			con.close();
		};
	//}
	ConnectionFactory.instance = this;
}
module.exports = ConnectionFactory ;
