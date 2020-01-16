const jwt = require('jsonwebtoken')

require('dotenv').config()
 
module.exports = (req, res, next) => {
	const bearerHeader = req.headers["authorization"]

	if(typeof bearerHeader !== 'undefined'){
		console.log(bearerHeader)
		const bearer = bearerHeader.split(' ')
		console.log(bearer)
		const bearerToken = bearer[1]
		console.log(bearerToken)
		// req.token = bearerToken

		let verified = jwt.verify(bearerToken, process.env.JWT_SECRET)
		console.log(verified)

		req.userId = verified.id

		next()
	}else{
		return res.status(403).json({
			status: 403,
			message: 'requires permissions'
		})
	}
}