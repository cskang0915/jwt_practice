const jwt = require('jsonwebtoken')

require('dotenv').config()
 
module.exports = (req, res, next) => {
	const bearerHeader = req.headers["authorization"]

	if(typeof bearerHeader !== 'undefined'){
		const bearer = bearerHeader.split(' ')
		const bearerToken = bearer[1]
		// req.token = bearerToken

		let verified = jwt.verify(bearerToken, /*process.env.JWT_SECRET*/ 'testing')

		req.userId = verified.id

		next()
	}else{
		return res.status(403).json({
			status: 403,
			message: 'requires permissions'
		})
	}
}