import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Signup from "./user/Signup";
import Profile from "./user/Profile";
import Users from "./user/Users";
import SignInSide from "./user/Signin";
import EditProfile from "./user/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";
import Signout from "./user/Signout";
import NewPost from "./post/NewPost";
import Posts from "./post/Posts";
import SinglePost from "./post/SinglePost";
import EditPost from "./post/EditPost";
import NewGroup from "./group/NewGroup";
import SingleGroup from "./group/SingleGroup";
import EditGroup from "./group/EditGroup";
import Groups from "./group/Groups";
import SearchGroups from "./group/SearchGroups";
import NewEvent from "./event/NewEvent";
import SingleEvent from "./event/SingleEvent";
import EditEvent from "./event/EditEvent"
import Events from "./event/Events";
import About from "./group/About";
import GroupPosts from "./group/GroupPosts";
import GroupCalendar from "./group/GroupCalendar";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

const MainRouter = () => (
  <div>
    {/* <Menu /> */}
    <Switch>
      {/* Routes for authentications */}
      <Route exact path="/signin" component={SignInSide} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />
      <Route exact path="/" component={SignInSide} />
      <Route exact path="/users" component={Users} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signout" component={Signout} />

      {/* Routes for profile */}
      <Route exact path="/user/:userId" component={Profile} />
      <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />

      {/* Routes for posts */}
      <PrivateRoute exact path="/group/:groupId/post/create" component={NewPost} />
      <PrivateRoute exact path="/group/:groupId/post/edit/:postId" component={EditPost} />
      {/* <Route exact path="/group/:groupId/posts" component={Posts} /> */}
      {/* SinglePost without a group Id */}
      <Route exact path="/post/:postId" component={SinglePost} /> 
      <Route exact path="/group/:groupId/post/:postId" component={SinglePost} />


      {/* Routes for groups */}
      <PrivateRoute exact path="/group/create" component={NewGroup} />
      <Route exact path="/group/:groupId" component={SingleGroup} />
      <PrivateRoute exact path="/group/edit/:groupId" component={EditGroup} />
      <Route exact path="/groups" component={Groups} />
      <Route exact path="/groups/search/:tag" component={SearchGroups} />
      <Route exact path="/group/:groupId/about" component={About} />
      <Route exact path="/group/:groupId/posts" component={GroupPosts} />
      <Route exact path="/group/:groupId/calendar" component={GroupCalendar} />

      {/* Routes for Events*/}
      <PrivateRoute exact path="/group/:groupId/event/create" component={NewEvent} />
      <PrivateRoute exact path="/group/:groupId/events" component={Events} />
      <Route exact path="/event/:eventId/" component={SingleEvent} />
      <PrivateRoute exact path="/event/edit/:eventId" component={EditEvent} />
    </Switch>
  </div>
);

export default MainRouter;
