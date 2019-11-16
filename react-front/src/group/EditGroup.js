import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { singleGroup, update } from "./apiGroup";
import DefaultPost from "../images/tea.jpg";

class EditGroup extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      about: "",
      tags: [],
      error: "",
      redirectToGroup: false,
      fileSize: 0
    };
  }

  init = groupId => {
    singleGroup(groupId).then(data => {
      if (data.error) {
        this.setState({ redirectToGroup: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          about: data.about,
          tags: data.tags,
          photo: data.photo,
          error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.groupData = new FormData();
    // console.log("user id from route params:", this.props.match.params.userId);
    const groupId = this.props.match.params.groupId;
    this.init(groupId);
  }

  editGroupForm = (
    id,
    name,
    about,
    tags // should not edit location
  ) => (
    <form>
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
        <label className="text-muted">About</label>
        <input
          onChange={this.handleChange("about")}
          type="text"
          className="form-control"
          value={about}
        ></input>
      </div>

      <div className="form-group">
        <label className="text-muted">Tags</label>
        <textarea
          onChange={this.handleChange("tags")}
          type="array"
          className="form-control"
          value={tags}
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
        Update Group Information
      </button>
      <Link to={`/group/${id}`} className="btn btn-raised btn-info ml-3">
        Cancel Editing
      </Link>
    </form>
  );

  handleChange = passInValue => event => {
    this.setState({ error: "" });
    const value =
      passInValue === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = passInValue === "photo" ? event.target.files[0].size : 0;
    // const tagsValue =
    //   passInValue === "tags"
    //     ? event.target.value.toLowerCase().split(",")
    //     : [];
    this.groupData.set(passInValue, value);
    // this.groupData.set("tags", tagsValue);
    this.setState({ [passInValue]: value, fileSize: fileSize});
  };

  clickSubmit = event => {
    event.preventDefault();

    if (this.isValid()) {
      const groupId = this.state.id;
      const token = isAuthenticated().token;

      update(groupId, token, this.groupData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          // console.log("New Post: ", data);
          this.setState({
            name: "",
            about: "",
            tags: [],
            photo: "",
            error: "",
            redirectToGroup: true
          });
        }
      });
    }
  };

  isValid = () => {
    const { name, about, fileSize } = this.state;

    if (fileSize > 100000) {
      this.setState({ error: "File size should be less than 100 KB." });
      return false;
    }

    if (name.length === 0) {
      this.setState({ error: "Title is required." });
      return false;
    }

    if (about.length === 0) {
      this.setState({ error: "Body is required." });
      return false;
    }
    return true;
  };

  render() {
    const { id, name, about, tags, redirectToGroup, error } = this.state;

    // const tagsString = tags.join(", ");
    // console.log(tagsString);

    // const photoUrl = id
    //   ? `${
    //       process.env.REACT_APP_API_URL
    //     }/group/photo/${id}?${new Date().getTime()}`
    //   : DefaultPost;

    if (redirectToGroup) {
        console.log(id);
        return <Redirect to={`/group/${id}`} />;
    //   let userId = isAuthenticated().user._id;
    //   return <Redirect to={`/user/${userId}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{name}</h2>

        {error && (
          <div
            className="alert alert-danger"
            //   sytle={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        )}

        {/* <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={photoUrl}
          onError={i => (i.target.src = `${DefaultPost}`)}
          alt={name}
        /> */}

        {this.editGroupForm(id, name, about, tags)}
      </div>
    );
  }
}

export default EditGroup;
