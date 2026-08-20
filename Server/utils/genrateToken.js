
import jwt from ('jsonwebtoken')

const GenerateToken =  (userId , role) =>{
    return jwt.sign({id: userId,role}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN || "7d",
    });
};

export default GenerateToken;

