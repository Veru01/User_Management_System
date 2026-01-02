import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

import { jwtDecode } from "jwt-decode";

function Login() {
    const history = useHistory(); 

    const [values, setValues] = useState({
       
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({}); 
    const [loggedIn, setLoggedIn] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false); 

    useEffect(() => {
       
        const isLoggedIn = localStorage.getItem('loggedIn');
        if (isLoggedIn) {
            setLoggedIn(true);
            
            setTimeout(() => {
                setLoggedIn(false); 
            }); 
        }
    }, []);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev); // Toggle password visibility
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!errors.email && !errors.password) {
            fetch('/loginpg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            .then(res => res.json())
            .then(data => {
                if(data === "Success") {
                    localStorage.setItem('email', values.email);
                    setLoggedIn(true); 
                    localStorage.setItem('loggedIn', true); 
                    
                   
                    setTimeout(() => {
                        
                        history.push('/home'); 
                    }, 3000); 
                } else {
                    
                    setErrors({ password: "Incorrect password" });
                }
            })
            .catch(err => console.log(err));
        }
    };

    
    return (
        <div className="d-flex justify-content-center align-items-center" 
        style={{ 
            height: '100vh', 
            backgroundImage: `url(./img2.jpg)`, 
            backgroundSize: 'cover',
           
          }}
        
        >
            <div className="bg-white p-4 rounded shadow" style={{ width: '300px' }}>
                {!loggedIn ? (
                    <>
                        <h2 className="mb-4 text-center" >Sign-In</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor='email' className="fw-bold">Email</label>
                                <input type='email' className="form-control" name='email' value={values.email} onChange={handleInput} placeholder='Enter your email' />
                                {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>} {/* Display email error */}
                            </div>
                            <div className="mb-3">
                                <label htmlFor='password' className="fw-bold" >Password</label>
                                <div className="input-group">
                                    <input type={showPassword ? 'text' : 'password'} className="form-control" name='password' value={values.password} onChange={handleInput} placeholder='Enter your password' />
                                    <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon to toggle password visibility */}
                                    </button>
                                </div>
                                {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>} {/* Display password error */}
                            </div>
                            <button type='submit' className="btn btn-success btn-block mb-3">Continue</button>
                            <p style={{color:'white',background:'red'}}>Don't have an account? <Link to='/signup' style={{color:'white'}}>Create New</Link></p>
                            <div>
                            <GoogleOAuthProvider clientId="775228519335-g89t81aarvq95o52gme5lpm4g6rkeah7.apps.googleusercontent.com">
                            <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                const decoded = jwtDecode(credentialResponse.credential);
                                console.log(decoded);
                                history.push('/home');
                               
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            />
                                
                                </GoogleOAuthProvider>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="alert alert-success text-center" role="alert" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
                        Welcome, {values.email}!
                        <div style={{ width: '100%', height: '2px', backgroundColor: 'green', animation: 'greenLinePop 1s ease-out forwards' }}></div> {/* Add inline styles for green line pop */}
                    </div>
                )}
                
            </div>

        </div>
    );
}

export default Login;

