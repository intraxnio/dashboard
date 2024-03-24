import React from 'react'
import { Link } from 'react-router-dom';


export default function Navbar() {
    return (

        <nav className="navbar navbar-expand-lg navbar-light mt-2">

            <div className="container" > 
                <Link to="/" className="navbar-brand" style={{fontSize: '22px', fontWeight: 500, color: '#11009E', fontFamily: "Poppins" }} >billsbook<span style={{color: '#D80032', fontSize: '28px'}}>.</span></Link>

                {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse justify-content-center navbar-collapse ms-md-5" id="navbarNav">
                    <ul className="navbar-nav md-5">
                        <li className="nav-item me-5 ms-2">
                            <Link to="/" className="nav-link active my-2 g-fonts" aria-current="page" style={{textDecoration: 'none'}}>Home</Link>
                        </li>

                        <li className="nav-item me-5 ms-2">
                            <Link to="/pricing" className="nav-link my-2 g-fonts" aria-current="page" style={{textDecoration: 'none'}}>Use Cases</Link>
                        </li>

                        <li className="nav-item me-5 ms-2">
                            <Link to="/pricing" className="nav-link my-2 g-fonts" aria-current="page" style={{textDecoration: 'none'}}>Pricing</Link>
                        </li>



                    </ul>
                </div> */}
            </div>


        </nav>




    )
}
