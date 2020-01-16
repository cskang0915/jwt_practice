let express = require('express')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let database = require('./database')
let validate = require('./validation')
let authRequired = require('./authRequired')

require('dotenv').config()

let app = express()

app.use(express.json())

console.log(process.env.JWT_SECRET)

app.get('/', (req, res)=>{
	res.send('hello world')
})


// Create a new user (POST)
app.post('/register', (req, res)=>{
	console.log(req.body)
	const {errors, notValid} = validate(req.body)

	if(notValid){
		return res.status(400).json({status: 400, errors})
	}

	const checkUser = `SELECT * FROM user WHERE user.email = ${req.body.email}`

	database.all(checkUser, (err, checkedUser) => {
		if(checkedUser){
			return res.status(400).json({
				status: 400,
				message: 'email is already registered'
			})
		}

		const createNewUser = `INSERT INTO user VALUES (?, ?, ?)`
		bcrypt.genSalt(10, (err, salt) => {
			if(err){
				return res.status(500).json({
					status: 500,
					message: 'something went wrong. try again'
				})
			}
			bcrypt.hash(req.body.password, salt, (err, hash) => {
				if(err){
					return res.status(500).json({
						status: 500,
						message: 'something went wrong. try again'
					})
				}
				database.run(createNewUser, [req.body.username, req.body.email, hash], (err) => {
					if(err){
						return res.status(500).json({
							status: 500,
							err
						})
					}else{
						res.status(201).json({
							status: 201,
							message: 'success'
						})
					}
				})
			})
		})
	})
	// const newUserValues = [...Object.values(req.body)]
})

// Login (POST)
app.post('/login', (req, res) => {
	if(!req.body.email || !req.body.password){
		return res.status(400).json({
			status: 400,
			message: "enter email and password"
		})
	}

	const checkUser = `SELECT *, oid FROM user WHERE user.email = ?`

	console.log(req.body)
	database.all(checkUser, [req.body.email], (err, checkedUser) => {
		if(err){
			return res.status(500).json({
				status: 500,
				message: 'something went wrong. try again'
			})
		}else if(!checkedUser){
			return res.status(400).json({
				status: 400,
				message: 'email or password is incorrect'
			})
		}else{
			console.log(checkedUser)
			bcrypt.compare(req.body.password, checkedUser[0].password, (err, isMatch) => {
				if(err){
					console.log(req.body.password)
					console.log(checkedUser)
					console.log(err)
					return res.status(500).json({
						status: 500,
						message: 'something went wrong. try again'
					})
				}else if(!isMatch){
					return res.status(400).json({
						status: 400,
						message: 'something went wrong. try again'
					})
				}else if(isMatch){
					let user = {
						id: checkedUser[0].rowid
					}

					jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "1hr"}, (err, signedJwt) => {
						if (err){
							return res.status(500).json({
								status:500,
								message: 'something went wrong. try again'
							})
						}
						console.log(checkedUser[0].rowid)
						return res.status(200).json({
							status: 200,
							message: 'success',
							id: checkedUser[0].rowid,
							signedJwt
						})
					})
				}
			})
		}
	})
})

// Create new info based on user (POST)
app.post('/newinfo', authRequired, (req, res) => {
	const insertNewInfo = `INSERT INTO info VALUES (?, ?, ?, ?)`

	database.run(insertNewInfo, [req.userId, req.body.name, req.body.age, req.body.hasChildren], (err) => {
		if(err){
			console.log(err)
			return res.status(500).json({
				status: 500,
				message: 'something went wrong. try again'
			})
		}else{
			return res.status(200).json({
				status: 200,
				message: 'added new info'
			})
		}
	})
})

// Get all info based on user (GET)
app.get('/get/all', authRequired, (req, res) => {
	const getAllInfo = `SELECT * FROM info WHERE info.user_id = ${req.userId}`
	database.all(getAllInfo, (err, info) => {
		if(err){
			return res.status(500).json({
				status: 500,
				message: 'something went wrong. try again'
			})
		}else{
			return res.status(200).json(info)
		}
	})
})

// Get all info based on user and another condition (GET)
app.get('/get/:id', authRequired, (req, res) => {
	const getOneInfo = `SELECT * FROM info WHERE info.user_id = ${req.userId} AND info.age = ${req.params.id}`
	database.all(getOneInfo, (err, info) => {
		if(err){
			return res.status(500).json({
				status: 500,
				message: 'something went wrong. try again'
			})
		}else{
			return res.status(200).json(info)
		}
	})
})

// Delete info based on user and another condition (DELETE)
app.delete('/delete/:id', authRequired, (req, res) => {
	const deleteOneInfo = `DELETE FROM info WHERE info.user_id = ${req.userId} AND info.age = ${req.params.id}`
	database.run(deleteOneInfo, (err) => {
		if(err){
			return res.status(500).json({
				status: 500,
				message: 'something went wrong'
			})
		}else{
			return res.status(200).json({
				status: 200,
				message: 'deleted info'
			})
		}
	})
})

app.listen(9000, ()=>{
	console.log('listening on port 9000')
})