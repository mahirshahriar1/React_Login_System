import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import Admin from '../components/Admin'
import Mod from '../components/Mod'


export default function Main() {

  const [role, setRole] = useState("");

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get('http://localhost:3001/login').then((response) => {
      if (response.data.loggedIn === true) {
        setRole(response.data.user[0].role);
      }

    });
  }, []);


  return (
    console.log(role),
    (role === 'admin' && (
      <Admin />
    ))
    ||
    (role === 'mod' && (
      <Mod />
    ))


  )
}
