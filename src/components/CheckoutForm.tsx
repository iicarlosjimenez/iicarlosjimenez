import { StripePaymentElementOptions } from "@stripe/stripe-js";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import Form from "next/form";

const CheckoutForm = ({ beerCount, setBeerCount }) => {
  const { t } = useTranslation("common");
  let listMessages: string[] = [];

  // Datos para realizar el pago
  const stripe = useStripe();
  const elements = useElements();

  const [messages, setMessages] = useState(listMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    listMessages = [];

    if (!stripe || !elements) {
      listMessages.push("Error: Falló método de pago.");
      listMessages.push("Intente más tarde.");
      setMessages(listMessages);
      return;
    }

    setIsLoading(true);
    listMessages.push("Esperando...");
    setMessages(listMessages);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "/success",
        },
      });

      if (error) {
        setMessages([`Error: ${error.message}`]);
        return;
      }
      console.log(`${t("buymeabeer.buy-beers")}!! 🍻`, beerCount);
      setMessages([]);
    } catch (error) {
      setMessages([`Error. Favor de ponerse en contacto con soporte técnico.`]);

      return;
    } finally {
      setIsLoading(false);
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "accordion",
    wallets: {
      applePay: "auto",
      googlePay: "auto",
      link: "never",
    },
  };

  return (
    <Form
      action={handleSubmit}
      className="flex flex-col gap-4 rounded-xl px-4 md:px-6 py-5 md:py-7 font-comfortaa bg-black text-white dark:bg-white dark:text-black"
    >
      <h1 className="flex flex-row justify-center items-center text-4xl font-bold">
        <span className="text-6xl">🍻</span>

        <div className="flex gap-2 px-5 py-2 font-bold justify-between items-center text-3xl">
          <span>$</span>
          <input
            className="w-16 border-b focus:outline-none"
            type="number"
            step="1"
            min="2"
            value={beerCount}
            onChange={(e) => setBeerCount(Math.round(Number(e.target.value)))}
          ></input>
          <span>USD</span>
        </div>
      </h1>

      <PaymentElement id="payment-element" options={paymentElementOptions} />

      {/* Call to action */}
      <div className="flex flex-col">
        <button
          type="submit"
          className="flex gap-4 px-5 py-2 text-3xl font-bold justify-center items-center rounded-4xl border hover:scale-105 bg-white text-black dark:bg-black dark:text-white"
          disabled={isLoading || !stripe || !elements}
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              `${t("buymeabeer.buy-beers")} 🍻`
            )}
          </span>
        </button>
      </div>

      {messages && messages.length > 0 && (
        <ul className="list-disc list-inside text-red-500 text-sm my-4">
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}
    </Form>
  );
};

export default CheckoutForm;
