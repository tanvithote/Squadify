export const create = (userId, groupId, token, event) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/new/${userId}/${groupId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: event
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const list = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/events`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const singleEvent = (eventId,token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const listEventByGroup = (groupId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/events/by/${groupId}`, {
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

export const remove = (eventId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
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

export const update = (eventId, token,event) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
      // There is no "Content-Type because it's form data"
    },
    body: event
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const attendEvent = (userId, token, eventId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/attend/${eventId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId: userId, eventId: eventId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const notAttendEvent = (userId, token, eventId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/notAttend/${eventId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId: userId, event: eventId })
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

// export const listByTag = tag => {
//   //   return fetch(`${process.env.REACT_APP_API_URL}/groups/search/${tag}`, {
//   return fetch(`${process.env.REACT_APP_API_URL}/groups/search/${tag}`, {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     }
//   })
//     .then(response => {
//       return response.json();
//     })
//     .catch(err => console.log(err));
// };
