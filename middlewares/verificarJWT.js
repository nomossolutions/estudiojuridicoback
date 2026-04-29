import jwt from "jsonwebtoken"

const verficarJWT = (req, res, next) =>{
    try{
        const token = req.headers["x-token"];
        if(!token){
            return res.status(401).json({message:"No se envio un token"})
        }
        const payload = jwt.verify(token, process.env.SECRET_JWT);
        req.email = payload.email;
        req.role = payload.role;
        
        next();
    }catch(error){
        console.error(error);
        res.status(401).json({message:"Error al verificar el token"})
    }
}

export default verficarJWT;