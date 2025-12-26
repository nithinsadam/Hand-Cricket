async function sessionAuth(req,res,next){
    const sessionToken = req.cookies.sessionToken
    if(sessionToken === undefined) res.isAuth = false
    else {
        const user = await this.db.getByToken(sessionToken)
        if(user) {
            req.isAuth = true
            req.username = user.username
        }
        else req.isAuth = false
    }
    next()
}

function authenticator(db){
    this.db = db
    this.sessionAuth = sessionAuth.bind(this)
}

export default authenticator;