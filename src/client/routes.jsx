import React from "react";
import { Route, IndexRoute } from "react-router";
import MasterLayout from "./layouts/share/_master";
import GuestLayout from "./layouts/share/_guest";
import { Dashboard } from "./pages/dashboard"
import { UserProfile } from "./pages/updateProfile"
import { FriendVerify } from "./pages/friendVerify"
import { LoanRegistration } from "./pages/loanRegistration"
import { LoanHistory, LoanHistoryDetail } from "./pages/loanHistory"

export const routes = (<Route>
  <Route path="/" component={MasterLayout}>
    <IndexRoute component={LoanHistory} />
    <Route path="user-profile" component={UserProfile} />
    <Route path="loan-registration" component={LoanRegistration} />
    <Route path="loan-history" component={LoanHistory} />
    <Route path="loan-history/:id" component={LoanHistoryDetail} />
    <Route path="friend-verify" component={FriendVerify} />
  </Route>
  <Route path="/guest" component={GuestLayout}>
    <IndexRoute component={FriendVerify} />
    <Route path="friend-verify" component={FriendVerify} />
  </Route>
</Route>)
