import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useAuth } from "../../hooks/authContext";
import { Flex, useToast } from "@chakra-ui/react";

const style = { layout: "vertical" };

export default function ButtonWrapper({
  currency,
  showSpinner,
  amount,
  email,
  onClose,
  events,
}: any) {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const { user } = useAuth();
  const toast = useToast();
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

     await fetch("/payment/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
  };

  return (
    <Flex overflowY={'scroll'} width={'100%'} justifyContent={'center'}>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={{  
        color: "blue",
        shape: "pill",
        label: "pay",
        tagline: false, 
        layout: "horizontal",
        height:45
      }}
        disabled={amount !== 0 ? false : true}
        onClick={()=>{
          if (amount === 0) {
            toast({
              description: `Select a value other than zero!.`,
              status: "error",
              duration: 4000,
            });
          }
        }}
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
            onClose();;
            handleFundUpdate();
          });
        }}
      />
    </Flex>
  );
}
