import React, { useState } from "react";
import ButtonPayment from "./ButtonPayment";

const PaymentMethod = ({ info, errorInput }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  console.log("ten:", info.name);
  const order = {
    name: info.name,
    status: "Đang Chuẩn Bị",
    status_Payment: "Thanh Toán Khi Nhận Hàng",
    sdt: info.sdt,
    address: info.address,
    total_price: info.total_price,
    userId: info.userId,
  };

  return (
    <>
      <div className="">
        <h5 className="mb-4 text-center">Select Payment Method</h5>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="creditCard"
            value="0"
            onChange={() => handlePaymentMethodSelect("00")}
          />
          <label className="form-check-label" htmlFor="creditCard">
            Thanh Toán Khi Nhận Hàng
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="paypal"
            value="1"
            onChange={() => handlePaymentMethodSelect("1")}
          />
          <label className="form-check-label" htmlFor="paypal">
            Thanh Toán Qua VNPAY
          </label>
        </div>
        {paymentMethod && (
          <ButtonPayment
            paymentMethod={paymentMethod}
            order={order}
            errorInput={errorInput}
          />
        )}
      </div>
    </>
  );
};

export default PaymentMethod;
