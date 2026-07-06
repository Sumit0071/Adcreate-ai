import crypto from "crypto";
import { Request, Response } from "express";
import prisma from "../config/prisma";
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_KEY_SECRET as string)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { orderId: razorpay_order_id },
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // update payment
    await prisma.payment.update({
      where: { orderId: razorpay_order_id },
      data: {
        paymentId: razorpay_payment_id,
        status: "SUCCESS",
      },
    });

    // Activate user plan
    await prisma.user.update({
      where: { id: payment.userId },
      data: {
        plan: payment.plan,
      },
    });

    res.json({
      success: true,
      message: "Payment verified and plan activated",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
