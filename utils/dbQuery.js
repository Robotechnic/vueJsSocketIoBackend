module.exports = async (db,request,args=[],dispError=true) => {
	let conn
	let result
	let err
	try {
		conn = await db.getConnection()
		result = await conn.query(request,args)
	} catch (error) {
		if (dispError)
			console.error(error)
		err = error
	} finally {
		if (conn)
			conn.release()
	}

	return {
		result,
		err
	}
}