import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create, joinGroup } from "./apiGroup";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/tea.jpg";
import Menu from "../core/Menu";
import { Col, FormControl } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'



class NewGroup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      location: "",
      about: "",
      photo: "",
      error: "",
      user: {},
      tags: [],
      fileSize: 0,
      redirectToGroups: false
    };
  }

  componentDidMount() {
    this.groupData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { name, location, about, fileSize } = this.state;

    if (fileSize > 100000) {
      this.setState({ error: "File size should be less than 100 KB." });
      return false;
    }

    if (name.length === 0) {
      this.setState({ error: "Group name is required." });
      return false;
    }

    if (location.length === 0) {
      this.setState({ error: "Location is required." });
      return false;
    }

    if (about.length === 0) {
      this.setState({ error: "Description is required." });
      return false;
    }
    return true;
  };

  handleChange = passInValue => event => {
    this.setState({ error: "" });
    const value =
      passInValue === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = passInValue === "photo" ? event.target.files[0].size : 0;
    // Split the input tags string into an array by non-alphabetical or non-numbers
    const tagsValue =
      passInValue === "tags"
        ? event.target.value.toLowerCase().split("[^a-zA-Z0-9]+")
        : [];
    const locationValue =
      passInValue === "location" ? event.target.value.toLowerCase() : "";
    this.groupData.set(passInValue, value);
    this.setState({ [passInValue]: value, fileSize: fileSize });
    
  };

  clickSubmit = event => {
    event.preventDefault();

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.groupData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          // console.log("New Post: ", data);
          this.setState({
            name: "",
            location: "",
            about: "",
            photo: "",
            error: "",
            tags: [],
            redirectToGroups: true
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

  newGroupForm = (name, location, tags, about) => (
    <form>
    
      <div className="form-group">
        <label className="text-dark">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        ></input>
      </div>
    
      <div className="form-group">
        <label className="text-dark">Description</label>
        <textarea
          onChange={this.handleChange("about")}
          type="text"
          className="form-control"
          value={about}
        ></textarea>
      </div>
      <div className="form-group">
        <label className="text-dark">Location</label>
        <textarea
          onChange={this.handleChange("location")}
          type="text"
          className="form-control"
          value={location}
          placeholder="Bloomington, IN"
        ></textarea>
      </div>
      {/* <Form.Group controlId="formGridState">
      <Form.Label>Tags</Form.Label>
      <Form.Control as="select">
      onChange={this.handleChange("tags")}
        <option> </option>
        <option>Trekking</option>
        <option>Tennis</option>
        <option>Cooking</option>
        <option>Cooking Italian</option>
      </Form.Control>
    </Form.Group> */}
      <div className="form-group">
        <label className="text-dark">Tags</label>
        <textarea
          onChange={this.handleChange("tags")}
          type="text"
          className="form-control"
          value={tags}
          placeholder="Cooking, Cuisine, Food"
        ></textarea>
      </div>
      <div className="form-group">
        <label className="text-dark">Upload a cover photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        ></input>
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-info">
        Create Group
      </button>
    </form>
  );

  render() {
    const {
      name,
      location,
      about,
      photo,
      user,
      tags,
      error,
      redirectToGroups
    } = this.state;

    if (redirectToGroups) {
      // return <Redirect to={`/user/${user._id}`} />;
      return <Redirect to={`/groups`} />;
    }

    // const photoUrl = id
    //   ? `${
    //       process.env.REACT_APP_API_URL
    //     }/user/photo/${id}?${new Date().getTime()}`
    //   : DefaultProfile;

    return (
    <div>
      <Menu/>
      <div class="split left">
        <div class="centered">
          <div  className="container">
          <h2 className="mt-5 mb-5">Create a new group</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          {this.newGroupForm(name, location, tags, about)}
          </div>
        </div>
      </div>
      <div class="split right">
        <div class="centered">
        </div>
      </div>  
    </div>
    );
  }
}

export default NewGroup;
