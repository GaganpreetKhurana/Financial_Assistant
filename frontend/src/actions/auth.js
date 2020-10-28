import {
  LOGIN_START,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  SIGNUP_START,
  SIGNUP_FAILURE,
  SIGNUP_SUCCESS,
  AUTHENTICATE_USER,
  LOG_OUT,
  CLEAR_AUTH_STATE,
  FORGOT_START,
  FORGOT_FAILURE,
  FORGOT_SUCCESS,
  SET_USER_DETAILS,
} from "./actionTypes";
// @ts-ignore
import jwt_decode from "jwt-decode";

//Form Body
//converting data in format variable1=key1&variable2=key2...
//this needs to be checked with django api if this format not accepted then send json object
function getFormBody(params) {
  let FormBody = [];
  for (let property in params) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(params[property]);
    FormBody.push(encodedKey + "=" + encodedValue);
  }
  return FormBody.join("&");
}

//login

//to start login and disable login button to prevent the server from numerous request from same user
export function startLogin() {
  return {
    type: LOGIN_START,
  };
}

//display login failed message
export function loginFailed(errormsg) {
  return {
    type: LOGIN_FAILURE,
    error: errormsg,
  };
}

//display login success message
export function loginSuccess(successmsg, username, email, user_id) {
  return {
    type: LOGIN_SUCCESS,
    username,
    email,
    user_id,
    success: successmsg,
  };
}

//send login request to backend
export function login(username, password) {
  return (dispatch) => {
    var success = false;
    dispatch(startLogin());
    const url = "/api/token/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: getFormBody({
        username: username,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          success = true;
          return response.json();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (success) {
          localStorage.setItem("DONNA", data.token);
          const user = jwt_decode(data.token);
          dispatch(
            loginSuccess(
              "Login Successfull",
              user.username,
              user.email,
              user.user_id
            )
          );
        } else {
          dispatch(loginFailed("Username or Password is Incorrect"));
        }
      });
  };
}

//signup

//disable signup button
export function startsignup() {
  return {
    type: SIGNUP_START,
  };
}
//signup failed message
export function signupFailed(errormsg) {
  return {
    type: SIGNUP_FAILURE,
    error: errormsg,
  };
}
//signup success message
export function signupSuccess(msg) {
  return {
    type: SIGNUP_SUCCESS,
    success: msg,
  };
}
//send signup details to backend
export function signup(email, password, confirmpassword, name, fname, lname) {
  return (dispatch) => {
    var success = false;
    dispatch(startsignup());
    const url = "/register";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: getFormBody({
        username: name,
        email,
        password,
        password_confirm: confirmpassword,
        first_name: fname,
        last_name: lname,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          success = true;
          return response.json();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (success) {
          dispatch(
            signupSuccess("SignUp successfull please LogIn to continue")
          );
          return;
        }
        if (data.username) {
          dispatch(signupFailed("User with this UserName already exists"));
        } else if (data.password) {
          dispatch(
            signupFailed("Password and Confirm Password fields Don't match")
          );
        } else {
          dispatch(signupFailed("Signup Failed Please Try Again"));
        }
      });
  };
}

//authenticate and logout

//set the user details in redux store for later use
export function authenticateUser(user) {
  return {
    type: AUTHENTICATE_USER,
    username: user.username,
    email: user.email,
    user_id: user.user_id,
  };
}
//remove the user details from redux store
export function logoutUser() {
  return {
    type: LOG_OUT,
  };
}
//clear the success and errror messages on unmounting the component
export function clearAuth() {
  return {
    type: CLEAR_AUTH_STATE,
  };
}

//FORGOT PASSWORD
export function startForgot() {
  return {
    type: FORGOT_START,
  };
}
//display forgot failed msg
export function forgotFailed(errormsg) {
  return {
    type: FORGOT_FAILURE,
    error: errormsg,
  };
}
//forgot success msg
export function forgotSuccess(successmsg) {
  return {
    type: FORGOT_SUCCESS,
    success: successmsg,
  };
}

//send email to backend when user clicks on forgot password
export function forgot(email) {
  return (dispatch) => {
    dispatch(startForgot());
    var success = false;
    const url = "/api/password_reset/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: getFormBody({ email }),
    })
      .then((response) => {
        if (response.status === 200) {
          success = true;
          return response.json();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (success) {
          dispatch(
            forgotSuccess("Reset Link Sent to your Registered Email Id")
          );
        } else if (data.email) {
          dispatch(forgotFailed(data.email));
        }
      });
  };
}

//fetch user

//fetch user details from backend
export function userDetails(email, lname, fname) {
  return {
    type: SET_USER_DETAILS,
    email,
    lname,
    fname,
  };
}
export function fetchUser() {
  return (dispatch) => {
    var success = false;
    const url = `/user`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("DONNA")}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          success = true;
          return response.json();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (success) {
          dispatch(
            userDetails(data[0].email, data[0].last_name, data[0].first_name)
          );
          return;
        } else {
          return;
        }
      });
  };
}

//update profile

//edit user profile
export function updateProfile(email, fname, lname, uname) {
  return (dispatch) => {
    dispatch(startForgot());
    var success = false;
    const url = "/edit_user";
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${localStorage.getItem("DONNA")}`,
      },
      body: getFormBody({
        first_name: fname,
        last_name: lname,
        username: uname,
        email: email,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          success = true;
          return response.json();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (success) {
          localStorage.setItem("DONNA", data.token);
          const user = jwt_decode(data.token);
          dispatch(
            authenticateUser({
              username: user.username,
              email: user.email,
              user_id: user.user_id,
            })
          );
          dispatch(userDetails(email, lname, fname));
          dispatch(forgotSuccess(data.message));
          return;
        } else {
          if (data.message) {
            dispatch(forgotFailed(data.message));
            return;
          } else {
            dispatch(
              forgotFailed(
                "Sorry Profeturn;ile updation Failed..Plz try again!!!"
              )
            );
            return;
          }
        }
      })
      .catch(() =>
        dispatch(
          forgotFailed("Sorry Profile updation Failed..Plz try again!!!")
        )
      );
  };
}
//update password
export function updatePassword(old, new_password, confirm_password) {
  return (dispatch) => {
    dispatch(startForgot());
    var success = false;
    const url = "/change_password";
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${localStorage.getItem("DONNA")}`,
      },
      body: getFormBody({
        old_password: old,
        new_password: new_password,
        password_confirm: confirm_password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          success = true;
          return response.json();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (success) {
          console.log(data);
          dispatch(forgotSuccess("Profile updated successfully !!!!"));
          return;
        } else {
          if (data.old_password) {
            dispatch(
              forgotFailed("Old Password does not match..Plz try again!!!")
            );
            return;
          } else {
            dispatch(
              forgotFailed("Sorry Profile updation Failed..Plz try again!!!")
            );
            return;
          }
        }
      })
      .catch(() =>
        dispatch(
          forgotFailed("Sorry Profile updation Failed..Plz try again!!!")
        )
      );
  };
}
