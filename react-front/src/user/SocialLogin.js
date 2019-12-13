import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLogin, authenticate } from "../auth";
import FacebookLogin from "react-facebook-login";
// import {TiSocialFacebookCircular} from 'react-icons/lib/ti/social-facebook-circular';

class SocialLogin extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false
    };
  }

  responseGoogle = response => {
    console.log(response);
    const { googleId, name, email, imageUrl } = response.profileObj;
    const user = {
      password: googleId,
      name: name,
      email: email,
      imageUrl: imageUrl
    };
    // console.log("user obj to social login: ", user);
    socialLogin(user).then(data => {
      console.log("signin data: ", data);
      if (data.error) {
        console.log("Error Login. Please try again..");
      } else {
        console.log("signin success - setting jwt: ", data);
        authenticate(data, () => {
          this.setState({ redirectToReferrer: true });
        });
      }
    });
  };

  responseFacebook = response => {
    console.log(response);
    const { name, email, picture, accessToken } = response;
    const user = {
      password: accessToken,
      name: name,
      email: email,
      imageUrl: picture
    };
    // console.log("user obj to social login: ", user);
    socialLogin(user).then(data => {
      console.log("signin data: ", data);
      if (data.error) {
        console.log("Error Login. Please try again..");
      } else {
        console.log("signin success - setting jwt: ", data);
        authenticate(data, () => {
          this.setState({ redirectToReferrer: true });
        });
      }
    });
  };

  render() {
    // redirect
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to="/home" />;
    }

    return (
      <span>
        <GoogleLogin
          clientId="60725576041-d56broo0gv0qjtb5qa3fmipclstp7qb7.apps.googleusercontent.com"
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        />

        <div className="mt-2"></div>

        <FacebookLogin
          appId="743273082824594"
          fields="name,email,picture"
          callback={this.responseFacebook}
          icon="fas fa-facebook"
          size="small"
        />
      </span>
    );
  }
}

export default SocialLogin;
