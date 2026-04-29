import jwt from "jsonwebtoken"

const generarJWT = (email, role) =>{
try{
const payload = {email, role}
const token = jwt.sign(payload, process.env.SECRET_JWT, {
    expiresIn: "3h"
});
return token;
}catch(error){
console.error(error);
throw new Error ("Error al general el token")
}
}

export default generarJWT;