import React, { Component } from "react";
import { signup } from "../auth/index";
import { Link } from "react-router-dom";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      open: false
    };
  }

  handleChange = passInValue => event => {
    this.setState({ error: "" });
    this.setState({ [passInValue]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name: name,
      email: email,
      password: password
    };
    // console.log(user);
    signup(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          error: "",
          name: "",
          email: "",
          password: "",
          open: true
        });
      }
    });
  };

  signupForm = (name, email, password) => (
    <form>
      <div class="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        ></input>
      </div>
      <div class="form-group">
        <label className="text-muted">Email</label>
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
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Submit
      </button>
    </form>
  );

  render() {
    const { name, email, password, error, open } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signup</h2>
        <div
          className="alert alert-danger"
          sytle={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        <div
          className="alert alert-info"
          sytle={{ display: open ? "" : "none" }}
        >
          Sign up successfully. Please <Link to="/signin">Sign in</Link>.
        </div>
        {this.signupForm(name, email, password)}
      </div>
    );
  }
}

export default Signup;
