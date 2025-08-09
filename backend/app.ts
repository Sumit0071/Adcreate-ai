import "./config/env"; // Load environment before anything else
import express, { Express, Router } from "express";
import cors from "cors";
import { Request, Response } from "express";
import { checkConnection } from "./config/db";
import userRouter from "./routes/userRoutes";


const app: Express = express();
const port = process.env.PORT || 3000;
const CORS_OPTIONS = {
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 204,// For legacy browser support
    allowHeaders: [
        "Content-Type",
        "Authorization"
    ]
};
const routes: Router = express.Router();
app.use( cors( CORS_OPTIONS ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
checkConnection();
app.get( "/api/health", ( req: Request, res: Response ) => {
    res.status( 200 ).send( "App is running fine" );
} );
app.use( "/api/v1", userRouter );
app.listen( port, () => {
    console.log( `app is listeing to port ${port}` )
} )