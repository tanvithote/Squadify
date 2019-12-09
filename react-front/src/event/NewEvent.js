import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create, attendEvent } from "./apiEvent";
import { singleGroup } from "../group/apiGroup";
import { Redirect } from "react-router-dom";
import "date-fns";
import DefaultPost from "../images/tea.png";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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
      group: {},
      tags: [],
      fileSize: 0,
      eventdate: new Date(),
      starttime: new Date(),
      endtime: new Date(),
      redirectToGroups: false
    };
  }

  componentDidMount() {
    this.eventData = new FormData();
    this.setState({ user: isAuthenticated().user });
    this.groupId = this.props.match.params.groupId;
    this.setState({ group: this.groupId });
    singleGroup(this.groupId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          group: data
        });
      }
    });
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

  handleDateChange = date => {
    this.setState({ eventdate: date });
    this.eventData.set("eventdate", date);
  };

  handleStartTimeChange = time => {
    // console.log(new Date(this.eventData.get("eventdate")));
    // console.log(time.toString().substring(4, 15));
    let dateString = this.eventData.get("eventdate").toString().substring(4, 15);
    let timeString1 = time.toString().substring(0, 4).concat(dateString);
    let timeString2 = time.toString().substring(15);
    let eventTime = timeString1.concat(timeString2);
    this.setState({ starttime: new Date(eventTime) });
    this.eventData.set("starttime", new Date(eventTime));
  };

  handleEndTimeChange = time => {
    let dateString = this.eventData.get("eventdate").toString().substring(4, 15);
    let timeString1 = time.toString().substring(0, 4).concat(dateString);
    let timeString2 = time.toString().substring(15);
    let eventTime = timeString1.concat(timeString2);
    this.setState({ endtime: new Date(eventTime) });
    this.eventData.set("endtime", new Date(eventTime));
  };

  clickSubmit = event => {
    event.preventDefault();

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const groupId = this.props.match.params.groupId;
      const token = isAuthenticated().token;

      create(userId, groupId, token, this.eventData).then(data => {
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
            eventdate: new Date(),
            starttime: new Date(),
            endtime: new Date(),
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
  newEventForm = (
    name,
    location,
    tags,
    description,
    starttime,
    endtime,
    eventdate
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
      <div className="form-group">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container>
            <KeyboardDatePicker
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="eventdate"
              label="Event Date "
              value={eventdate}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Start Time For Event "
              value={starttime}
              onChange={this.handleStartTimeChange}
              KeyboardButtonProps={{
                "aria-label": "change time"
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="End Time For Event"
              value={endtime}
              onChange={this.handleEndTimeChange}
              KeyboardButtonProps={{
                "aria-label": "change time"
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
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
      <button onClick={this.clickSubmit} className="btn btn-raised btn-info">
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
      eventdate,
      starttime,
      endtime,
      redirectToGroups
    } = this.state;

    if (redirectToGroups) {
      // return <Redirect to={`/user/${user._id}`} />;
      return <Redirect to={`/group/${this.state.group._id}`} />;
    }

    // const photoUrl = id
    //   ? `${x
    //       process.env.REACT_APP_API_URL
    //     }/user/photo/${id}?${new Date().getTime()}`
    //   : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">
          Create a new Event for Group {this.state.group.name}
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}

        {this.newEventForm(
          name,
          location,
          tags,
          description,
          starttime,
          endtime,
          eventdate
        )}
      </div>
    );
  }
}

export default NewEvent;
