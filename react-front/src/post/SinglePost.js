import React, { Component } from "react";
import { singlePost } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import DefaultPost from "../images/tea.jpg";
import { isAuthenticated } from "../auth";
import DeletePost from "./DeletePost";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToPosts: false
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ post: data });
      }
    });
  };

  renderPost = post => {
    const posterId = post.postedBy ? `/user/{post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";
    const userId = post.postedBy ? post.postedBy._id : " Unknown";

    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.title}
          onError={i => (i.target.src = `${DefaultPost}`)}
          className="img-thumbnail mb-3"
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
        />
        <p className="card-text">{post.body}</p>
        <br />
        <div class="card-footer text-muted">
          <p>
            Posted by <Link to={`${posterId}`}>{posterName} </Link>
            on {new Date(post.created).toDateString()}
          </p>
          <div className="d-inline-block">
            {isAuthenticated().user && isAuthenticated().user._id === userId && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-info btn-sm mr-3"
                >
                  Edit post
                </Link>
                <DeletePost postId={post._id}/>
              </>
            )}
            <Link to={`/posts`} className="btn btn-raised btn-primary btn-sm">
              Back to all posts
            </Link>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToPosts } = this.state;

    if (redirectToPosts) {
      return <Redirect to={`/posts`} />;
    }

    return (
      <div className="container">
        <h2 className="display-2 mt-5 ml-3">{post.title}</h2>
        {this.renderPost(post)}
      </div>
    );
  }
}

export default SinglePost;
