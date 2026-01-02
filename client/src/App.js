// // App.js
// import './App.css';
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
// import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"

// import { Switch, Route, Redirect } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Home from './components/Home';
// import Register from './components/Register';
// import Edit from './components/Edit';
// import Details from './components/Details';
// import Graph from './components/Graph';

// import Login from './components/Login.js';
// import Signup from './components/Signup.js';
// // Import the Logout component

// function App() {
//   const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === true); // State to track user authentication status

//   useEffect(() => {
//     // Check if the user is already logged in from localStorage
//     const isLoggedIn = localStorage.getItem("loggedIn");
//     console.log("localStorage loggedIn:", isLoggedIn); // Print localStorage value to console
//     if (isLoggedIn === "true") {
//       setLoggedIn(true);
//     }
//   }, []);

//   // Function to handle user login
//   const handleLogin = () => {
//     // Perform your login logic here
//     setLoggedIn(true);
//     localStorage.setItem("loggedIn", true); // Store the login status in localStorage
//   };

//   // Function to handle user logout
//   const handleLogout = () => {
//     // Perform your logout logic here
//     setLoggedIn(false);
//     localStorage.removeItem("loggedIn"); // Remove the login status from localStorage
//   };

//   // Define a higher-order component to protect routes that require authentication
//   const PrivateRoute = ({ component: Component, ...rest }) => (
//     <Route
//       {...rest}
//       render={(props) =>
//         loggedIn ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/" />
//         )
//       }
//     />
//   );

//   return (
//     <>

//       <Switch>
//         {/* <Route exact path="/" render={() => loggedIn ? <Redirect to="/home" /> : <Login onLogin={handleLogin} />} /> */}
//         <Route exact path="/" component={Login} />
//         <Route exact path="/signup" component={Signup} />

//         <PrivateRoute exact path="/home" component={Home} />
//         <PrivateRoute exact path="/register" component={Register} />
//         <PrivateRoute exact path="/graph" component={Graph} />
//         <PrivateRoute exact path="/edit/:id" component={Edit} />
//         <PrivateRoute exact path="/view/:id" component={Details} />
//       </Switch>
//     </>
//   );
// }

// export default App;

// App.js
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import { Switch, Route, Redirect } from "react-router-dom";

import Home from './components/Home';
import Register from './components/Register';
import Edit from './components/Edit';
import Details from './components/Details';
import Graph from './components/Graph';

import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <>
      <Switch>

        {/* 👇 ROOT PE AATE HI HOME */}
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>

        {/* 👇 HOME (NO LOGIN REQUIRED) */}
        <Route exact path="/home" component={Home} />

        {/* 👇 OTHER PAGES (ALL PUBLIC FOR NOW) */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/graph" component={Graph} />
        <Route exact path="/edit/:id" component={Edit} />
        <Route exact path="/view/:id" component={Details} />

        {/* 👇 WRONG URL */}
        <Redirect to="/home" />

      </Switch>
    </>
  );
}

export default App;