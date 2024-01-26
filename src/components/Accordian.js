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
              How linck is different from bitly?
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
                Signup &#8594; Create Campaign &#8594; Send Invites &#8594;
                Publish Campaign &#8594; View Results
              </strong>{" "}
              <br />
              Select creators based on demographics and send bulk invitations.
              Share promotional materials and creator will take care of the
              rest. Sit back and check analytics once collaboration is posted.
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
              How linck works for Creators?
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
                Signup &#8594; Pricing per Post &#8594; Accept Invites &#8594;
                Complete Campaign &#8594; Same Day Payout
              </strong>{" "}
              <br />A very simplest process to earn money ethically for
              Creators. Promote your favourite brand on your Instagram Page and
              receive payment on the same day. Don`t forget to review us
              &#128512;
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
              How payouts to Creators Work ?
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>Payouts:</strong> Once the promotion is posted on the creator`s Instagram Page, our sophisticated algorithms checks & verify the post 
              and the Promotional Payout will be released to the creator`s verified bank Account on the Same Day.
            </div>
          </div>
        </div>

        {/* Accordian-4 */}

        <div className="my-accordion-item my-3 mx-auto">
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
        </div>

        
      </div>
    </>
  );
}
