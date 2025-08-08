import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const authMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const token = req.headers.authorization?.split( ' ' )[1];
        if ( !token ) {
            return res.status( 401 ).json( {
                message: 'Unauthorized:user is not defined',
                success: false
            } );

        }
        const decode = jwt.verify( token, process.env.JWT_SECRET as string );
        if ( !decode ) {
            return res.status( 401 ).json( {
                message: 'Unauthorized:token is not valid',
                success: false
            } );
        }
        // req.id = decode.userId;
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