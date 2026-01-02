import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

function Signup() {
    const [values, setValues] = useState({
        name: '',
        mobile: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const history = useHistory();

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        // Basic input validation
        if (name === 'name' && !value.trim()) {
            setErrors(prev => ({ ...prev, name: 'Name is required' }));
        } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            setErrors(prev => ({ ...prev, email: 'Invalid email address' }));
        } else if (name === 'mobile' && (!value.trim() || isNaN(value) || value.length !== 10)) {
            setErrors(prev => ({ ...prev, mobile: 'Mobile should be 10-digit integer' }));
        } else if (name === 'password' && (!value.trim() || !/(?=.*\d)(?=.*[A-Z]).{5,}/.test(value))) {
            setErrors(prev => ({ ...prev, password: 'Password should be at least 5 characters with one capital letter and one numerical digit' }));
        } else {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, mobile, password } = values;

        if (!name.trim()) {
            setErrors(prev => ({ ...prev, name: 'Name is required' }));
        } else if (!email.includes("@")) {
            setErrors(prev => ({ ...prev, email: 'Enter valid email' }));
        } else if (!mobile.trim() || isNaN(mobile) || mobile.length !== 10) {
            setErrors(prev => ({ ...prev, mobile: 'Mobile should be 10-digit integer' }));
        } else if (name === 'password' && (!password.trim() || !/(?=.*\d)(?=.*[A-Z])(?=.*[@#$]).{5,}/.test(password))) {
            setErrors(prev => ({ ...prev, password: 'Password should be at least 5 characters with one capital letter, one numerical digit, and one special character (@, #, or $)' }));
        }  else {
            const res = await fetch("/signupadd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, mobile, password
                })
            });

            if (res.ok) {
                const data = await res.json();
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    history.push("/login");
                }, 2000);
            } else {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                } else {
                    alert("Error occurred");
                }
            }
        }
    };

    return (
        <div className="position-relative">
            {showSuccess && (
                <div className="position-absolute top-0 start-50 translate-middle-x alert alert-success mt-3" role="alert">
                    Sign up successful!
                </div>
            )}
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' ,background:'gray'}}>
                <div className="bg-white p-4 rounded shadow" style={{ width: '400px' }}>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={values.name}
                                placeholder="Enter your name"
                                onChange={handleInput}
                            />
                            {errors.name && <p className="text-danger">{errors.name}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mobile">Mobile number</label>
                            <input
                                type="text"
                                className="form-control"
                                id="mobile"
                                name="mobile"
                                value={values.mobile}
                                placeholder="Enter mobile number"
                                onChange={handleInput}
                                title="Mobile should be a 10-digit integer"
                            />
                            {errors.mobile && <p className="text-danger">{errors.mobile}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={values.email}
                                placeholder="Enter your email"
                                onChange={handleInput}
                            />
                            {errors.email && <p className="text-danger">{errors.email}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={values.password}
                                placeholder="Enter your password"
                                onChange={handleInput}
                                title="Password should be at least 5 characters with one capital letter and one numerical digit and one special character (@, #, or $)"
                            />
                            {errors.password && <p className="text-danger">{errors.password}</p>}
                        </div>
                        <button type="submit" className="btn btn-success btn-block mb-3">Sign up</button>
                        <p className="text-center">Already have an account? <Link to="/" className="text-decoration-none">Login</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
