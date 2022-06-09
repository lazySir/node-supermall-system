const mysql = require('mysql')

const db=mysql.createPool({
host:'localhost',//要连接到的数据库的主机名。（默认值：localhost)
port:'3306',//要连接到的端口号。（默认值：3306)
user:'root',
password:'',
database:'shop'
})

module.exports=db