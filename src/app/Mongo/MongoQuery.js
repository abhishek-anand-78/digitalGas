var ConnectionFactory = require('./ConnectionFactory.js');
let mongoClient = require('mongodb');

var MongoQuery = function () {
	return {
		getAllUserData: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.find().toArray(function (err, data) {
						if (err) {
							reject(err);
						}
						console.log(data)
						reslove(data);
					});
				}).catch((e)=>{
					reject(e);
				});
			});
		},
		getDealerList: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.find({},{ 'fields': {'name': 1, '_id': 0}}).toArray(function (err, data) {
						if (err) {
							reject(err);
						}
						console.log(data)
						reslove(data);
					});
				}).catch((e)=>{
					reject(e);
				});
			});
		},
		getCustomerList: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.find({'flag': 'customer'},{'fields': {customerName : 1, '_id': 1}}).toArray(function (err, data) {
						if (err) {
							reject(err);
						}
						console.log(data);
						reslove(data);
					});
				}).catch((e)=>{
					reject(e);
				});
			});
		},
		getMonthlyBillData: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					let resultData;
					if(query.flag == 'dealer'){
						resultData = userCollection.aggregate([						
							{$addFields: { "month":{$substrBytes: ["$date", 5, 2] }, "year":{$substrBytes: ["$date", 0, 4]} } },
							{$match: { month: query.month, year: query.year, flag: query.flag, dealer: query.cust_dealer }}						
						]);
					}else if(query.flag == 'customer'){
						resultData = userCollection.aggregate([						
							{$addFields: { "month":{$substrBytes: ["$date", 5, 2] }, "year":{$substrBytes: ["$date", 0, 4]} } },
							{$match: { month: query.month, year: query.year, flag: query.flag, customerName: query.cust_dealer }}						
						]);
					}else{
						resultData = userCollection.aggregate([						
							{$addFields: { "month":{$substrBytes: ["$date", 5, 2] }, "year":{$substrBytes: ["$date", 0, 4]} } },
							{$match: { month: query.month, year: query.year, flag: query.flag }}						
						]);
					}
					resultData.toArray(function (err, data) {
						if (err) {
							reject(err);
						}
						console.log(data);
						reslove(data);
					});
				}).catch(function(e){
					reject(e);
				});
			});
		},
		getYearlyBillData: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					let resultData;
					if(query.flag == 'dealer'){
						resultData = userCollection.aggregate([						
							{$addFields: { "year":{$substrBytes: ["$date", 0, 4]} } },
							{$match: { year: query.year, flag: query.flag, dealer: query.cust_dealer }}						
						]);						
					}else if(query.flag == 'customer'){
						resultData = userCollection.aggregate([						
							{$addFields: { "year":{$substrBytes: ["$date", 0, 4]} } },
							{$match: { year: query.year, flag: query.flag, customerName: query.cust_dealer }}						
						]);
					}else{
						resultData = userCollection.aggregate([						
							{$addFields: { "year":{$substrBytes: ["$date", 0, 4]} } },
							{$match: { year: query.year, flag: query.flag }}						
						]);
					}
					resultData.toArray(function (err, data) {
						if (err) {
							console.log("sadasjdlkajslkdalksjdklaj");
							reject(err);
						}
						console.log(data);
						reslove(data);
					});
					
				}).catch((e)=>{
					reject(e);
				});
			});
		},		
		getMonthlyProfit: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.aggregate([
						{$addFields: { "month":{$substrBytes: ["$date", 5, 2] }, "year":{$substrBytes: ["$date", 0, 4]} } },
						{$match: { month: query.month, year: query.year }},
						{"$group":{"_id": "$flag", "totalPrice": {"$sum": "$netAmountPayable"}, "amountDueTotal": {"$sum": "$amountDue"},"count": {"$sum": 1}}}
					  ]).toArray(function (err, data) {
						if (err) {
							reject(err);
						}
						console.log(data)
						reslove(data);
					});
				}).catch((e)=>{
					reject(e);
				})
			});
		},
		getYearlyProfit: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.aggregate([
						{$addFields: { "year":{$substrBytes: ["$date", 0, 4]} } },
						{$match: { year: query.year }},
						{"$group":{"_id": "$flag", "totalPrice": {"$sum": "$netAmountPayable"}, "amountDueTotal": {"$sum": "$amountDue"},"count": {"$sum": 1}}}
					  ]).toArray(function (err, data) {
						if (err) {
							reject(err);
						}
						console.log(data)
						reslove(data);
					});
				}).catch((e) => {
					reject(e);
				});
			});
		},
		inserUserRecord: function (db_name, data, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.insert(data, { w: 1 }, function (err, result) {
						//con.close();
						if (err) {
							reject(err);
						}
						reslove('Y');
					});
				}).catch((e) => {
					reject(e);
				});
			});
		},
		getTableData: function (db_name, tableName, returnFullArray) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.find().toArray(function (err, data) {
						
						if (err) {
							reject(err);
						}
						if (data && data.length) {
							if (returnFullArray) {
								reslove(data);
							} else {
								reslove(data[0]);
							}
						} else {
							reslove('undefined');
						}

					});
				}).catch((e)=>{
					reject(e);
				});
			});
		},
		// these features will be available in next release
		updateUserRecord: function (db_name, userID, data, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.update({ '_id':new mongoClient.ObjectID(userID)}, {$set: data},{upsert: true}, function (err, result) {						
						if (err) {
							reject(err);
						}
						reslove(result);
					});
				}).catch((e)=>{
					reject(e);
				});
			});
		},
		deleteTableRows: function (db_name, tableName, rowsIdsToBeDeleted) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.remove({ _id: { $in: rowsIdsToBeDeleted } }, function (err, response) {
						if (err) {
							reject(err);
						}
						reslove(response);
					});
				}).catch((e)=>{
					reject(e);
				});
			});
		}
	};
}();
module.exports = MongoQuery;
