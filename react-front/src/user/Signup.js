import React, { Component } from "react";
import { signup } from "../auth/index";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      tags: [],
      choosetags: [],
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
      password: password,
      tags: this.state.choosetags
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

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/getTags`)
      .then(res =>  res.json())
      .then((jsonData) =>{
        console.log(jsonData);
        this.setState({tags: jsonData});
        console.log(this.state);
      }
      )
   }

   putTags = (event) => {
    this.state.choosetags.push(event.currentTarget.textContent)
    console.log(this.state.choosetags);
  };

  addTags = () => {
    let tagList = []
    console.log("Pushing Tags")
    const styles =  {
      backgroundColor: 'blue',
      margin: '10px',
      color: 'white'
    }

    for(let i = 0; i<this.state.tags.length; i++)
      tagList.push(<Button  style={styles} onClick = {event => this.putTags(event)} color="blue"> {this.state.tags[i]["tagName"]} </Button>)
      console.log("Tags Pushed")
    return tagList
  }



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
      <div class = "form-group">
      <label className="text-muted">Choose Tags</label>
      <br/><br/>
      {this.addTags()}
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Sign Up
      </button>
    </form>
  );

  render() {
    const { name, email, password, error, open } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Sign Up</h2>
        {error && <div className="alter alert-danger mb-2">{error}</div>}
        {open && (
          <div className="alert alert-info">
            Sign up successfully. Please <Link to="/signin">Sign in</Link>.
          </div>
        )}
        {this.signupForm(name, email, password)}
      </div>
    );
  }
}

export default Signup;
