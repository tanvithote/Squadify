import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { singleEvent, update } from "./apiEvent";
import DefaultPost from "../images/tea.png";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

class EditGroup extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      location: "",
      description: "",
      tags: [],
      eventdate: new Date(),
      starttime: new Date(),
      endtime: new Date(),
      error: "",
      redirectToEvent: false,
      fileSize: 0
    };
  }

  init = (eventId,token) => {
    singleEvent(eventId,token).then(data => {
      if (data.error) {
        console.log(data.error);
        this.setState({ redirectToEvent: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          description: data.description,
          location:data.location,
          tags: data.tags,
          eventdate: data.eventdate,
          starttime: data.starttime,
          endtime: data.endtime,
          photo: data.photo,
          error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.eventData = new FormData();
    // console.log("user id from route params:", this.props.match.params.userId);
    const token = isAuthenticated().token;
    const eventId = this.props.match.params.eventId;
    this.state.id = eventId;
    this.init(eventId,token);
  }

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
    if(this.eventData.get("eventdate")===null){
      this.eventData.set("eventdate",this.state.eventdate);
    }
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

  editGroupForm = (
    id,
    name,
    description,
    location,
    eventdate,
    starttime,
    endtime,
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
        <label className="text-muted">Description</label>
        <input
          onChange={this.handleChange("description")}
          type="text"
          className="form-control"
          value={description}
        ></input>
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
        Update Event Information
      </button>
      <Link to={`/event/${id}`} className="btn btn-raised btn-info ml-3">
        Cancel Editing
      </Link>
    </form>
  );

  

  clickSubmit = event => {
    event.preventDefault();

    if (this.isValid()) {
      const eventId = this.state.id;
      const token = isAuthenticated().token;

      update(eventId, token, this.eventData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          // console.log("New Post: ", data);
          this.setState({
            name: "",
            description: "",
            location:"",
            eventdate:"",
            starttime:"",
            endtime:"",
            tags: [],
            photo: "",
            error: "",
            redirectToEvent: true
          });
        }
      });
    }
  };

  isValid = () => {
    const { name, description, fileSize } = this.state;

    if (fileSize > 100000) {
      this.setState({ error: "File size should be less than 100 KB." });
      return false;
    }

    if (name.length === 0) {
      this.setState({ error: "Title is required." });
      return false;
    }

    if (description.length === 0) {
      this.setState({ error: "Body is required." });
      return false;
    }
    return true;
  };

  render() {
    const { id, name, description, location, eventdate, starttime, endtime, tags, redirectToEvent, error } = this.state;

    // const tagsString = tags.join(", ");
    // console.log(tagsString);

    // const photoUrl = id
    //   ? `${
    //       process.env.REACT_APP_API_URL
    //     }/group/photo/${id}?${new Date().getTime()}`
    //   : DefaultPost;

    if (redirectToEvent) {
        return <Redirect to={`/event/${id}`} />;
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

        {this.editGroupForm(id, name, description, location, eventdate, starttime, endtime, tags)}
      </div>
    );
  }
}

export default EditGroup;
