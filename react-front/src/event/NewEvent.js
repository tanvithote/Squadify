import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create, joinGroup } from "./apiEvent";
import { Redirect } from "react-router-dom";
import 'date-fns';
import DefaultPost from "../images/tea.jpg";
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';


class NewEvent extends Component {

  constructor() {
    super();
    this.state = {
      name: "",
      location: "",
      description: "",
      photo: "",
      error: "",
      user: {},
      group:"",
      tags: [],
      fileSize: 0,
      starttime: "",
      endtime:"" ,
      redirectToGroups: false
    };
  }

  componentDidMount() {
    this.eventData = new FormData();
    this.setState({ user: isAuthenticated().user});
  }

  isValid = () => {
    const { name, location, description, fileSize } = this.state;

    if (fileSize > 100000) {
      this.setState({ error: "File size should be less than 100 KB." });
      return false;
    }

    if (name.length === 0) {
      this.setState({ error: "Event name is required." });
      return false;
    }

    if (location.length === 0) {
      this.setState({ error: "Location is required." });
      return false;
    }

    if (description.length === 0) {
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
    this.eventData.set(passInValue, value);
    this.setState({ [passInValue]: value, fileSize: fileSize });


  };

  clickSubmit = event => {
    event.preventDefault();

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.eventData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          // console.log("New Post: ", data);
          this.setState({
            name: "",
            location: "",
            description: "",
            photo: "",
            error: "",
            tags: [],
            group:"",
            starttime: "",
            endtime:"",
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
  newEventForm = (name, location, tags, description ,starttime,endtime) => (

    <form >
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
        <label className="text-muted">Description</label>
        <textarea
          onChange={this.handleChange("description")}
          type="text"
          className="form-control"
          value={description}
        ></textarea>
      </div>
      <div className="form-group">
        <label className="text-muted">Location</label>
        <textarea
          onChange={this.handleChange("location")}
          type="text"
          className="form-control"
          value={location}
          placeholder="Bloomington, IN"
        ></textarea>
      </div>
      <div class="form-group">
      <label className="text-muted">starttime</label>
         <input
          onChange={this.handleChange("starttime")}
          type="text"
          className="form-control timepicker"
          value={endtime}
          placeholder="9:00 pm"
        ></input>
      </div>
      <div className="form-group">
        <label className="text-muted">endtime</label>
         <input
          onChange={this.handleChange("endtime")}
          type="text"
          className="form-control"
          value={endtime}
          placeholder="9:00 pm"
        ></input>
      </div>
      <div className="form-group">
        <label className="text-muted">Tags</label>
        <textarea
          onChange={this.handleChange("tags")}
          type="text"
          className="form-control"
          value={tags}
          placeholder="Swimming, FIFA, Coding"
        ></textarea>
      </div>
      <div className="form-group">
        <label className="text-muted">Upload a cover photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        ></input>
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Create Event
      </button>
    </form>
  );

  render() {
    const {
      name,
      location,
      description,
      photo,
      user,
      group,
      tags,
      error,
      starttime,
      endtime,
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
      <div className="container">
        <h2 className="mt-5 mb-5">Create a new Event for Group </h2>
        {error && <div className="alert alert-danger">{error}</div>}

        {this.newEventForm(name, location, tags, description,starttime,endtime)}
      </div>
    );
  }
}

export default NewEvent;
