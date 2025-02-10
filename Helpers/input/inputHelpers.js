const bycrptjs = require("bcryptjs")

const validateUserInput =(email,password) =>{

    return(
        email && password
    )

}

const comparePassword =  (password , hashedPassword) =>{

    return  bycrptjs.compareSync(password,hashedPassword)

}

module.exports ={
    validateUserInput,
    comparePassword
}