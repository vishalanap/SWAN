const mysql = require('mysql')
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Vishal@123',
    database : 'taxi_management_system',
    multipleStatements: true
})
//const connection = mysql.createConnection({
//    host : 'localhost',
//    user : 'root',
//    password : 'Mdcoep@123',
//    database : 'taxi_management_system',
//    multipleStatements: true
//})
connection.connect(e => {
    if(e){
        console.log(e)
    }
    else{
        console.log('Connected to MySQL Client')
    }
})

module.exports = connection