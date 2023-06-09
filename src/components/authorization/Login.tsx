import { observer } from "mobx-react-lite"
import socket from "../../store/socket";
import { useState, useEffect } from 'react';
import chats from "../../store/chats";
import { useNavigate } from "react-router-dom";
// interface Props{
//     socket: WebSocket | null,
// }

interface LoginData{
  username: string,
  password: string,
}

interface Token{
  token: string,
}

function Login(){

    const [loginData, setLoginData] = useState<LoginData>({username:"", password:""});
    const navigate = useNavigate()

    function saveUserData(username: string, token: Token){
      const localStorage = window.localStorage
      localStorage.setItem("userData", JSON.stringify({username: username, token: token}))
    }

    function clearUserData(){
      const localStorage = window.localStorage;
      localStorage.setItem("userData", "");
    }

    async function login(){
      let res = await fetch("http://localhost:5000/auth/login", {
        method:"POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(loginData)
      })
      let {token, avatar, message} = await res.json()
      if(res.status != 200){
        alert(message);
        return false
      }
      socket.setAvatar(avatar);
      socket.setTocken(token);
      socket.username = loginData.username;
      saveUserData(loginData.username, token);
      setLoginData({username:"", password:""})
      console.log(socket.avatar);
      navigate('../app', { replace: false })
    }

    async function logoff() {
      socket.setToDefault();
      chats.setToDefault();
      clearUserData();
    }

    return(
      <div className="">
        <div className="auth w-fit h-fit flex flex-col border border-solid border-black p-4">
          <h1 className="text-center">Login</h1>
          {(!socket.token)
          ?
          <div className="flex flex-col">
            <input placeholder="Login" value={loginData.username} onChange={(e)=>setLoginData({...loginData, username:e.target.value})} className="border border-solid border-black mb-1" type="text"/>
            <input placeholder="Password" value={loginData.password} onChange={(e)=>setLoginData({...loginData, password:e.target.value})} className="border border-solid border-black mb-1" type="password"/>
            <button onClick={login} className="bg-cyan-300">Login</button>
          </div>
          :<div className="h-fit w-fit flex flex-col items-center">
            <h1>Already logged in as {socket.username}</h1>
            <button className="bg-blue-500 w-fit" onClick={logoff}>Log off</button>
          </div>
          }
          </div>
      </div> 
    )
}

const LoginObserver = observer(Login);

export default LoginObserver;