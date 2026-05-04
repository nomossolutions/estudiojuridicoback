import jwt from "jsonwebtoken"

const generarJWT = (id, email, role) =>{
try{
const payload = {id, email, role}
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