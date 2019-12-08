import React, { Component } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { signout, authenticate } from "../auth";

class Signout extends Component {
  constructor() {
    super();
    this.state = {
      redirectToSignin: false
    };
  }
  componentDidMount = () => {
    this.id = setTimeout(() => this.setState({ redirectToSignin: true }), 2000);
  };

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    return this.state.redirectToSignin ? (
      <Redirect to="/" />
    ) : (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>Signed out successfully. Redirecting...</div>
      </div>
    );
  }
}

export default Signout;
