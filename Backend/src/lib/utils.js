import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    // Generate a JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie("jwt", token, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV !== 'development', // Set secure flag in production
        sameSite: 'Strict',// CSRF attacks cross-stite request forgery atacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return token;
}

