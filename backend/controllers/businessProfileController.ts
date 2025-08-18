import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const addBusinessDetails = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const { businessName, niche, productService, targetAudience, adGoal } = req.body;

        const businessDetails = await prisma.businessProfile.create( {
            data: {
                businessName,
                niche,
                productService,
                targetAudience,
                adGoal,
                user: {
                    connect: { id: req.body.userId } // Make sure req.body.userId is provided and valid
                }
            }
        } );
        res.status( 201 ).json( {
            message: "Business details created successfully",
            success: true,
            businessDetails
        } );
    }
    catch ( error ) {
        console.error( "Error creating business details:", error );
        res.status( 500 ).json( {
            error: "Internal server error",
            sucess: false
        } );
    }
}

export const updateBusinessDetails = async ( req: Request, res: Response ) => {
    try {
        const { businessName, niche, productService, targetAudience, adGoal } = req.body;
        const { id } = req.params;

        const businessDetails = await prisma.businessProfile.update( {
            where: { id: Number( id ) },
            data: {
                businessName,
                niche,
                productService,
                targetAudience,
                adGoal
            }
        } );

        res.status( 200 ).json( {
            message: "Business details updated successfully",
            success: true,
            businessDetails
        } );
    }
    catch ( error ) {
        console.error( "Error updating business details:", error );
        res.status( 500 ).json( {
            error: "Internal server error",
            success: false
        } );
    }
}