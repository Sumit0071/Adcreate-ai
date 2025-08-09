import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const authMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized: Token not provided or invalid format",
                success: false,
            });
        }

        const token = authHeader.split(" ")[1];
        const decode = jwt.verify( token, process.env.JWT_SECRET as string ) as { id: string };
        if ( !decode ) {
            return res.status( 401 ).json( {
                message: 'Unauthorized:token is not valid',
                success: false
            } );
        }
        (req as any).id = decode.id;
        next();
    }
    catch ( error ) {
        console.log( "first error in auth middleware", error );
        return res.status( 500 ).json( {
            message: 'Internal server error',
            success: false
        } );
    }
}

export default authMiddleware;