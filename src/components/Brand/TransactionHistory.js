import React from 'react';
import ReceiptIcon from '@mui/icons-material/Receipt';








export default function TransactionHistory() {
    




  return (
    <>

<div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh", // Adjust the height as needed
    }}
  >
    <ReceiptIcon style={{ fontSize: '60px', marginBottom: '20px', color: '#5D12D2'}}/>
    <div> Recent transactions will show up here</div>
  </div>

      </>
  );
}