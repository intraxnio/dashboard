import React, { useState } from 'react'
import { useEffect } from 'react';
import step1 from '../public/1.jpg'
import step2 from '../public/2.jpg'
import step3 from '../public/3.jpg'
import Image from 'next/image';


export default function Toggle() {

    const [img, setImg] = useState(step1);



    return (
        <>

            {/* Image toggle three section */}

            <div className="container text-center fs-2 text-success border-bottom border-secondary w-75">How to use</div>

            <div className="container mt-5">
                <div className="row">
                    <div className="container col-12 col-sm-6 col-md-6 col-lg-6 mt-3">
                        <Image className="img-fluid rounded" src={img} alt="how it works" />
                    </div>

                    <div className="container col-12 col-sm-6 col-md-6 col-lg-6 my-auto px-5">
                        <button className="container btn btn-outline-primary active row my-3 mx-auto" onClick={() => { setImg(step1) }}>Mix well</button>
                        <button className="container btn btn-outline-success row my-2 mx-auto" onClick={() => { setImg(step2) }}>Apply to face</button>
                        <button className="container btn btn-outline-secondary row my-3 mx-auto" onClick={() => { setImg(step3) }}>Let it dry & wash. that&apos;s it</button>


                    </div>
                </div>
            </div>



        </>
    )
}
