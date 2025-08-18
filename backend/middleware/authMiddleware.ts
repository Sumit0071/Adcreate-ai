import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const authMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const token = req.cookies.token;  
        if ( !token ) {
            return res.status( 401 ).json( {
                message: "Unauthorized: Token not provided",
                success: false,
            } );
        }
        const decode = jwt.verify( token, process.env.JWT_SECRET as string ) as { id: string };
        if ( !decode ) {
            return res.status( 401 ).json( {
                message: 'Unauthorized:token is not valid',
                success: false
            } );
        }
        ( req as any ).id = decode.id;
        next();
    }
    catch ( error ) {
        console.log( "first error in auth middleware", error );
        if ( error instanceof jwt.JsonWebTokenError ) {
            return res.status( 401 ).json( {
                message: "Unauthorized: Invalid or expired token",
                success: false,
            } );
        }
    }
}

export default authMiddleware;