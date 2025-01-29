import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
  "Access-Control-Max-Age": "86400",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { productIds, amount, customerDetails } = await req.json();
    const { storeId } = await params;
    console.log(customerDetails);

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "Product IDs are required" },
        { status: 400 }
      );
    }

    // Fetch products from database
    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        storeId: storeId,
      },
    });

    // Verify all products exist
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products not found" },
        { status: 400 }
      );
    }

    // create a new order in the database
    const order = await prismadb.order.create({
      data: {
        storeId: storeId,
        phone: customerDetails.phone,
        address: customerDetails.address,
        orderItems: {
          create: productIds.map((productId) => ({
            productId: productId,
          })),
        },
        isPaid: false,
      },
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `order_receipt_${Math.random().toString(36).substring(2, 15)}`,
    });

    return NextResponse.json(
      {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("[CREATE_ORDER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}
