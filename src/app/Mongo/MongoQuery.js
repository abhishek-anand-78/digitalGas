var ConnectionFactory = require('./ConnectionFactory.js');
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
				});
			});
		},
		getBillData: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.aggregate([
						// {$addFields: { "month": {$month: new Date('2018-09-20')}, 'year': {$year: new Date('2018-09-20')}}},
						// {$addFields: { "month": {$month: new Date("$date")}, 'year': {$year: new Date("$date")}}},
						{$addFields: { "month":{$substr: ["$date", 5, 2] }, "year":{$substr: ["$date", 0, 4]}}},
						{$match: { month: query.month, year: query.year, flag: query.flag }}
						// {$match: { month: 9, year: 2018, customerName: 'shgda' }}
					]).toArray(function (err, data) {
						if (err) {
							reject(err);
						}
						console.log(data);
						reslove(data);
					});
				});
			});
		},
		getProfit: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.aggregate([
						{$addFields: { "month": {$month: ISODate("2018-09-20T00:00:00Z")}, 'year': {$year: ISODate("2018-09-20T00:00:00Z")}}},
						{$match: { month: 9, year: 2018}},
						{"$group":{"_id": "$flag", "totalPrice": {"$sum": "$netAmountPayable"},"count": {"$sum": 1}}}
					  ])
					// userCollection.aggregate({
					// 	"$group" : {
					// 		"_id": "$flag",
					// 		"totalPrice": {
					// 			"$sum": "netAmountPayble"
					// 		}
					// 	}
					// }).toArray(function (err, data) {
						.toArray(function (err, data) {
						if (err) {
							reject(err);
						}
						console.log(data)
						reslove(data);
					});
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
				});
			});
		},
	

		getTableData: function (db_name, tableName, returnFullArray) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.find().toArray(function (err, data) {
						//con.close();
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
				});
			});
		},

		// these features will be available in next release
		updateUserRecord: function (db_name, username, data, tableName) {
			return new Promise(function (reslove, reject) {
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.update({ _id: username }, { $set: data }, { upsert: true }, function (err, result) {
						//con.close();
						if (err) {
							reject(err);
						}
						reslove('Y');
					});
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
				});
			});
		}
	};
}();
module.exports = MongoQuery;
