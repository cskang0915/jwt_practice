module.exports = ({username, email, password, password2}) => {
	let errors = []

	if(!username){
		errors.push({message: 'no username'})
	}
	if(!email){
		errors.push({message: 'no email'})
	}
	if(!password){
		errors.push({message: 'no password'})
	}
	if(password !== password2){
		errors.push({message: 'passwords do not match'})
	}

	return {
		errors,
		notValid: Boolean(errors.length)
	}
}