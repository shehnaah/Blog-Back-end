const isTokenIncluded =(req) => {
   
    return (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    )

}

const getAccessTokenFromHeader = (req) => {
    if (!req.headers.authorization) return null;
    return req.headers.authorization.split(" ")[1];
};

const sendToken = (user,statusCode ,res)=>{

    const token = user.generateJwtFromUser()

    return res.status(statusCode).json({
        success: true ,
        token
    })

}

module.exports ={
    sendToken,
    isTokenIncluded,
    getAccessTokenFromHeader
}
