const dotenv = require('dotenv'); //db 연결
dotenv.config({
  path: './db.env'
});

const mysql = require('mysql'); // mysql 모듈 로드

  var mysqlConfig = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PWD,
	timezone: "Asia/Seoul",
	multipleStatements: true,
	// dateStrings: 'date'
}

exports.conn = mysql.createConnection(mysqlConfig);


// DB연결 실패시 다시 연결(2초)
function handleDisconnect() {
	connection = mysql.createConnection(mysqlConfig);

	connection.connect(function (err) {
		if (err) {
			console.log('error when connecting to db:', err);
			setTimeout(handleDisconnect, 2000);
		}
	});

	connection.on('error', function (err) {
		console.log('db error', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
};

handleDisconnect();