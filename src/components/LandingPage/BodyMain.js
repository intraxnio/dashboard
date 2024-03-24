import React from "react";
import mainBanner from "../../images/dashimg.jpg"
import { Link } from 'react-router-dom';



function BodyMain() {
  return (
    <>
      <div className="container mx-auto row">
        <div className="container col-md-8 col-lg-8">
          <div className="row txt-1 megaRes">
            Invoicing
          </div>

          <h1 className="row txt-2 mt-1">
           Platform for small businesses.
            
          </h1>

          <h2 className="row txt-4">
           Send invoices online and get paid faster.
          </h2>

        
        </div>
        <div className="col-md-4 col-lg-4 img-1">
          <img
            className="img-fluid rounded"
            src={mainBanner}
            priority={true}
            alt="Passion into Profession"
          />
        </div>

      <div className="col-md-4 col-12 get-started-button-credit-card " >
          <Link to="/login" style={{textDecoration: 'none'}}>
            <button className="btn signup-btn-grad btn-g-fonts" >
              Get Started
            </button>
          </Link>
          <p className="subtext">No credit card required.</p>
      </div>

      </div>





      <div className="container row justify-content-center mt-1 mb-5 pt-4 pb-4 mx-auto">
        <div className="container col-6 col-md-3 col-lg-3 text-center body-tag-styles">
          1.2 M <br />{" "}
          <span className="body-bottom-tag-styles">Short Links</span>
        </div>
        <div className="container col-6 col-md-3 col-lg-3 text-center body-tag-styles">
          {"99.9%"} <br />{" "}
          <span className="body-bottom-tag-styles">Uptime SLA</span>
        </div>
        <div className="container col-6 col-md-3 col-lg-3 text-center body-tag-styles">
          250+ <br />{" "}
          <span className="body-bottom-tag-styles">Brands</span>
        </div>
        <div className="container col-6 col-md-3 col-lg-3 text-center body-tag-styles">
          50 M+ <br />{" "}
          <span className="body-bottom-tag-styles">Clicks</span>
        </div>
      </div>
    </>
  );
}

export default BodyMain;
