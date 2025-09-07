"use client";

import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY); // TODO: Pasar a environments

const Checkout = () => {
  const appearance: Appearance = {
    theme: "stripe",
  };
  const [clientSecret, setClientSecret] = useState()
  const [amount, setAmount] = useState(2)
  
 useEffect(() => {
   const timeout = setTimeout(() => {
     fetch("/api/create-payment-intent", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ amount: amount * 100 }),
     })
       .then((res) => res.json())
       .then((data) => setClientSecret(data.clientSecret));
   }, 400);

   return () => clearTimeout(timeout);
 }, [amount]);

  if (!clientSecret)
    return <></>

  return (
    <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
      <CheckoutForm beerCount={amount} setBeerCount={setAmount} />
    </Elements>
  );
};

export default Checkout;
