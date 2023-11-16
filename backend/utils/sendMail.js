const nodemailer = require("nodemailer");




const sendMail = async (options) =>{

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "techiebhaskar7@gmail.com",
          pass: "hhefwxgljgawbsck",
        },
      });

    const mailOptions = {
        from: 'techiebhaskar7@gmail.com',
        to: options.to,
        subject: options.subject,
        text: options.text,

    };
    await transporter.sendMail(mailOptions);

}

module.exports = sendMail;