import React from "react";

export default function Accordian() {
  return (
    <>
      <div className="accordion pb-5 mt-5 " id="accordionExample">
        <div className="display-5 text-center mb-5">FAQ</div>

        {/* Accordian-1 */}
        <div className="my-accordion-item my-3 mx-auto">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button "
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              How BillsBook works?
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>
                Create Invoice &#8594; Buyer &#8594;
                Payment Success &#8594; Payment Settlement
              </strong>{" "}
              <br />
              When an invoice is created, a payment link is automatically sent to the buyer's mobile number. 
              Upon successful payment by the buyer, funds will be processed into your (the payee's) bank 
              account within T+1 days.
            </div>
          </div>
        </div>

        {/* Accordian-2 */}
        <div className="my-accordion-item my-3 mx-auto">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              What is the process to get onboarded?
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>
                Signup &#8594; Business Verification &#8594;
                KYC &#8594; Oboarded
              </strong>{" "}
              <br />We follow RBI, GST & Payment Gateway guidelines in onboarding a business for payments & e-invoices.
              It would not take more than 24 Hrs (with all required documents).
            </div>
          </div>
        </div>

        {/* Accordian-3 */}
        <div className="my-accordion-item my-3 mx-auto">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              What are the documents required ?
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>Mandatory Documents: </strong>
               1. Business Details 2. Proprietor/Director's PAN, AADHAR 3. GSTIN 4. Company Bank Account (CURRENT), 5. Labour License/Certificate of Incorporation 6. Company/Business Stamp
            7. One Cancelled Cheque</div>
          </div>
        </div>

        {/* Accordian-4 */}

        {/* <div className="my-accordion-item my-3 mx-auto">
          <h2 className="accordion-header" id="headingFour">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              How we verify Brands & Creators ?
            </button>
          </h2>
          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            aria-labelledby="headingFour"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>Creators:</strong> Every creator on our platform signups with Instagram Account. Automatically, we 
              pull out the Page Metrics, Creator Information directly from Instagram. No manual data insertion is available.

              <br /> <strong>Brands:</strong> Brands signups with official mail IDs and we follow certain verification process 
              before onboarding a Brand.
            </div>
          </div>
        </div> */}

        
      </div>
    </>
  );
}
