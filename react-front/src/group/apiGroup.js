export const create = (userId, token, group) => {
  return fetch(`${process.env.REACT_APP_API_URL}/group/new/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: group
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const list = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/groups`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const singleGroup = groupId => {
  return fetch(`${process.env.REACT_APP_API_URL}/group/${groupId}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const listByUser = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/groups/by/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// Fetch the groups that this user has joined
export const groupsByUserJoined = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/groups/of/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const remove = (groupId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/group/${groupId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const update = (groupId, token, group) => {
  return fetch(`${process.env.REACT_APP_API_URL}/group/${groupId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
      // There is no "Content-Type because it's form data"
    },
    body: group
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const joinGroup = (userId, token, groupId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/group/join/${groupId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId: userId, groupId: groupId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const unjoinGroup = (userId, token, groupId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/group/unjoin/${groupId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId: userId, groupId: groupId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

//   export const comment = (userId, token, postId, comment) => {
//     return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
//       method: "PUT",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ userId: userId, postId: postId, comment: comment })
//     })
//       .then(response => {
//         return response.json();
//       })
//       .catch(err => console.log(err));
//   };

//   export const uncomment = (userId, token, postId, comment) => {
//     return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
//       method: "PUT",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ userId, postId, comment })
//     })
//       .then(response => {
//         return response.json();
//       })
//       .catch(err => console.log(err));
//   };

// export const listByTag = (tag) => {
//     return fetch(`${process.env.REACT_APP_API_URL}/groups/search/${tag}`, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json"
//       }
//     })
//       .then(response => {
//         return response.json();
//       })
//       .catch(err => console.log(err));
//   };

export const listByTag = tag => {
  //   return fetch(`${process.env.REACT_APP_API_URL}/groups/search/${tag}`, {
  return fetch(`${process.env.REACT_APP_API_URL}/groups/search/${tag}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
