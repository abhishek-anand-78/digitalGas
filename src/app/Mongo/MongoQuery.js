var ConnectionFactory = require('./ConnectionFactory.js')
var MongoQuery = function () {
	return {
		getAllUserData: function (db_name, query, tableName) {
			return new Promise(function (reslove, reject) {
				console.log("HI");
				new ConnectionFactory().getConnection().then(function (con) {
					var collentionAccessor = con.db(db_name);
					let userCollection = collentionAccessor.collection(tableName);
					userCollection.find().toArray(function (err, data) {
						console.log("Hello");
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
