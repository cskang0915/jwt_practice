const db = require('./database')

db.serialize(()=>{
	const dropTableUser = `DROP TABLE user`
	const dropTableInfo = `DROP TABLE info`
	const createTableUser = `CREATE TABLE IF NOT EXISTS user (username TEXT UNIQUE, email TEXT UNIQUE, password TEXT)`
	const createTableInfo = `CREATE TABLE IF NOT EXISTS info (user_id INTEGER, name TEXT, age INTEGER, hasChildren INTEGER)`

	db.run(dropTableUser, (err)=>{
		if(err){
			console.log('failed to drop user table')
		}else{
			console.log('dropped user table')
		}
	})
	db.run(dropTableInfo, (err)=>{
		if(err){
			console.log('failed to drop info table')
		}else{
			console.log('dropped info table')
		}
	})

	db.run(createTableUser, (err)=>{
		if(err){
			console.log('failed to create user table')
		}else{
			console.log('created user table')
		}
	})
	db.run(createTableInfo, (err)=>{
		if(err){
			console.log('failed to create info table')
		}else{
			console.log('created info table')
		}
	})
})