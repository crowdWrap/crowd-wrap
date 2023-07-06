import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useAuth } from "../../hooks/authContext";

const style = { layout: "vertical" };

export default function ButtonWrapper({
  currency,
  showSpinner,
  amount,
  email,
  onClose,
  events,
  setStatus,
}: any) {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const { user } = useAuth();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, showSpinner]);

  const handleFundUpdate = async () => {
    const data = JSON.stringify({
      userId: user.id,
      eventId: events.id,
      amountPaid: amount,
    });

    const response: Response = await fetch("/payment/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
  };

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={{ layout: "vertical" }}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data: any, actions: any) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                  payee: {
                    email_address: email,
                  },
                },
              ],
            })
            .then((orderId: any) => {
              //after create the order/start process
              // setStatus("paying")
              return orderId;
            });
        }}
        onApprove={function (data: any, actions: any) {
          return actions.order.capture().then(function () {
            onClose();
            setStatus("amount");
            handleFundUpdate();
          });
        }}
      />
    </>
  );
}
