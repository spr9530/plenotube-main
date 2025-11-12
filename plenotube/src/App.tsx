import { Navigate, Route, Routes } from "react-router-dom";

import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import IndexPage from "@/pages/index";
import AboutPage from "@/pages/about";
import Profile from "@/pages/profile";
import Platform from "@/pages/platform";
import Discover from "@/pages/discover";
import MySubmission from "@/pages/campaignInfo/MySubmission";
import General from "@/pages/settings/general"
import Orders from "@/pages/settings/orders"
import Accounts from "@/pages/settings/accounts"
import Payment from "@/pages/settings/payment"
import Balance from "@/pages/settings/Balance"
import Danger from "@/pages/settings/danger"
import CampaignInfo from "@/pages/campaignInfo/campaignInfo"
import Submission from "@/pages/submission/submission"
import ProtectedRoute from "./ProtectedRoute"
import UserCampaign from "@/pages/userCampaign/userCampaign"

import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";


function App() {
  return (
    <Routes>
      <Route element={<SignIn />} path="/sign-in" />
      <Route element={<SignUp />} path="/sign-up" />
      <Route element={<IndexPage />} path="/" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<ProtectedRoute element={<Platform />}  redirect='platform'/>} path='/platform'/>
      <Route element={<Profile />} path="/platform/profile" />
      <Route element={<ProtectedRoute element={<Discover />}  redirect='platform/discover'/>} path='/platform/discover'/>
      {/* <Route element={<CampaignInfo />} path="/platform/discover/campaign/:name" /> */}
      <Route element={<ProtectedRoute element={<CampaignInfo />}  redirect='platform/discover/campaign/:name'/>} path='/platform/discover/campaign/:name'/>
      <Route element={<Submission />} path="/platform/discover/campaign/:name/submission" />
      <Route element={<MySubmission />} path="/platform/my-submission" />
      <Route element={<ProtectedRoute element={<UserCampaign />}  redirect='platform/my-campaign'/>} path='/platform/my-campaign'/>
      <Route element={<ProtectedRoute element={<General />}  redirect='platform/profile/genral'/>} path="/platform/profile/general" />
      <Route element={<Orders />} path="/platform/profile/orders" />
      <Route element={<Accounts />} path="platform/profile/connected-accounts" />
      <Route element={<Payment />} path="platform/profile/payment-methods" />
      <Route element={<Balance />} path="platform/profile/balance" />
      <Route element={<Danger />} path="platform/profile/danger-zone" />
    </Routes>
  )
}

export default App;

