import jwt from "jsonwebtoken";

export const generateAccessToken= (user)=>{
    return jwt.sign({
        id:user._id,
        role: user.role,
        email: user.email, // safe to include
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )
}

export const generateRefreshToken = (user) => {
    return jwt.sign({
        userId: user._id,
        role: user.role,    
        email: user.email, // safe to include
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}
