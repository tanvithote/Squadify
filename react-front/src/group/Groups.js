import React, { Component } from "react";
import { list } from "./apiGroup";
import { Link } from "react-router-dom";
import DefaultPost from "../images/tea.jpg";

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
            <div className="card col-md-12 mb-2" key={i}>
              <div className="card-body">
                <img
                  src={`${process.env.REACT_APP_API_URL}/group/photo/${group._id}`}
                  alt={group.name}
                  onError={i => (i.target.src = `${DefaultPost}`)}
                  className="img-thumbnail mb-3"
                  style={{ height: "200px", width: "300px" }}
                />
                <h5 className="card-title">{group.name}</h5>
                <p className="card-text">{group.about.substring(0, 100)}</p>
                <br />
                <div class="card-footer text-muted">
                  <p>
                    Created by <Link to={`${creatorId}`}>{creatorName} </Link>
                    on {new Date(group.created).toDateString()}
                  </p>
                  <Link
                    to={`/group/${group._id}`}
                    className="btn btn-raised btn-primary btn-sm"
                  >
                    Read More About This Group
                  </Link>
                </div>
              </div>
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
          <form>
            <input
              type="text"
              placeholder="Search.."
              name="search"
              onChange={this.queryChange}
              onSubmit={this.handleSearch}
            />
            {/* <button onClick={handleSearch}>
              {/* <i class="fa fa-search"></i> */}
            {/* </button> */}
            <Link to={`/groups/search/${query}`}>
              <i class="fa fa-search"></i>
            </Link>
          </form>
        </div>
        <div className="container fluid">
          <h2 className="mt-5 mb-5">All Groups</h2>
          {this.renderGroups(groups)}
        </div>
      </>
    );
  }
}

export default Groups;