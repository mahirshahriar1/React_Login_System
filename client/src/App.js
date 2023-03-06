import './App.css';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';


function App() {

  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");
  const [color, setColor] = useState("red");

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post('http://localhost:3001/register', {
      username: usernameReg,
      password: passwordReg
    }).then((response) => {
      alert(response.data.message);
    });
  };

  const login = () => {

    Axios.post('http://localhost:3001/login', {
      username: username,
      password: password
    }).then((response) => {
      // console.log(response);
      if (response.data.message) {
        setLoginStatus(response.data.message);
        setColor("red");
      } else {
        setLoginStatus(response.data[0].Username + " is logged in");
        setColor("green");
      }
    });
  };

  useEffect(() => {
    Axios.get('http://localhost:3001/login').then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].Username + " is logged in");
        setColor("green");
      }
    });
  }, []);



  return (
    <div className="App">
      <div className="registration">
        <h1>Registration</h1>
        <label> Username </label>
        <input type="text" onChange={(e) => setUsernameReg(e.target.value)} />
        <label > Password </label>
        <input type="text" onChange={(e) => setPasswordReg(e.target.value)} />
        <button onClick={register} >Register</button>
      </div>


      <div className="login">
        <h1>Login</h1>

        <label> Username </label>
        <input type="text" placeholder="Username..."
          onChange={(e) => setUsername(e.target.value)} />

        <label > Password </label>
        <input type="text" placeholder="Password..."
          onChange={(e) => setPassword(e.target.value)} />

        <button onClick={login} >Login</button>
      </div>


      <h1 style={{ color }}>{loginStatus}</h1>
    </div>
  );
}

export default App;
