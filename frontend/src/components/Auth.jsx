import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const cookie = new Cookies();

const initialForm = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  confirmPassword: '',
  gender: 0,
  avatar: null,
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
    const { username} = form;
    let avatarUrl = form.avatarUrl;
    if (isSignup&&form.avatar) {
      var formData = new FormData();
      formData.append("images", form.avatar);
      const imgUploadRes = await axios.post('/user/media/images/uploads', formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (imgUploadRes.data.error.status == 500) {
        alert(imgUploadRes.data.error.message);
      }
      console.log(imgUploadRes.data);
      avatarUrl = imgUploadRes.data.data.images[0].path
      setForm({...form, ["avatarUrl"]:avatarUrl})
    }

    const response = await axios.post(`/auth/${isSignup ? 'signup' : 'signin'}`, {
      username, 
      password: form.password, 
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      avatarUrl: avatarUrl,
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
    cookie.set('user', response.data.data.user);
    cookie.set('token', token);
    cookie.set('userId', id);
    cookie.set('hashedPassword', password);
    cookie.set('firstName', firstName);
    cookie.set('lastName', lastName);
    if (avatarUrl) cookie.set('avatarUrl', avatarUrl);
    window.location.reload();
  }

  const handleChange = (e) => {
    setForm({...form, [e.target.name]:e.target.value});

  }

  const switchMode = () => {
    if (!isSignup) {
      document.getElementById('username').value = "";
      document.getElementById('password').value = "";
    }
    setIsSignup((prevIsSignup) => !prevIsSignup);
  }

  return (
    <div className='mx-auto' style={{width: "75%"}} id='auth_form-container'>
      <h3 className='text-info'>{isSignup ? 'Sign Up' : 'Sign In'}</h3>
      <div className='mx-auto'>
        <Form onSubmit={handleSubmit}>
          {isSignup && (
            <Row className='g-0'>
              <Col className='pe-1'>
                <Form.Group id='auth_form-container-fields-content-Form.Control'>
                  <Form.Label htmlFor="firstName">First Name</Form.Label>
                  <Form.Control
                    name='firstName'
                    type="text"
                    placeholder='First Name'
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group id='auth_form-container-fields-content-Form.Control'>
                  <Form.Label htmlFor="lastName">Last Name</Form.Label>
                  <Form.Control
                    name='lastName'
                    type="text"
                    placeholder='Last Name'
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name='username'
              type="text"
              placeholder='Username'
              pattern={isSignup? '[A-Za-z0-9_]*' : "*"}
              onChange={handleChange}
              autoComplete="off"
              required
              title='Use character A-Z, a-z, or _'
            />
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              name='password'
              type="password"
              placeholder='Password'
              onChange={handleChange}
              autoComplete="off"
              minLength={isSignup? 8 : 1}
              required
            />
          </Form.Group>            
          {isSignup && (
            <div id='auth_form-container-fields-content-Form.Control'>
              <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
              <Form.Control
                name='confirmPassword'
                type="password"
                placeholder='Confirm Password'
                onChange={(e) => {
                  if (e.target.value != document.getElementById('password').value) {
                    e.target.setCustomValidity("Not matched!");
                  } else {
                    e.target.setCustomValidity("");
                  }
                  handleChange(e);
                }}
                required
              />
            </div>
          )}
          {isSignup && (
            <>
              <div>Let us know more about you, or just hit sign up below.</div>
              <Form.Group id='auth_form-container-fields-content-Form.Control'>
                <Form.Label htmlFor="gender">Gender</Form.Label>
                <Form.Select name="gender" onChange={handleChange}>
                  <option disabled>Choose here</option>
                  <option value={1}>Male</option>
                  <option value={2}>Female</option>
                  <option value={3}>Non-binary</option>
                  <option value={0}>I prefer not to tell</option>
                </Form.Select>
              </Form.Group>
              <Form.Group id='auth_form-container-fields-content-Form.Control'>
                <Form.Label htmlFor="avatar">Profile picture</Form.Label>
                <Form.Control
                  name='avatar'
                  type="file" placeholder="Avatar" size="sm" accept="image/*"
                  onChange={(e)=>setForm({...form, avatar:e.target.files[0]})}
                />
              </Form.Group>
              <Row className='g-0'>
                <Col className='pe-1'>
                  <div id='auth_form-container-fields-content-Form.Control'>
                    <Form.Label htmlFor="dob">Date Of Birth</Form.Label>
                    <Form.Control
                      name='dob'
                      type="date"
                      value='2000-01-01'
                      onChange={handleChange}
                    />
                  </div>
                </Col>
                <Col>
                  <div id='auth_form-container-fields-content-Form.Control'>
                    <Form.Label htmlFor="mobile">Phone Number</Form.Label>
                    <Form.Control
                      name='mobile'
                      type="tel"
                      onChange={handleChange}
                    />
                  </div>
                </Col>  
              </Row>
              <div id='auth_form-container-fields-content-Form.Control'>
                <Form.Label htmlFor="email">Email Address</Form.Label>
                <Form.Control
                  name='email'
                  type="email"
                  placeholder='Email Address'
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <div>
              <Button variant="primary" type="submit" className='mt-2 me-0'>{isSignup ? "Sign Up" : "Sign In"}</Button>
          </div>            
        </Form>
        <div className="auth__form-container_fields-account">
          <p>
            {isSignup ? 
              "Already have an account?" : 
              "Don't have an account?"
            }
            <span onClick={switchMode} className="ms-2 text-primary" id='switch_mode'>
              {isSignup ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth;