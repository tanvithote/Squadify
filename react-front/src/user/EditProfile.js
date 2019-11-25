import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read, updateProfile, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      about: ""
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    // console.log("user id from route params:", this.props.match.params.userId);
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;

    if (fileSize > 100000) {
      this.setState({ error: "File size should be less than 100 KB." });
      return false;
    }

    if (name.length === 0) {
      this.setState({ error: "Name is required." });
      return false;
    }

    // email format regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.setState({ error: "A valid email is required." });
      return false;
    }

    if (password.length > 0 && password.length < 6) {
      this.setState({ error: "Password must be at least 6 characters long." });
      return false;
    }
    return true;
  };

  handleChange = passInValue => event => {
    this.setState({ error: "" });
    const value =
      passInValue === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = passInValue === "photo" ? event.target.files[0].size : 0;
    this.userData.set(passInValue, value);
    this.setState({ [passInValue]: value, fileSize: fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      updateProfile(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  updateForm = (name, email, password, about) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Profile Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        ></input>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        ></input>
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        ></input>
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        ></input>
      </div>

      <div className="form-group">
        <label className="text-muted">About</label>
        <textarea
          onChange={this.handleChange("about")}
          type="text"
          className="form-control"
          value={about}
        ></textarea>
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      about
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={photoUrl}
          onError={i => (i.target.src = `${DefaultProfile}`)}
          alt={name}
        />

        {this.updateForm(name, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;
