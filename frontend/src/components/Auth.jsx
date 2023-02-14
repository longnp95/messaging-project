import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookie = new Cookies();

const initialForm = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  gender: 0,
  avatarUrl: '',
  dob: '',
  mobile: '',
  email: '',
}

const Auth = () => {  
  const [isSignup, setIsSignup] = useState(false);
  const [form,setForm] = useState(initialForm)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, avatarUrl} = form;

    const response = await axios.post(`/auth/${isSignup ? 'signup' : 'signin'}`, {
      username, 
      password: form.password, 
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      avatarUrl: form.avatarUrl,
      dob: form.dob,
      mobile: form.mobile,
      email: form.email
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
      return;
    }
    console.log(response.data.data);
    const {user: { 
      token, 
      id, 
      password, 
      firstName, 
      lastName } 
    } = response.data.data;
    cookie.set('token', token);
    cookie.set('userId', id);
    cookie.set('hashedPassword', password);
    cookie.set('firstName', firstName);
    cookie.set('lastName', lastName);
    if (avatarUrl) cookie.set('avatarUrl', avatarUrl);
    window.location.reload();
  }

  const handleChange = (e) => {
    setForm({...form, [e.target.name]:e.target.value})
  }

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  }

  return (
    <div id='auth_form-container'>
      <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
      <div id='auth_form-container-fields'>
        <div id='auth_form-container-fields-content'>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div id='auth_form-container-fields-content-input'>
                <label htmlFor="firstName">First Name</label>
                <input
                  name='firstName'
                  type="text"
                  placeholder='First Name'
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {isSignup && (
              <div id='auth_form-container-fields-content-input'>
                <label htmlFor="lastName">Last Name</label>
                <input
                  name='lastName'
                  type="text"
                  placeholder='Last Name'
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div id='auth_form-container-fields-content-input'>
              <label htmlFor="username">Username</label>
              <input
                name='username'
                type="text"
                placeholder='Username'
                onChange={handleChange}
                required
              />
            </div>
            <div id='auth_form-container-fields-content-input'>
              <label htmlFor="password">Password</label>
              <input
                name='password'
                type="password"
                placeholder='Password'
                onChange={handleChange}
                required
              />
            </div>
            {isSignup && (
              <div id='auth_form-container-fields-content-input'>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  name='confirmPassword'
                  type="password"
                  placeholder='Confirm Password'
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {isSignup && (
              <p>Let us know more about you, or just hit sign up below.</p>
            )}
            {isSignup && (
              <div id='auth_form-container-fields-content-input'>
                <label htmlFor="gender">Gender</label>
                <select name="gender" onChange={handleChange}>
                  <option value={0} selected disabled hidden>Choose here</option>
                  <option value={1}>Male</option>
                  <option value={2}>Female</option>
                  <option value={3}>Non-binary</option>
                  <option value={0}>I prefer not to tell</option>
                </select>
              </div>
            )}
            {isSignup && (
              <div id='auth_form-container-fields-content-input'>
                <label htmlFor="avatarUrl">Profile picture</label>
                <input
                  name='avatarUrl'
                  type="url"
                  placeholder='Profile picture URL'
                  onChange={handleChange}
                />
              </div>
            )}
            {isSignup && (
              <div id='auth_form-container-fields-content-input'>
                <label htmlFor="dob">Date Of Birth</label>
                <input
                  name='dob'
                  type="date"
                  value='2000-01-01'
                  onChange={handleChange}
                />
              </div>
            )}
            {isSignup && (
              <div id='auth_form-container-fields-content-input'>
                <label htmlFor="mobile">Phone Number</label>
                <input
                  name='mobile'
                  type="tel"
                  onChange={handleChange}
                />
              </div>
            )}
            {isSignup && (
              <div id='auth_form-container-fields-content-input'>
                <label htmlFor="email">Email Address</label>
                <input
                  name='email'
                  type="email"
                  placeholder='Email Address'
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_button">
                <button>{isSignup ? "Sign Up" : "Sign In"}</button>
            </div>            
          </form>
          <div className="auth__form-container_fields-account">
            <p>
              {isSignup ? 
                "Already have an account?" : 
                "Don't have an account?"
              }
              <span onClick={switchMode}>
                {isSignup ? 'Sign In' : 'Sign Up'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth;