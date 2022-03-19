module.exports = (fields) => {
	return (req, res, next) => {
		const body = req.body
		for (field of fields){
			if (!body[field]) {
				return res.status(422).json({
					error: "required fileds",
					code: "EMPTY_FIELDS",
					errorMessage: `This post route require a ${field} field`
				})
			}
		}
		next()
	}
}