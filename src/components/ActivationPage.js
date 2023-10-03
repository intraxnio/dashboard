// import axios from 'axios';
// import React, {useEffect, useState} from 'react'
// import { useParams } from 'react-router-dom'


// function ActivationPage() {

//     const {activation_token} = useParams();
//     const [error, setError] = useState(false);

//     useEffect(() => {
//         if (activation_token) {
//           const sendRequest = async () => {
//             console.log('UseEffect Started')
//             await axios.post(`http://localhost:8000/api/v1/brand/activation`, {
//                 activation_token,
//               })
//               .then((res) => {
//                 console.log(res);
//               })
//               .catch((err) => {
//                 setError(true);
//               });
//           };
//           sendRequest();
//         }
//       });

   
//   return (
//     <div>
//         {
//             error ? (<p>Your token is expired</p>): (<p>Account has been created</p>) 
//         }
//     </div>
//   )
// }

// export default ActivationPage