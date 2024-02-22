// import logo from './logo.svg';
import './styles/Home.module.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
// import HomePage from './components/HomePage'
import UserSignup from './components/Brand/UserSignup'
import UserLogin from './components/Brand/UserLogin'
import LinksCard from './components/Brand/LinksCard';
import CreateLink from './components/Brand/CreateLink';
import { LocalizationProvider } from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import UserSideNavBar from './components/Brand/UserSideNavBar';
import LinkMetrics from './components/Brand/LinkMetrics';
import RedirectLink from './components/Brand/RedirectLink';
import CustomDomains from './components/Brand/CustomDomains';
import Support from './components/Brand/Support';
import TrackingCodes from './components/Brand/TrackingCodes';
import Profile from './components/Brand/Profile';
import ForgotPassword from './components/Brand/ForgotPassword';
import LandingPage from './components/LandingPage';
import Pricing from './components/Pricing';
import Terms from './components/Terms';
import PrivacyPolicy from './components/PrivacyPolicy';
import CancellationRefund from './components/CancellationRefund';
import ShippingPolicy from './components/ShippingPolicy';
import ContactUs from './components/ContactUs';




function App() {

  return (
    <LocalizationProvider dateAdapter= {AdapterDateFns}>
    <div className="App">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>


      <Router>
        <Routes>
          <Route path="/" element={< LandingPage/>}/>
          <Route path="/login" element={< UserLogin/>}/>
           <Route path="/signup/brand" element={< UserSignup/>}/>
           <Route path=":linkId" element={<RedirectLink/>}/>
           <Route path="/forgotPassword" element={<ForgotPassword/>}/>
           <Route path="/pricing" element={<Pricing/>}/>
           <Route path="/terms" element={<Terms/>}/>
           <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
           <Route path="/cancellation-refund" element={<CancellationRefund/>}/>
           <Route path="/shipping-policy" element={<ShippingPolicy/>}/>
           <Route path="/contact" element={<ContactUs/>}/>




          {/* <Route path="/forgotPassword" element={<ForgotPassword/>}/> */}

        <Route path="/brand/*" element={< UserSideNavBar />}>
        <Route path="linksCard" element={<LinksCard />} />
        <Route path="createLink" element={<CreateLink/>}/>
        <Route path="link/metrics" element={<LinkMetrics/>}/>
        <Route path="customDomains" element={<CustomDomains/>}/>
        <Route path="support" element={<Support/>}/>
        <Route path="trackingCodes" element={<TrackingCodes/>}/>
        <Route path="profile" element={<Profile/>}/>




        </Route>
        
        {/* Any other global routes that don't depend on the sidebar */}
        <Route path="/" element={<Outlet />}>
          {/* ... other routes */}
        </Route>


        </Routes>

      </Router>
     
    </div>


    </LocalizationProvider>
  );

}


export default App;
