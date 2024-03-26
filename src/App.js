// import logo from './logo.svg';
import './styles/Home.module.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
// import HomePage from './components/HomePage'

import { Provider } from 'react-redux';
import BrandSignup from './components/Brand/BrandSignup'
import BrandLogin from './components/Brand/BrandLogin'
import BrandMainScreen from './components/Brand/BrandMainScreen';
import ProfileSettings from './components/Brand/Profile';
import BrandSideNavBar from './components/Brand/BrandSideNavBar';
import InvoicesComp from './components/Brand/InvoicesComp';
import store from './store/store';
import CreateInvoice from './components/Brand/CreateInvoice';
import ProductList from './components/Brand/ProductList';
import Support from './components/Brand/Support';
import PaymentVerification from './components/Brand/PaymentVerification';
import LandingPage from './components/LandingPage/LandingPage';
import Terms from './components/LandingPage/Terms';
import PrivacyPolicy from './components/LandingPage/PrivacyPolicy';
import CancellationRefund from './components/LandingPage/CancellationRefund';
import ShippingPolicy from './components/LandingPage/ShippingPolicy';
import ContactUs from './components/LandingPage/ContactUs';



function App() {

  return (

    // <LocalizationProvider dateAdapter= {AdapterDateFns}>
    <Provider store={store}>
    <div className="App">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>

      <Router>
        <Routes>
          <Route path="/" element={< LandingPage/>}/>
          <Route path="/login/brand" element={<BrandLogin/>}/>
          <Route path="/signup/brand" element={<BrandSignup/>}/>
          <Route path="/verifyPayment" element={<PaymentVerification/>}/>
          <Route path="/terms-conditions" element={<Terms/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/cancellation-refund" element={<CancellationRefund/>}/>
          <Route path="/shipping-policy" element={<ShippingPolicy/>}/>
          <Route path="/contact-us" element={<ContactUs/>}/>


          {/* <Route path="/login/brand" element={<BrandLogin/>}/> */}


        <Route path="/brand/*" element={<BrandSideNavBar />}>
          <Route index element={<BrandMainScreen />} />
          <Route path="dashboard" element={<BrandMainScreen />} />
          <Route path="profileSettings" element={<ProfileSettings/>}/>
          <Route path="invoices" element={<InvoicesComp/>}/>
          <Route path="createInvoice" element={<CreateInvoice/>}/>
          <Route path="products" element={<ProductList/>}/>
          <Route path="support" element={<Support/>}/>



          {/* <Route path="campaign" element={<CreateCampaign/>}/>
          <Route path="campaigns/details" element={<BrandShowCampaignDetails/>}/>
          <Route path="dashboard" element={<BrandMainScreen />} />
          <Route path="campaigns" element={<CampaignCard />} />
          <Route path="campaign/requests" element={<ReceivedRequestsTable/>}/>
          <Route path="campaign/metrics" element={<CampaignCompletedMetrics/>}/>
          <Route path="campaignMetrics" element={<CampaignMetrics/>}/>
          <Route path="planDetails" element={<PlanPrices/>}/>
          <Route path="profileSettings" element={<ProfileSettings/>}/>
          <Route path="billing/plans" element={<BillingAndPlans/>}/>
          <Route path="transactions" element={<TransactionHistory/>}/>
          <Route path="support" element={<SupportPage/>}/> */}

        </Route>
        
        {/* Any other global routes that don't depend on the sidebar */}
        <Route path="/" element={<Outlet />}>
          {/* ... other routes */}
        </Route>


        </Routes>

      </Router>
     
    </div>
    </Provider>


  );

}


export default App;
