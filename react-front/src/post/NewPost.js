import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      redirectToProfile: false
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;

    if (fileSize > 100000) {
      this.setState({ error: "File size should be less than 100 KB." });
      return false;
    }

    if (title.length === 0) {
      this.setState({ error: "Title is required." });
      return false;
    }

    if (body.length === 0) {
      this.setState({ error: "Body is required." });
      return false;
    }
    return true;
  };

  handleChange = passInValue => event => {
    this.setState({ error: "" });
    const value =
      passInValue === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = passInValue === "photo" ? event.target.files[0].size : 0;
    this.postData.set(passInValue, value);
    this.setState({ [passInValue]: value, fileSize: fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          // console.log("New Post: ", data);
          this.setState({
            title: "",
            body: "",
            photo: "",
            redirectToProfile: true
          });
          //   updateUser(data, () => {
          //     this.setState({
          //       redirectToProfile: true
          //     });
          //   });
        }
      });
    }
  };

  newPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        ></input>
      </div>

      <div className="form-group">
        <label className="text-muted">Body</label>
        <textarea
          onChange={this.handleChange("body")}
          type="text"
          className="form-control"
          value={body}
        ></textarea>
      </div>
      <div className="form-group">
        <label className="text-muted">Upload a photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        ></input>
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Create Post
      </button>
    </form>
  );

  render() {
    const { title, body, photo, user, error, redirectToProfile } = this.state;

    if (redirectToProfile) {
      // return <Redirect to={`/user/${user._id}`} />;
      return <Redirect to={`/posts`} />;
    }

    // const photoUrl = id
    //   ? `${
    //       process.env.REACT_APP_API_URL
    //     }/user/photo/${id}?${new Date().getTime()}`
    //   : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Create a new post</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        {this.newPostForm(title, body)}
      </div>
    );
  }
}

export default NewPost;
