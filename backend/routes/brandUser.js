const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const bcrypt = require("bcryptjs");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const dayjs = require('dayjs');
const pdf = require('html-pdf');
const Brand = require("../models/Brand");
const TempBrand = require("../models/BrandTemp");
const Products = require("../models/Products");
const Invoices = require("../models/Invoices");
const multer = require('multer');
const Razorpay = require('razorpay');
const sendMail = require("../utils/sendMail");
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');



const { createToken } = require("../middleware/jwtToken");
const app = express();
app.use(cookieParser());


const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'ap-south-1',
});

const razorpayKey = process.env.RZP_KEY;
const razorpaySecret = process.env.RZP_SECRET;

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



router.post("/signup-brand", async (req, res, next) => {

  try {
    const { email, password, brand } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const pin = generatePin();


    const options = {
      to: email,
      subject: "Verify Account - BroadReach",
      text: `Your 6-digit PIN: ${pin}`,
  }


    const existingUser = await Brand.findOne({ email: lowerCaseEmail });
    const existingUserInTemp = await TempBrand.findOne({ email : lowerCaseEmail});

   
    if (!lowerCaseEmail || !password || !brand) {
      return res.status(400).send({
         error: "All fields are mandatory",
         data: null,
         message: "Please provide all fields",
       });
     }

    else if (existingUser) {
      return res.status(400).send({
        error: "User already exists",
        data: null,
        message: "User already exists with the same email address. Please login to continue.",
      });
    }

    else if(existingUserInTemp){

      existingUserInTemp.password = hashedPassword;
      existingUserInTemp.brand_name = brand;
      existingUserInTemp.reset_pin = pin;
      existingUserInTemp.save();
      await sendMail(options);
     return res.status(200).send({ success: true });

    }

    else{

    await TempBrand.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      brand_name: brand,
      reset_pin : pin
    });
    await sendMail(options);

    return res.status(200).send({ success: true });
  }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
  }
});



router.post("/brand-login", async (req, res, next) => {


  try {
    const { email, password } = req.body;

    if (!email || !password) {
     return res.status(400).send({
        error: "All fields are mandatory",
        data: null,
        message: "Please provide all fields",
      });
    }

    const user = await Brand.findOne({ email }).select("+hashPassword");

    if (!user) {
      return res.status(400).send({
        error: "User does not exists!",
        data: null,
        message: "User does not exists!",
      });
    }

    bcrypt.compare(password, user.password, function (err1, result) {
      if (result === true) {
      createToken(user, res);
      

      } else {
        return res.status(400).send({
          error: "email, password mismatch",
          data: null,
          message: "Wrong Email or Password",
        });
      }

    });
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});

router.post("/check-email-exists-sendMail", async function (req, res) {

  const { email } = req.body;
  const pin = generatePin();

  
  Brand.findOne({ email : email}).then( async (result)=>{

    if(result){

      const options = {
        to: email,
        subject: "Password Reset PIN - BroadReach",
        text: `Your 6-digit PIN: ${pin}`,
    }

    await Brand.findByIdAndUpdate(result._id, { reset_pin: pin });
    await sendMail(options);

    res.status(200).send({ exists : true, emailSent: true});
    res.end();


    }

    else{

      res.status(200).send({ exists: false});
      res.end();


    }

  }).catch((err) =>{

  })


});

router.post("/check-resetPin-withDb-brandTemps", async function (req, res) {

  const { email, pin } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const pinAsInt = parseInt(pin);
  
  TempBrand.findOne({ email : lowerCaseEmail}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

      await Brand.create({
        email: lowerCaseEmail,
        password: result.password,
        brand_name: result.brand_name,
        reset_pin : pin,
        balance : 0,
        purchased_plan : '',
        brand_logo : ''
      });

      await TempBrand.deleteOne({ email: lowerCaseEmail  });


  res.status(200).send({ matching: true, email: email});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

  })

});


router.post("/check-resetPin-withDb", async function (req, res) {

  const { email, pin } = req.body;
  const pinAsInt = parseInt(pin);
  
  Brand.findOne({ email : email}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

  res.status(200).send({ matching: true, email: email});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

  })

});



router.post("/update-password", async function (req, res) {

  const { userId, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  
  Brand.findById(userId).then(async (result)=>{

    if(result){

      await Brand.findByIdAndUpdate(result._id, { password: hashedPassword });
 
  res.status(200).send({ success: true});
  res.end();


    }

    else{

      res.status(200).send({ success: false});
      res.end();


    }

  }).catch((err) =>{

  })

});


//below code is for updating password from profile settings page

router.post("/change-password", async function (req, res) {

  const { userId, password, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  Brand.findById(userId).select("+hashPassword").then((result)=>{

    if(result){

      bcrypt.compare(password, result.password, async function (err1, ress) {
        if (ress === true) {

          console.log('Correct Password');

          await Brand.findByIdAndUpdate(result._id, { password: hashedPassword });
          res.status(200).send({ success: true});
          res.end();
        
  
        } else {
          console.log('Wrong Password');
          return res.status(400).send({
            error: "Wrong current password",
            data: null,
            message: "Wrong current password",
          });
        }
  
      });

    }

    else{

      res.status(200).send({ success: false});
      res.end();


    }

  }).catch((err) =>{

  })

});

router.post('/settings-brand-details', async function (req, res){

  const user_id = req.body.userId;
  Brand.findById(user_id).then((result)=>{
    if(result){
      res.status(200).send({ brandDetails: result});
      res.end();
    }
    else{
      console.log('Fetching Brand Details Error');
    }

  }).catch((e)=>{
    console.log('Error:',e );
  });
});

router.post('/update-brand-logo', upload.single('image'), async function (req, res){

  const user_id = req.body.brand_id;

  const uploadFileAndUpdateBrandLogo = (file, index) => {
    const params = {
      Bucket: 'billsbookbucket', 
      Key: `brandLogos/${Date.now()}_${file.originalname}`, 
      Body: file.buffer,
      ContentType: file.mimetype,
      ServerSideEncryption: 'AES256',
    };
  
    return s3.send(new PutObjectCommand(params))
      .then(() => {
        // Construct and return the S3 URL
        const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

        return Brand.findByIdAndUpdate(user_id, { brand_logo: s3Url })
        .then((updatedBrand) => {
          if (!updatedBrand) {
            return Promise.reject({ error: 'Brand not found' });
          }
          return s3Url;
        });

      })
      .catch((error) => {
        // Handle errors here if needed
        console.error(`Error uploading image ${index + 1} to S3:`, error);
        return Promise.reject(error);
      });
  };

      uploadFileAndUpdateBrandLogo(req.file, user_id)
        .then(() => {
          // File uploaded and brand logo updated successfully
          res.status(200).send({ updated: true });
        })
        .catch((error) => {
          // Handle any errors that occurred during file upload and brand logo update
          console.error('Error uploading file and updating brand logo:', error);
          res.status(500).json({ error: 'Error uploading image and updating brand logo' });
        });

});


router.post('/get-brand-products', async function (req, res){

  const userId = req.body.userId;

  Products.find({'brandUser_id' : userId, 'is_del' : false}).then((result)=>{

    if(result){

    res.status(200).send({ data: result});
    res.end();

    }

    else{
    res.status(200).send({ data: null });
    res.end();

    }

  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post("/add-new-product", async function (req, res) {

  const { brand_id, productName, unitPrice, unitType } = req.body;
  const unitPriceInt = parseInt(unitPrice);
  
  Brand.findById(brand_id).then(async (result)=>{

    if(result){

      await Products.create({
        brandUser_id: brand_id,
        product_name: productName,
        unit_price: unitPriceInt,
        unit_type : unitType
      });


  res.status(200).send({ productAdded: true});
  res.end();

    }

    else{

      res.status(200).send({ productAdded: false});
      res.end();

    }

  }).catch((err) =>{

  })

});

router.post('/delete-product', (req, res) => {
  const { brand_id, product_id } = req.body;


  Products.findByIdAndUpdate(product_id, { is_del: true })
  .then((deletedProduct) => {
    if (deletedProduct) {
      // Campaign was found and deleted
      res.status(200).send({ deleted: true });
    } else {
      // Campaign not found
      res.status(200).send({ deleted: false });
      
    }
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Deleting Product failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });

});

router.post("/create-new-invoice", async function (req, res) {

  const { brand_id, payeeName, payeeMobile, totalAmount, selectedProducts, payeeEmail } = req.body;
  const totalAmountInt = parseInt(totalAmount);
  
  Brand.findById(brand_id).then(async (result)=>{

    if(result){

      const currentDate = dayjs().format('DD-MM-YYYY'); 
      const invoiceNumber = generatePin();
  
      const invoiceHTML = generateInvoice({
        date: currentDate,
        invoiceNumber: invoiceNumber,
        payeeName: payeeName,
        payeeMobile: '+91 '+ payeeMobile,
        companyName: result.brand_name,
        companyAddress: result.address,
        companyGSTIN: result.gstin,
        productDetails: selectedProducts,
        amountToPay : totalAmountInt
      });

      // const outputPath = 'invoice.pdf';
await generatePDF(invoiceHTML, invoiceNumber, brand_id, totalAmountInt, payeeName, payeeMobile, payeeEmail, selectedProducts)
  .then(() => {

      // console.log(`PDF generated successfully at ${outputPath}`);
  })
  .catch((err) => {
      console.error('Error generating PDF:', err);
  });

  res.status(200).send({ invoiceCreated: true});
  res.end();

    }

    else{

      res.status(200).send({ invoiceCreated: false});
      res.end();

    }

  }).catch((err) =>{

  })

});

router.post('/all-invoices', async (req, res) => {

  const user_id = req.body.userId;

  const result = await Invoices.find({ 'brandUser_id': user_id });

  result.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
  
    // Compare dates in descending order
    return dateB - dateA;
  });

  const tableData = await Promise.all(result.map(async (data, index) => {

    return {
      id: index + 1,
      invoiceId: data._id,
      payeeName: data.payee_name,
      payeeMobile: data.payee_mobile_number,
      invoice: data.invoice_pdf_file,
      invoiceAmount: data.invoice_amount,
      paymentStatus: data.is_payment_captured,
      createdDate: data.created_at,
    };
  }));

  res.status(200).send({ data: tableData });
});

router.post('/get-total-transactions', async function (req, res){

  const user_id = req.body.userId;

  Invoices.find({'brandUser_id': user_id, 'is_payment_captured': true}).then((result)=>{

    if(result){
    res.status(200).send({ data: result.length});
    res.end();

    }

    else{
    res.status(200).send({ data: 0});
    res.end();

    }

  }).catch(e2=>{

    console.log('Error2', e2);

  })
});


router.post('/get-total-transactions-amount', async function (req, res){

  const user_id = req.body.userId;
  let totalAmount = 0;

  Invoices.find({'brandUser_id': user_id, 'is_payment_captured': true}).then((result)=>{

    if(result){

      result.map((details =>{

        totalAmount+= details.invoice_amount;

      }))

    res.status(200).send({ data: totalAmount});
    res.end();

    }

    else{
    res.status(200).send({ data: 0});
    res.end();

    }

  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/get-account-balance', async function (req, res){

  const brand_id = req.body.brand_id;

  await Brand.findById(brand_id).then((result)=>{
  
    res.status(200).send({ balance: result.balance});
    res.end();


  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/verifyPayment', async (req, res) => {

  const razorpay_payment_id = req.body.razorpay_payment_id;
  const razorpay_payment_link_id = req.body.razorpay_payment_link_id;
  const razorpay_payment_link_reference_id = req.body.razorpay_payment_link_reference_id;
  const razorpay_payment_link_status = req.body.razorpay_payment_link_status;
  const razorpay_signature = req.body.razorpay_signature;

  const validationResp = validatePaymentVerification({
    "payment_link_id": razorpay_payment_link_id,
    "payment_id": razorpay_payment_id,
    "payment_link_reference_id": razorpay_payment_link_reference_id,
    "payment_link_status": razorpay_payment_link_status,
  }, razorpay_signature , razorpaySecret);


  if(validationResp){

    try {
      const resppp = await Invoices.findOneAndUpdate(
        { payment_link_id: razorpay_payment_link_id },
        { $set: { is_payment_captured: true } },
        { new: true }
      );

      await Brand.findByIdAndUpdate(
        resppp.brandUser_id,
        { $inc: { balance: resppp.invoice_amount } },
        { new: true }
      );

    } catch (error) {
      console.error('Error updating invoice:', error);
    }


  }

  else{

    console.log('else block');
  }

});



function generatePDF(html, invoiceNumber, user_id, totalAmount, payeeName, payeeMobile, payeeEmail, selectedProducts) {

  var instance = new Razorpay({ key_id: process.env.RZP_KEY, key_secret: process.env.RZP_SECRET })

  let paymentLinkId = '';
  let shortUrl = '';

  instance.paymentLink.create({
    amount: totalAmount*100,
    currency: "INR",
    accept_partial: false,
    description: "purchase invoice",
    customer: {
      name: payeeName,
      email: payeeEmail,
      contact: "+91"+payeeMobile
    },
    notify: {
      sms: true,
      email: false
    },
    reminder_enable: true,
    callback_url: "https://www.billsbook.cloud/verifyPayment",
    callback_method: "get"
  }).then((result) => {
    shortUrl = result.short_url;
    paymentLinkId = result.id;

    // Inside the promise callback of instance.paymentLink.create()

    // Now that shortUrl and paymentLinkId are set, proceed with generating PDF and creating invoices
    return new Promise((resolve, reject) => {
      pdf.create(html).toStream((err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        // Prepare the upload parameters
        const params = {
          Bucket: "billsbookbucket",
          Key: `invoices/${Date.now()}_${invoiceNumber}`,
          Body: stream,
          ContentType: 'application/pdf',
          ServerSideEncryption: "AES256",
        };

        s3.send(new PutObjectCommand(params))
          .then(() => {
            // Construct and return the S3 URL
            const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

            // Update the invoice with the S3 URL
            return Invoices.create({
              invoice_number : invoiceNumber,
              brandUser_id: user_id,
              invoice_amount: totalAmount,
              payee_name: payeeName,
              payee_mobile_number : payeeMobile,
              products_details : selectedProducts,
              invoice_pdf_file : s3Url,
              payee_email : payeeEmail ? payeeEmail : '',
              shortUrl : shortUrl,
              payment_link_id : paymentLinkId
            });    
          })
          .then((updatedInvoice) => {
            resolve(updatedInvoice); // Resolve with the updated invoice
          })
          .catch((error) => {
            console.error("Error uploading PDF to S3:", error);
            reject(error); // Reject with the error
          });
      });
    });
  }).catch((error) => {
    console.error("Error creating payment link:", error);
    throw error; // Throw the error to be caught by the caller
  });
}







    function generateInvoice({ date, invoiceNumber, payeeName, payeeMobile, companyName, companyAddress, companyGSTIN, productDetails, amountToPay }) {

      return (
        `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice V1</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">

    <link rel="stylesheet" type="text/css" href="styles.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>

<body>

    <section id="invoice">
        <div class="container my-5 py-5">
            <div class="text-center">
                <img src="images/logo_dark.png" alt="">
            </div>
            <div class="text-center border-top border-bottom my-5 py-3">
                <h2 class="display-5 fw-bold">Invoice </h2>
                <p class="m-0">Invoice No: ${invoiceNumber}</p>
                <p class="m-0">Invoice Date: ${date}</p>
            </div>

            <div class="d-md-flex justify-content-between">
                <div>
                    <p class="text-primary">Invoice To</p>
                    <h4>${payeeName}</h4>
                    <ul class="list-unstyled">
                        <li>${payeeMobile}</li>
                    </ul>
                </div>
                <div class="mt-5 mt-md-0">
                    <p class="text-primary">Invoice From</p>
                    <h4>${companyName}</h4>
                    <ul class="list-unstyled">
                        <li>${companyAddress}</li>
                        <li>${companyGSTIN}</li>
                    </ul>
                </div>
            </div>

            <table class="table border my-5">
                <thead>
                    <tr class="bg-primary-subtle">
                        <th scope="col">S.No</th>
                        <th scope="col">Item</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>

                ${productDetails.map((product, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${product.product_name}</td>
                  <td>${product.quantity}</td>
                  <td>Rs. ${product.unit_price}/${product.unit_type}</td>
                  <td>Rs. ${product.quantity * product.unit_price}</td>
                </tr>
              `).join('')}

                  
                    <tr>
                        <th></th>
                        <td></td>
                        <td></td>
                        <td class="text-primary fw-bold">Grand-Total</td>
                        <td class="text-primary fw-bold">Rs.${amountToPay}</td>
                    </tr>
                </tbody>
            </table>

           
            <div class="text-center my-5">
                <p class="text-muted"><span class="fw-semibold">NOTE: </span> This is computer generated invoice, hence signature is not required.</p>
            </div>

          

        </div>
    </section>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
        crossorigin="anonymous"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>

</body>

</html>
        `
      );
      
  }
    

    




module.exports = router;
