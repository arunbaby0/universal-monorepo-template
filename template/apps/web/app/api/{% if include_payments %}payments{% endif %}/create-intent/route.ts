import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@repo/api/stripe";
import { auth } from "@repo/api/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description } = body;

    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Amount must be at least $1.00 (100 cents)" },
        { status: 400 }
      );
    }

    const paymentIntent = await createPaymentIntent(amount, description, {
      userId: String(session.user.id),
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
