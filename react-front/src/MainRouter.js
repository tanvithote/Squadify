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

const MainRouter = () => (
  <div>
    <Menu />
    <Switch>
      <Route exact path="/signin" component={SignInSide} />
      <Route exact path="/" component={Home} />
      <Route exact path="/users" component={Users} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/user/:userId" component={Profile} />
      <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
      <PrivateRoute exact path="/post/create" component={NewPost} />
      <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
      <Route exact path="/posts" component={Posts} />
      <Route exact path="/post/:postId" component={SinglePost} />
    </Switch>
  </div>
);

export default MainRouter;
