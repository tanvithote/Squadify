import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { singlePost, update } from "./apiPost";
import DefaultPost from "../images/tea.jpg";

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      error: "",
      redirectToPosts: false,
      fileSize: 0
    };
  }

  init = postId => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectToPosts: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    // console.log("user id from route params:", this.props.match.params.userId);
    const postId = this.props.match.params.postId;
    this.groupId = this.props.match.params.groupId;
    this.init(postId);
  }

  editPostForm = (id, title, body) => (
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
        Update Post
      </button>
      <Link to={`/group/${this.groupId}/post/${id}`} className="btn btn-raised btn-info ml-3">
        Cancel Editing
      </Link>
    </form>
  );

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
      const postId = this.state.id;
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          // console.log("New Post: ", data);
          this.setState({
            title: "",
            body: "",
            photo: "",
            redirectToPosts: true
          });
        }
      });
    }
  };

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

  render() {
    const { id, title, body, redirectToPosts, error } = this.state;

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/post/photo/${id}?${new Date().getTime()}`
      : DefaultPost;

    if (redirectToPosts) {
      return <Redirect to={`/group/${this.groupId}/posts`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>

        {error && (
          <div
            className="alert alert-danger"
            //   sytle={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        )}

        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={photoUrl}
          onError={i => (i.target.src = `${DefaultPost}`)}
          alt={title}
        />

        {this.editPostForm(id, title, body)}
      </div>
    );
  }
}

export default EditPost;
