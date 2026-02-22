"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { usePayment } from "@repo/payments";
import { notify } from "@repo/notifications";
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, loading, error } = usePayment();

  const [amount, setAmount] = useState("10");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const clientSecret = await createPaymentIntent({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        description: "Test payment",
      });

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        notify.success("Payment successful!");
        cardElement.clear();
        setAmount("10");
      }
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (USD)</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="10.00"
        />
      </div>

      <div className="space-y-2">
        <Label>Card Details</Label>
        <div className="rounded-md border border-input p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#0a0a0a",
                  "::placeholder": {
                    color: "#737373",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        disabled={!stripe || loading || processing}
        className="w-full"
      >
        {processing ? "Processing..." : `Pay $${amount}`}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Use test card: 4242 4242 4242 4242, any future date, any CVC
      </p>
    </form>
  );
}

export default function BillingPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your payments and subscriptions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Make a Payment</CardTitle>
          <CardDescription>
            Test the Stripe integration with a test payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
