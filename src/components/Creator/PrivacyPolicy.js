import React from "react";
import { Typography, Button} from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from "react-router-dom";



function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <>
   <Button startIcon={<KeyboardBackspaceIcon />} onClick={()=> {navigate('/creator/profile')}}>Back</Button>

      <Typography>
        Privacy Policy Last updated on Sep 18th 2023 This privacy policy sets
        out how ROOTCARES ESSENTIALS PRIVATE LIMITED uses and protects any
        information that you give ROOTCARES ESSENTIALS PRIVATE LIMITED when you
        use this website. ROOTCARES ESSENTIALS PRIVATE LIMITED is committed to
        ensuring that your privacy is protected. Should we ask you to provide
        certain information by which you can be identified when using this
        website, and then you can be assured that it will only be used in
        accordance with this privacy statement. <br />
        ROOTCARES ESSENTIALS PRIVATE LIMITED may change this policy from time to time by updating this page.
        You should check this page from time to time to ensure that you are
        happy with any changes. We may collect the following information: Name
        and job title Contact information including email address Demographic
        information such as postcode, preferences and interests Other
        information relevant to customer surveys and/or offers What we do with
        the information we gather We require this information to understand your
        needs and provide you with a better service, and in particular for the
        following reasons: Internal record keeping. We may use the information
        to improve our products and services. <br />
        We may periodically send
        promotional emails about new products, special offers or other
        information which we think you may find interesting using the email
        address which you have provided. From time to time, we may also use your
        information to contact you for market research purposes. We may contact
        you by email, phone, fax or mail. We may use the information to
        customise the website according to your interests. We are committed to
        ensuring that your information is secure. In order to prevent
        unauthorised access or disclosure we have put in suitable measures. How
        we use cookies A cookie is a small file which asks permission to be
        placed on your computer`s hard drive. Once you agree, the file is added
        and the cookie helps analyses web traffic or lets you know when you
        visit a particular site. Cookies allow web applications to respond to
        you as an individual. The web application can tailor its operations to
        your needs, likes and dislikes by gathering and remembering information
        about your preferences. We use traffic log cookies to identify which
        pages are being used. This helps us analyses data about webpage traffic
        and improve our website in order to tailor it to customer needs. We only
        use this information for statistical analysis purposes and then the data
        is removed from the system. Overall, cookies help us provide you with a
        better website, by enabling us to monitor which pages you find useful
        and which you do not. A cookie in no way gives us access to your
        computer or any information about you, other than the data you choose to
        share with us.
      </Typography>
    </>
  );
}

export default PrivacyPolicy;
