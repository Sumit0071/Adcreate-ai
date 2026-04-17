import Razorpay from "razorpay";
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { Plan, PaymentStatus } from "@prisma/client";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY_ID as string,
  key_secret: process.env.RAZORPAY_API_KEY_SECRET as string,
});

export const paymentCheckOut = async (req: Request, res: Response) => {
  try {
    const { amount, plan } = req.body;
    const userId = (req as any).id;

    // validation
    if (!amount || !plan) {
      return res.status(400).json({
        success: false,
        message: "Amount and plan are required",
      });
    }

    if (!Object.values(Plan).includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type",
      });
    }

    const receipt = `receipt_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "USD",
      receipt,
    });

    // Save payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount,
        plan: plan as Plan,
        userId,
        receipt,
        status: PaymentStatus.PENDING,
      },
    });

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Payment Checkout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment order creation failed",
    });
  }
};