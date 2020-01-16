let sqlite3 = require('sqlite3')

let database = new sqlite3.Database('./database.db')

module.exports = database