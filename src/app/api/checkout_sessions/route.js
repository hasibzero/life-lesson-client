import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "../../../lib/stripe";

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const body = await req.json();
    const { email, userId } = body;
    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1U615hI81ZX3DZN9tiMwBhBe",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email || undefined,

      // 3. Attach metadata to link with your database
      metadata: {
        userId: userId || "",
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Return the URL as JSON for the onClick handler
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
