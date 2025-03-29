import React, { useEffect, useState } from 'react';

const CashfreePayment = ({ orderDetails }) => {
    const [paymentStatus, setPaymentStatus] = useState('pending');

    useEffect(() => {
        const initializePayment = async () => {
            try {
                if (typeof window !== 'undefined') {
                    const script = document.createElement('script');
                    script.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js';
                    script.async = true;
                    script.onload = () => {
                        if (window.Cashfree) {
                            const cashfree = new window.Cashfree({
                                mode: "sandbox"
                            });
                            
                            const paymentOptions = {
                                appId: process.env.REACT_APP_CASHFREE_APP_ID,
                                orderToken: orderDetails?.token,
                                onSuccess: (data) => {
                                    setPaymentStatus('success');
                                    console.log("Payment success:", data);
                                },
                                onFailure: (data) => {
                                    setPaymentStatus('failed');
                                    console.log("Payment failure:", data);
                                },
                                components: {
                                    card: {
                                        instrument: {
                                            card_number: "",
                                            card_holder_name: "",
                                            card_expiry_mm: "",
                                            card_expiry_yy: "",
                                            card_cvv: "",
                                        }
                                    }
                                }
                            };
                            
                            cashfree.checkout(paymentOptions);
                        }
                    };
                    document.body.appendChild(script);
                }
            } catch (error) {
                console.error("Payment initialization error:", error);
                setPaymentStatus('error');
            }
        };

        if (orderDetails?.token) {
            initializePayment();
        }
        
        return () => {
            const scriptElement = document.querySelector('script[src="https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js"]');
            if (scriptElement) {
                document.body.removeChild(scriptElement);
            }
        };
    }, [orderDetails]);

    return (
        <div className="payment-container">
            <h2>Payment Processing</h2>
            <div className="payment-status">
                {paymentStatus === 'pending' && <p>Initializing payment gateway...</p>}
                {paymentStatus === 'success' && <p>Payment successful!</p>}
                {paymentStatus === 'failed' && <p>Payment failed. Please try again.</p>}
                {paymentStatus === 'error' && <p>Error loading payment gateway. Please try again later.</p>}
            </div>
        </div>
    );
};

export default CashfreePayment;
