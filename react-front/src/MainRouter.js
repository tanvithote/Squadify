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

const MainRouter = () => (
  <div>
    {/* <Menu /> */}
    <Switch>
      {/* Routes for authentications */}
      <Route exact path="/signin" component={SignInSide} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/" component={SignInSide} />
      <Route exact path="/users" component={Users} />
      <Route exact path="/signup" component={Signup} />

      {/* Routes for profile */}
      <Route exact path="/user/:userId" component={Profile} />
      <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />

      {/* Routes for posts */}
      <PrivateRoute exact path="/group/:groupId/post/create" component={NewPost} />
      <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
      <Route exact path="/group/:groupId/posts" component={Posts} />
      <Route exact path="/post/:postId" component={SinglePost} />


      {/* Routes for groups */}
      <PrivateRoute exact path="/group/create" component={NewGroup} />
      <Route exact path="/group/:groupId" component={SingleGroup} />
      <PrivateRoute exact path="/group/edit/:groupId" component={EditGroup} />
      <Route exact path="/groups" component={Groups} />
      <Route exact path="/groups/search/:tag" component={SearchGroups} />

      {/* Routes for Events*/}
      <PrivateRoute exact path="/event/create" component={NewEvent} />
    </Switch>
  </div>
);

export default MainRouter;
