import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const style = { layout: "vertical" };

export default function ButtonWrapper({
  currency,
  showSpinner,
  amount,
  email,
  setStatus,
}: any) {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

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
              return orderId;
            });
        }}
        onApprove={function (data: any, actions: any) {
          return actions.order.capture().then(function () {
            setStatus("paid");
            //after order is paid/complete
          });
        }}
      />
    </>
  );
}
