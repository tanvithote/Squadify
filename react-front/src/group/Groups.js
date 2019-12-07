import React, { Component } from "react";
import { list } from "./apiGroup";
import { Link } from "react-router-dom";
import DefaultPost from "../images/tea.jpg";
import Menu from "../core/Menu";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Groups extends Component {
  constructor() {
    super();
    this.state = {
      groups: [],
      query: ""
    };
  }

  queryChange = evt => {
    this.setState({ query: evt.target.value });
    console.log(this.state.query);
  };

  handleSearch = () => {
    this.context.router.push(`/groups/search/${this.state.query}`);
  };

  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
        // console.log(data);
      } else {
        this.setState({ groups: data });
      }
    });
  }

  renderGroups = groups => {
    return (
      <div className="row">
        {groups.map((group, i) => {
          const creatorId = group.createdBy
            ? `/user/{group.createdBy._id}`
            : "";
          const creatorName = group.createdBy
            ? group.createdBy.name
            : " Unknown";

          return (
            <div className="col-md-4 col-xs-6 mb-2" key={i}>
              
                <div class="card bwm-card">
                  
                  <img
                    src={`${process.env.REACT_APP_API_URL}/group/photo/${group._id}`}
                    alt={group.name}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    className="card-img-top"
                    style={{ height: "200px", width: "350px" }}
                  />

                  <div class="card-block" style={{height:"30vh"}}>
                    <h6 class="card-subtitle">{group.name}</h6>
                    <h4 class="card-title">{group.about.substring(0, 100)}</h4>
                    <p class="card-text">
                      Created by <Link to={`${creatorId}`}>{creatorName} </Link>
                      on {new Date(group.created).toDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/group/${group._id}`}
                    className="btn btn-raised btn-info btn-sm text-center"
                  >
                    Read More About This Group
                  </Link>
                </div>
              {/* </Link> */}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { groups, query } = this.state;
    return (
      <>
        <div>
          <Menu/>
          <div className="container fluid mt-5 ml-5">
          
          </div>
        
        <div className="container fluid">
        <Form className='info' inline style={{ justifyContent: 'center' }}>
          <form>
             <input
              type="text"
              placeholder="Search.."
              name="search"
              className="justify-content-left-info"
              onChange={this.queryChange}
              onSubmit={this.handleSearch}
            />
           {/* <button onClick={handleSearch}>
               <i class="fa fa-search"></i> 
             </button> */}
            <Link to={`/groups/search/${query}`}>
            <Button variant="outline-info">Search
        </Button>
            </Link> 
          </form>
          </Form>
          <span>
            <h2 className="mt-5 mb-5">All Groups</h2>
          </span>
          {this.renderGroups(groups)}
        </div>
        </div>
      </>
    );
  }
}

export default Groups;
