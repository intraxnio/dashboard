// import logo from './logo.svg';
import './styles/Home.module.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
// import HomePage from './components/HomePage'
import BrandSignup from './components/Brand/BrandSignup'
import CreatorSignup from './components/Creator/CreatorSignup'
import BrandLogin from './components/Brand/BrandLogin'
import CreatorLogin from './components/Creator/CreatorLogin'
import CreatorInsights from './components/Creator/CreatorInsights';
import CreatorDashboard from './components/Creator/CreatorProfile';
// import ActivationPage from './components/ActivationPage';
import CreateCampaign from './components/Brand/CreateCampaign';
import { LocalizationProvider } from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import InfluencerList from './components/Creator/InfluencerList';
import InstagramLogin from './components/Creator/InstagramLogin';
import InstagramCode from './components/Creator/InstagramCode';
import CampaignCard from './components/Brand/CampaignCard';
import CreatorCampaigns from './components/Creator/CreatorCampaigns';
import ShowCampaignDetails from './components/Creator/ShowCampaignDetails';
import BrandShowCampaignDetails from './components/Brand/BrandShowCampaignDetails';
// import BrandDashboard from './components/Brand/BrandDashboard';
// import BrandCampaignsTable from './components/Brand/ReceivedRequestsTable';
import ReceivedRequestsTable from './components/Brand/ReceivedRequestsTable';
import IndiCreatorInsights from './components/Brand/IndividualCreatorDetails';
import BrandMainScreen from './components/Brand/BrandMainScreen';
import BrandSideNavBar from './components/Brand/BrandSideNavBar';
// import CreatorProfile from './components/CreatorProfile';
import PublishCampaignCreator from './components/Creator/PublishCampaignCreator';
import CreatorSideNavBar from './components/Creator/CreatorSideNavBar';
import CampaignMetrics from './components/Brand/CampaignMetrics';
import CampaignCompletedMetrics from './components/Brand/CampaignCompletedMetrics';
import PlanPrices from './components/Brand/PlanPrices';
import ProfileSettings from './components/Brand/ProfileSettings';
import BillingAndPlans from './components/Brand/BillingAndPlans';
import TransactionHistory from './components/Brand/TransactionHistory';
import SupportPage from './components/Brand/SupportPage';
import ForgotPassword from './components/Brand/ForgotPassword';
import ShowInterestedCampaignDetails from './components/Creator/ShowInterestedCampaignDetails';
import CreatorProfile from './components/Creator/CreatorProfile';
import AccountSettings from './components/Creator/AccountSettings';
import BankDetails from './components/Creator/BankDetails';
import Payouts from './components/Creator/Payouts';
import PrivacyPolicy from './components/Creator/PrivacyPolicy';
import TermsAndConditions from './components/Creator/TermsAndConditions';
import CreatorSupport from './components/Creator/CreatorSupport';



function App() {

  return (
    <LocalizationProvider dateAdapter= {AdapterDateFns}>
    <div className="App">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />

      <Router>
        <Routes>
          <Route path="/" element={<BrandLogin/>}/>
          <Route path="/signup/brand" element={<BrandSignup/>}/>
          <Route path="/forgotPassword" element={<ForgotPassword/>}/>
          <Route path="/signup/creator" element={<CreatorSignup/>}/>
          {/* <Route path="/login/brand" element={<BrandLogin/>}/> */}
          <Route path="/login/creator" element={<CreatorLogin/>}/>
          {/* <Route path="/activation/:activation_token" element={<ActivationPage/>}/> */}
          <Route path="/indiDetails" element={<IndiCreatorInsights/>}/>
          <Route path="insta_graph_dialogue" element={<InstagramCode/>}/>


        <Route path="/creator/*" element={<CreatorSideNavBar />}>
          <Route index element={<CreatorInsights />} />
          <Route path="profile" element={<CreatorProfile />} />
          <Route path="insights" element={<CreatorInsights />} />
          <Route path="getAllCampaigns" element={<CreatorCampaigns />} />
          {/* <Route path="profile" element={<CreatorProfile />} /> */}
          <Route path="publishPost" element={<PublishCampaignCreator />} />
          <Route path="campaign/details" element={<ShowCampaignDetails/>}/>
          <Route path="interested/campaign/details" element={<ShowInterestedCampaignDetails/>}/>
          <Route path="accountSettings" element={<AccountSettings/>}/>
          <Route path="bankDetails" element={<BankDetails/>}/>
          <Route path="payouts" element={<Payouts/>}/>
          <Route path="privacyPolicy" element={<PrivacyPolicy/>}/>
          <Route path="termsAndConditions" element={<TermsAndConditions/>}/>
          <Route path="connect/instagram" element={<InstagramLogin/>}/>
          <Route path="support" element={<CreatorSupport/>}/>


          

        </Route>

        <Route path="/brand/*" element={<BrandSideNavBar />}>
          <Route index element={<BrandMainScreen />} />
          <Route path="campaign" element={<CreateCampaign/>}/>
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
          <Route path="support" element={<SupportPage/>}/>


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
