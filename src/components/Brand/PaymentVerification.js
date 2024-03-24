import React, { useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';




function PaymentVerification() {

  const navigate = useNavigate();
  const location = useLocation();
  // const baseUrl = "http://localhost:8000/api";

  const fetchData = async (razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id,
    razorpay_payment_link_status, razorpay_signature) => {
    try {

      await axios.post("/api/brand/verifyPayment",
        {
            razorpay_payment_id : razorpay_payment_id,
            razorpay_payment_link_id : razorpay_payment_link_id,
            razorpay_payment_link_reference_id : razorpay_payment_link_reference_id,
            razorpay_payment_link_status : razorpay_payment_link_status,
            razorpay_signature : razorpay_signature
        }
      );

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const razorpay_payment_id = queryParams.get('razorpay_payment_id');
    const razorpay_payment_link_id = queryParams.get('razorpay_payment_link_id');
    const razorpay_payment_link_reference_id = queryParams.get('razorpay_payment_link_reference_id');
    const razorpay_payment_link_status = queryParams.get('razorpay_payment_link_status');
    const razorpay_signature = queryParams.get('razorpay_signature');

    fetchData(razorpay_payment_id,
        razorpay_payment_link_id,
        razorpay_payment_link_reference_id,
        razorpay_payment_link_status,
        razorpay_signature);
   
  }, [location.search]);

  return (
    <div>PaymentVerification</div>
  )
}

export default PaymentVerification