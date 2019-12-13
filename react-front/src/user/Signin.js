import React, { Component } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { signin, authenticate } from "../auth";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Link from '@material-ui/core/Link';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
//import withStyles from './css/Styles'
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import SocialLogin from "./SocialLogin";

import image from "../icon2.png";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        SQUADIFY
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createMuiTheme({
  spacing: 4
});
const styles = {
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "100%"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
};

class SignInSide extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false,
      errorMessage: ""
    };
  }

  handleChange = passInValue => event => {
    this.setState({ error: "" });
    this.setState({ [passInValue]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email: email,
      password: password
    };
    // console.log(user);
    signin(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        this.setState({ errorMessage: "" });
        // authenticate user
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });

        // redirect
      }
    });
  };
  signinForm = (email, password) => (
    <div className="container col-8 mt-5">
      <form>
        <div>
          <div class="form-group">
            <label className="text-muted ">Email</label>
            <input
              onChange={this.handleChange("email")}
              type="email"
              className="form-control"
              value={email}
            ></input>
          </div>
          <div class="form-group">
            <label className="text-muted">Password</label>
            <input
              onChange={this.handleChange("password")}
              type="password"
              className="form-control"
              value={password}
            ></input>
          </div>
          <button
            onClick={this.clickSubmit}
            className="btn btn-raised btn-info mx-auto d-block"
          >
            Sign In
          </button>
          <div className="row">
          <Link className="nav-link mx-auto" to="/signup">
            Don't have an account? Sign Up
          </Link>
          <Link to="/forgot-password" className=" nav-link mx-auto text-danger">
            {" "}
              Forgot Password
          </Link>
          </div>
          
          <hr />
            <SocialLogin />
       
        </div>
      </form>
    </div>
  );

  render() {
    const { email, password, error, redirectToReferer, loading } = this.state;

    const { classes } = this.props;
    if (redirectToReferer) {
      return <Redirect to="/home" />;
    }
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {error && <div className="alert alert-danger mb-2">{error}</div>}
            {this.signinForm(email, password)}
          </div>
        </Grid>
      </Grid>
    );
  }
}
//export default SignInSide
SignInSide.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignInSide);
