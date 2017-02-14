import axios from 'axios';
import { browserHistory } from 'react-router';

/* -----------------    ACTIONS     ------------------ */

const INITIALIZE = 'INITIALIZE_USERS';
const CREATE     = 'CREATE_USER';
export const REMOVE = 'REMOVE_USER';
const UPDATE     = 'UPDATE_USER';
const LOGIN = 'LOGIN_USER';
const SIGNUP = 'SIGN_UP_USER';
const LOGOUT = 'LOG_OUT_YO';


/* ------------   ACTION CREATORS     ------------------ */

const init  = users => ({ type: INITIALIZE, users });
const create = user  => ({ type: CREATE, user });
const remove = id    => ({ type: REMOVE, id });
const update = user  => ({ type: UPDATE, user });
const login = userObj => ({ type: LOGIN, userObj });
const signup = user => ({type: SIGNUP, user });
const logout = user => ({type: LOGOUT, user });

/* ------------       REDUCER     ------------------ */

export default function reducer (users = [], action) {
  switch (action.type) {

    case INITIALIZE:
      return action.users;

    case CREATE:
      return [action.user, ...users];

    case REMOVE:
      return users.filter(user => user.id !== action.id);

    case UPDATE:
      return users.map(user => (
        action.user.id === user.id ? action.user : user
      ));

    case LOGIN:
      console.log('here');
      return action.userObj;

    case SIGNUP:
      console.log('reducer sign up')
      return action.user;

    case LOGOUT:
      console.log('well we logged out')
      return users;

    default:
      return users;
  }
}


/* ------------       DISPATCHERS     ------------------ */

export const fetchUsers = () => dispatch => {
  axios.get('/api/users')
    .then(res => dispatch(init(res.data)));
};

// optimistic
export const removeUser = id => dispatch => {
  dispatch(remove(id));
  axios.delete(`/api/users/${id}`)
    .catch(err => console.error(`Removing user: ${id} unsuccesful`, err));
};

export const addUser = user => dispatch => {
  axios.post('/api/users', user)
    .then(res => dispatch(create(res.data)))
    .catch(err => console.error(`Creating user: ${user} unsuccesful`, err));
};

export const updateUser = (id, user) => dispatch => {
  axios.put(`/api/users/${id}`, user)
    .then(res => dispatch(update(res.data)))
    .catch(err => console.error(`Updating user: ${user} unsuccesful`, err));
};

export const loginUser = (userinfo) => dispatch => {
  axios.post(`/login`, userinfo)
    .then(res => dispatch(login(res.data)))
    .catch(err => console.error(`Logging in user failed`, err));
};

export const signUp = (userInfo) => dispatch => {
  axios.post('/api/users', userInfo)
    .then(res => dispatch(signup(res.data)))
    .catch(err => console.error('Signup failed', err));
}

export const logOut = () => dispatch => {
  axios.delete('/logout')
    .then(res => {
      dispatch(logout());
      browserHistory.replace('/');
    })
    .catch(err => console.error('ya blew it', err));
}

// app.post('/login', function(req, res, next) {
//   User.findOne({
//     where: req.body
//   })
//   .then((user) => {
//     if (!user) {
//       res.sendStatus(401);
//     }
//     else {
//       req.session.userId = user.id;
//       res.sendStatus(200);
//     }
//   })
//   .catch(next);
// });
