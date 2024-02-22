import React from 'react'
import banner1 from "../images/banner1.jpg"
import banner2 from "../images/banner2.jpg"
import banner3 from "../images/banner3.webp"
import { Link } from 'react-router-dom';





function BodyBlocks() {
  return (
    <>

    <div className="container">

        <div className="row mx-auto">
            <div className="col-12 col-md-6 col-lg-6 my-auto">
                <div className="row creator-underline txt-bold"><p>Retarget Users</p></div>
                <div className="row bb-txt-2"><p>Retarget or Remarket each and every single person who
                    <span className="span-70"> clicks </span>the link.</p></div>
                {/* <div className="row bb-txt-3"><p><span className="check-1"></span>Trigger retargeting pixels directly from your links.</p></div> */}

                <div className="row-center bb-txt-3">
                    <span className="right-arrow-1"></span>
                    <p className= "my-auto">Trigger retargeting pixels directly from your links.</p>
                </div>

                <div className="row-center bb-txt-4 mt-4">
                    <span className="right-arrow-2"></span>
                    <p className= "my-auto">Supports <span className="span-70"> Facebook, Google Analytics, Twitter</span> & more.</p>
                </div>


                <div className="row-center bb-txt-5 mt-4">
                    <span className="right-arrow-3"></span>
                    <p className= "my-auto">Just add tracking pixel to your short url.</p>
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
                <div className="row creator-underline txt-bold"><p>Reporting & Analytics</p></div>
                <div className="row bb-txt-2"><p>Get Real time <span className="span-70">analytics and engagement</span> metrics of your links in PDF format.
                Reporting ROI is at ease.</p></div>


                <div className="row-center bb-txt-3">
                  <span className="just-arrow-1">&#8594;</span>
                    <p className= "my-auto">Accurate & Real-Time Analytics.</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-2">&#8594;</span>
                    <p className= "my-auto">Download & Share Reports.</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-3">&#8594;</span>
                    <p className= "my-auto">Share Reports via short URL.</p>
                </div>


            </div>


        </div>
    </div>


<div className="container mt-3">

<div className="row mx-auto">
    <div className="col-12 col-md-6 col-lg-6 my-auto">
        <div className="row creator-underline txt-bold"><p>UTM Builder</p></div>
        <div className="row bb-txt-2"><p>Elevate your link tracking precision with our
            <span className="span-70"> UTM builder.</span></p></div>

        <div className="row-center bb-txt-3">
            <span className="dot-1"></span>
            <p className= "my-auto">Seamlessly generate UTM parameters for all your links.</p>
        </div>

        <div className="row-center bb-txt-4 mt-4">
            <span className="dot-2"></span>
            <p className= "my-auto">Compatible with <span className="span-70">Facebook, Google Analytics, Twitter</span> & more.</p>
        </div>


        <div className="row-center bb-txt-5 mt-4">
            <span className="dot-3"></span>
            <p className= "my-auto">Tracking tags in short URL for streamlined campaign analytics.</p>
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
          <img className="img-fluid rounded" src={banner2} alt="social Media" width={500} height={500} />
        </div>

            <div className="col-12 col-md-6 col-lg-6 my-auto">
                <div className="row creator-underline txt-bold"><p>Social Preview</p></div>
                <div className="row bb-txt-2"><p>Add a custom title, description and image for sharing links on social platforms like <span className="span-70"> Whatsapp, Facebook, Twitter</span> & others.</p></div>

                <div className="row-center bb-txt-3">
                  <span className="just-arrow-1">&#128073;</span>
                    <p className= "my-auto">Improves Click Through Rate (CTR).</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-2">&#129308;</span>
                    <p className= "my-auto">Grabs more & genuine attention.</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-3">&#128077;</span>
                    <p className= "my-auto">Gets more brand reach.</p>
                </div>

            </div>
        </div>

    </div>



    <div className="container-fluid mx-auto custom-container-dimensions">
        <div className="row">
          <div className="col-md-6 col-12 txt-2 text-center my-auto"><p>Unlimited Links<br /> <span className="creator-underline"> in all plans.</span></p> </div>
          <div className="col-md-6 col-12 my-auto">
            <div className="container mx-auto h2 pt-2">Pick the plan that best suits your requirements.</div>
            <div className="container mx-auto row pt-2 pb-4">Target the right audience by our retargeting feature.</div>
            <div className="container mx-auto "> <div className="col-md-12 col-12">
            <Link to="/pricing" style={{textDecoration: 'none'}}><button className="btn signup-btn-grad-2 btn-g-fonts text-white">View Plans</button></Link>

          </div></div>
            </div>
        </div>
      </div>

      

      <div className="container">

<div className="row mx-auto">
    <div className="col-12 col-md-6 col-lg-6 my-auto">
        <div className="row creator-underline txt-bold"><p>Branded URLs</p></div>
        <div className="row bb-txt-2"><p>Elevate Your <span className="span-70">Brand </span>with Customized Short Links.</p></div>

        <div className="row-center bb-txt-3">
            <span className="right-arrow-1"></span>
            <p className= "my-auto">Craft unique short links that reflect your brand identity, such as domin.os/pizza.</p>
        </div>

        <div className="row-center bb-txt-4 mt-4">
            <span className="right-arrow-2"></span>
            <p className= "my-auto">Short links that embody your brand&apos;s essence, makes easy for your audience to remember.</p>
        </div>


        <div className="row-center bb-txt-5 mt-4">
            <span className="right-arrow-3"></span>
            <p className= "my-auto">Branded short links across diverse platforms, turns your brand recognizable.</p>
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
        <div className="row creator-underline txt-bold"><p>Not Just Links (PDF)</p></div>
        <div className="row bb-txt-2"><p>Now you can redirect a short link to a <span className="span-70">PDF</span> document.</p></div>


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
        <div className="row bb-txt-2"><p>Understanding Your Audience through
            <span className="span-70"> Demographic </span>Insights.</p></div>

        <div className="row-center bb-txt-3">
            <span className="right-arrow-1"></span>
            <p className= "my-auto">Geographic distribution of your audience, from countries and states down to specific cities.</p>
        </div>

        <div className="row-center bb-txt-4 mt-4">
            <span className="right-arrow-2"></span>
            <p className= "my-auto">Explore the diversity of <span className="span-70">Browsers </span>your audience uses to access your content.</p>
        </div>


        <div className="row-center bb-txt-5 mt-4">
            <span className="right-arrow-3"></span>
            <p className= "my-auto">Dive into the devices your audience prefers, whether it&apos;s mobile, desktop, or tablet.</p>
        </div>


    </div>

    <div className="col-12 col-md-6 col-lg-6">
        <img className="img-fluid rounded" src={banner1} alt="banner" width={500} height={500} />

    </div>
</div>
</div>

    

      <div className="container-fluid mx-auto custom-container-dimensions-1">
        <div className="row">
          <div className="col-md-6 col-12 txt-2 text-center my-auto"><p>Unlimited Clicks<br /> <span className="creator-underline"> in all plans.</span></p> </div>
          <div className="col-md-6 col-12 my-auto">
            <div className="container mx-auto h2 pt-2 pb-4">NO limits on number of clicks per link.</div>
            <div className="container mx-auto "> <div className="col-md-12 col-12">
            <Link to="/pricing" style={{textDecoration: 'none'}}><button className="btn login-btn-grad btn-g-fonts text-white">View Plans</button></Link>

          </div></div>
            </div>
        </div>
      </div>

    </>
  )
}

export default BodyBlocks