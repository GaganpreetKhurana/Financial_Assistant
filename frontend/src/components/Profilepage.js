import React, {Component} from 'react';
import {connect} from "react-redux";
import {fetchUser,updateProfile,updatePassword} from '../actions/auth';
import {Redirect} from "react-router-dom";

class Profilepage extends Component {
    constructor(props){
        super(props);
        this.state = {
            fname: '',
            lname: '',
            email:'',
            uname:'',
            password: '',
            confirmPassword: '',
            editMode: false,
            oldpassword:''
          };
    }
    handleChange = (fieldName, val) => {
        this.setState({
          [fieldName]: val,
        });
      };

      handleSave = () => {
        var { password, confirmPassword,oldpassword, fname,lname,email ,uname} = this.state;
        //const { user } = this.props.auth;
        //call the edit dispatchers
        if(fname==='')
        {
          fname =this.props.auth.fname;
        }
        if(lname==='')
        {
          lname =this.props.auth.lname;
        }
        if(uname==='')
        {
          uname =this.props.auth.user.username;
        }
        if(email==='')
        {
          email = this.props.auth.email;
        }
        //console.log( password, confirmPassword,oldpassword, fname,lname,email,uname);

        this.props.dispatch(updateProfile(email, fname,lname,uname));
        if(oldpassword!=='' && password!=='' && confirmPassword!=='')
        {
        this.props.dispatch(updatePassword(oldpassword,password,confirmPassword));
        }
      };
    componentDidMount() {
        this.props.dispatch(fetchUser());

    }
    render() {
        const {auth} = this.props;
        const {lname,fname,email,isLoggedIn} = this.props.auth;
        const {error} = auth;
        const {username} = this.props.auth.user; 
        const { editMode } = this.state;
        //so that logged in user sees the profile page
        if (!isLoggedIn) {
          return <Redirect to="/details"/>;
        }
        return (
            <div className="settings">
            <div className="img-container">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSH4dcYWVFHFsz8M3Rsjpy2Hg6gQAmgbCIwWA&usqp=CAU"
                alt="user-dp"
              />
            </div>
    
            {error && <div className="alert error-dailog">{error}</div>}
            {error === false && (
              <div className="alert success-dailog">
                Successfully updated profile!
              </div>
            )}
            <div className="field">
              <div className="field-label">EMAIL</div>
              {editMode ? (
                <input
                  type="text"
                  placeholder={email}
                  onChange={(e) => this.handleChange('email', e.target.value)}
                />
              ) : (
                <div className="field-value">{email}</div>
              )}
            </div>
            <div className="field">
              <div className="field-label">Username</div>
              {editMode ? (
                <input
                  type="text"
                  placeholder={username}
                  onChange={(e) => this.handleChange('uname', e.target.value)}
                />
              ) : (
                <div className="field-value">{username}</div>
              )}
            </div>
            <div className="field">
              <div className="field-label">First Name</div>
              {editMode ? (
                <input
                  type="text"
                  placeholder={fname}
                  onChange={(e) => this.handleChange('fname', e.target.value)}
                />
              ) : (
                <div className="field-value">{fname}</div>
              )}
            </div>
            <div className="field">
              <div className="field-label">Last Name</div>
              {editMode ? (
                <input
                  type="text"
                  placeholder={lname}
                  onChange={(e) => this.handleChange('lname', e.target.value)}
                />
              ) : (
                <div className="field-value">{lname}</div>
              )}
            </div>
            {editMode && (
              <div className="field">
                <div className="field-label">Old password</div>
    
                <input
                  type="password"
                  placeholder="Old Password"
                  onChange={(e) =>
                    this.handleChange('oldpassword', e.target.value)
                  }
                  value={this.state.oldpassword}
                />
              </div>
            )}
            {editMode && (
              <div className="field">
                <div className="field-label">New password</div>
    
                <input
                  type="password"
                  placeholder="New Password"

                  onChange={(e) => this.handleChange('password', e.target.value)}
                  value={this.state.password}
                />
              </div>
            )}
    
            {editMode && (
              <div className="field">
                <div className="field-label">Confirm password</div>
    
                <input
                  type="password"
                  placeholder="Confirm Password"

                  onChange={(e) =>
                    this.handleChange('confirmPassword', e.target.value)
                  }
                  value={this.state.confirmPassword}
                />
              </div>
            )}
            
    
            <div className="btn-grp">
              {editMode ? (
                <button className="button save-btn" onClick={this.handleSave}>
                  Save
                </button>
              ) : (
                <button
                  className="button edit-btn"
                  onClick={() => this.handleChange('editMode', true)}
                >
                  Edit profile
                </button>
              )}
    
              {editMode && (
                <div
                  className="go-back"
                  onClick={() => this.handleChange('editMode', false)}
                >
                  Go back
                </div>
              )}
            </div></div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

export default connect(mapStateToProps)(Profilepage);