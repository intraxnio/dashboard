import React from 'react'
import banner1 from "../../images/banner1.jpg"
import banner2 from "../../images/banner2.jpg"
import banner3 from "../../images/banner3.jpg"
import banner4 from "../../images/banner4.jpg"
import banner5 from "../../images/banner5.jpg"
import banner6 from "../../images/banner6.jpg"
import banksett from "../../images/banksett.jpg"
import { Link } from 'react-router-dom';





function BodyBlocks() {
  return (
    <>

    <div className="container">

        <div className="row mx-auto">
            <div className="col-12 col-md-6 col-lg-6 my-auto">
                <div className="row creator-underline txt-bold"><p>Easy Invoicing</p></div>
                <div className="row bb-txt-2"><p>Amaze your clients with polished invoices showcasing your
                    <span className="span-70"> goods/services </span>and pricing details.</p></div>
                {/* <div className="row bb-txt-3"><p><span className="check-1"></span>Trigger retargeting pixels directly from your links.</p></div> */}

                <div className="row-center bb-txt-3">
                    <span className="right-arrow-1"></span>
                    <p className= "my-auto">Add products or services in-detail to every invoice.</p>
                </div>

                <div className="row-center bb-txt-4 mt-4">
                    <span className="right-arrow-2"></span>
                    <p className= "my-auto">Generate invoice in<span className="span-70"> PDF</span> format automatically.</p>
                </div>


                <div className="row-center bb-txt-5 mt-4">
                    <span className="right-arrow-3"></span>
                    <p className= "my-auto">Every invoice is GST compliant.</p>
                </div>


            </div>

            <div className="col-12 col-md-6 col-lg-6">
                <img className="img-fluid rounded" src={banner1} alt="banner" width={500} height={500} />
            </div>
        </div>
    </div>

     <div className="container mt-3">
        <div className="row mx-auto">

        <div className="col-12 col-md-6 col-lg-6 order-2 order-md-0 order-lg-0">
       <img className="img-fluid rounded" src={banner3} alt="Business Growth" width={500} height={500} />

        </div>


            <div className="col-12 col-md-6 col-lg-6 my-auto">
                <div className="row creator-underline txt-bold"><p>Accept Payments</p></div>
                <div className="row bb-txt-2"><p>Get real time <span className="span-70">payment status </span>of every invoice generated and sent to buyers.</p></div>


                <div className="row-center bb-txt-3">
                  <span className="just-arrow-1">&#8594;</span>
                    <p className= "my-auto">Payment link will be sent to the buyers's mobile.</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-2">&#8594;</span>
                    <p className= "my-auto">Downloadable Invoice will reach buyers's email.</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-3">&#8594;</span>
                    <p className= "my-auto">Timely reminders prompts timely payments.</p>
                </div>


            </div>


        </div>
    </div>


<div className="container mt-3">

<div className="row mx-auto">
    <div className="col-12 col-md-6 col-lg-6 my-auto">
        <div className="row creator-underline txt-bold"><p>Small Businesses</p></div>
        <div className="row bb-txt-2"><p>A niche-specific platform catering to various types of
            <span className="span-70"> startups and small businesses</span>.</p></div>

        <div className="row-center bb-txt-3">
            <span className="dot-1"></span>
            <p className= "my-auto">Seamlessly generate unlimited invoices every month.</p>
        </div>

        <div className="row-center bb-txt-4 mt-4">
            <span className="dot-2"></span>
            <p className= "my-auto">For <span className="span-70">freelancers, business contractors &</span> list goes on.</p>
        </div>


        <div className="row-center bb-txt-5 mt-4">
            <span className="dot-3"></span>
            <p className= "my-auto">Got a GSTIN? You're in!</p>
        </div>


    </div>

    <div className="col-12 col-md-6 col-lg-6">
        <img className="img-fluid rounded" src={banner2} alt="banner" width={500} height={500} />

    </div>
</div>
</div>


    <div className="container mt-3">

        <div className="row mx-auto">
          <div className="col-12 col-md-6 col-lg-6 order-2 order-md-0 order-lg-0">
          <img className="img-fluid rounded" src={banksett} alt="social Media" width={500} height={500} />
        </div>

            <div className="col-12 col-md-6 col-lg-6 my-auto">
                <div className="row creator-underline txt-bold"><p>Payment Settlements</p></div>
                <div className="row bb-txt-2"><p>Prompt settlement of all successful payments to your<span className="span-70"> bank account </span>on time.</p></div>

                <div className="row-center bb-txt-3">
                  <span className="just-arrow-1">&#128073;</span>
                    <p className= "my-auto">Transparent pricing for all business owners.</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-2">&#129308;</span>
                    <p className= "my-auto">T+1 payment settlements, even on holidays.</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-3">&#128077;</span>
                    <p className= "my-auto">File GST using e-invoicing (coming soon...)</p>
                </div>

            </div>
        </div>

    </div>



    <div className="container-fluid mx-auto custom-container-dimensions">
        <div className="row">
          <div className="col-md-6 col-12 txt-2 text-center my-auto"><p>Unlimited Invoices.<br /> <span className="creator-underline"></span></p> </div>
          <div className="col-md-6 col-12 my-auto">
            <div className="container mx-auto h2 pt-2">The best choice we made for startups.</div>
            <div className="container mx-auto row pt-2 pb-4">Get payment done no matter what.</div>
            <div className="container mx-auto "> <div className="col-md-12 col-12">
            <Link to="/login/brand" style={{textDecoration: 'none'}}><button className="btn signup-btn-grad-2 btn-g-fonts text-white">Explore Now</button></Link>

          </div></div>
            </div>
        </div>
      </div>

      

      <div className="container">

<div className="row mx-auto">
    <div className="col-12 col-md-6 col-lg-6 my-auto">
        <div className="row creator-underline txt-bold"><p>Branded Invoices</p></div>
        <div className="row bb-txt-2"><p>Elevate your <span className="span-70">Brand </span>with customized invoices.</p></div>

        <div className="row-center bb-txt-3">
            <span className="right-arrow-1"></span>
            <p className= "my-auto">Craft invoice that reflect your brand identity.</p>
        </div>

        <div className="row-center bb-txt-4 mt-4">
            <span className="right-arrow-2"></span>
            <p className= "my-auto">Invoice that embody your brand&apos;s essence, makes easy for your buyer to make payment.</p>
        </div>


        <div className="row-center bb-txt-5 mt-4">
            <span className="right-arrow-3"></span>
            <p className= "my-auto">Branded invoice across diverse platforms, turns your brand recognizable.</p>
        </div>


    </div>

    <div className="col-12 col-md-6 col-lg-6">
        <img className="img-fluid rounded" src={banner4} alt="banner" width={500} height={500} />
    </div>
</div>
</div>

<div className="container mt-3">
<div className="row mx-auto">

<div className="col-12 col-md-6 col-lg-6 order-2 order-md-0 order-lg-0">
<img className="img-fluid rounded" src={banner5} alt="Business Growth" width={500} height={500} />

</div>


    <div className="col-12 col-md-6 col-lg-6 my-auto">
        <div className="row creator-underline txt-bold"><p>Not Just Invoices</p></div>
        <div className="row bb-txt-2"><p>Every invoice redirect to a <span className="span-70">PDF</span> document.</p></div>


        <div className="row-center bb-txt-3">
          <span className="just-arrow-1">&#8594;</span>
            <p className= "my-auto">Share PDF as a short link & view in full-size.</p>
        </div>

        <div className="row-center bb-txt-3 mt-3">
          <span className="just-arrow-2">&#8594;</span>
            <p className= "my-auto">Make PDF-short-link password protected.</p>
        </div>

        <div className="row-center bb-txt-3 mt-3">
          <span className="just-arrow-3">&#8594;</span>
            <p className= "my-auto">Change designated PDF anytime.</p>
        </div>


    </div>


</div>
</div>

<div className="container mt-3">

<div className="row mx-auto">
    <div className="col-12 col-md-6 col-lg-6 my-auto">
        <div className="row creator-underline txt-bold"><p>Demographic Data</p></div>
        <div className="row bb-txt-2"><p>Understanding Your Buyers through
            <span className="span-70"> Payment </span>Insights.</p></div>

        <div className="row-center bb-txt-3">
            <span className="right-arrow-1"></span>
            <p className= "my-auto">Geographic distribution of your audience, from countries and states down to specific cities.</p>
        </div>

        <div className="row-center bb-txt-4 mt-4">
            <span className="right-arrow-2"></span>
            <p className= "my-auto">Explore the diversity of <span className="span-70">Browsers </span>your buyers uses to access your invoice.</p>
        </div>


        <div className="row-center bb-txt-5 mt-4">
            <span className="right-arrow-3"></span>
            <p className= "my-auto">Dive into the devices your buyers prefers, whether it&apos;s mobile, desktop, or tablet.</p>
        </div>


    </div>

    <div className="col-12 col-md-6 col-lg-6">
        <img className="img-fluid rounded" src={banner6} alt="banner" width={500} height={500} />

    </div>
</div>
</div>

    

      <div className="container-fluid mx-auto custom-container-dimensions-1">
        <div className="row">
          <div className="col-md-6 col-12 txt-2 text-center my-auto"><p>Unlimited Payments<br /></p> </div>
          <div className="col-md-6 col-12 my-auto">
            <div className="container mx-auto h2 pt-2 pb-4">NO limits on number of payments you accept.</div>
            <div className="container mx-auto "> <div className="col-md-12 col-12">
            <Link to="/login/brand" style={{textDecoration: 'none'}}><button className="btn login-btn-grad btn-g-fonts text-white">Signup Now</button></Link>

          </div></div>
            </div>
        </div>
      </div>

    </>
  )
}

export default BodyBlocks