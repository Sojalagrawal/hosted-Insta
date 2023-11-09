import './App.css';
import Home from './screens/Home';
import Navbar from './components/Navbar';
import React,{useState} from 'react';


import {BrowserRouter,Routes,Route} from "react-router-dom";
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './screens/Profile';
import CreatePost from './screens/CreatePost';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from './components/context/LoginContext';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import MyfollowingPost from './screens/MyfollowingPost';


function App() {
  const [userLogin,setUserLogin]=useState(false);
  const[modalOpen,setModalOpen]=useState(false);
  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{setUserLogin,setModalOpen}}>
         <Navbar login={userLogin}/>
         <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route exact path="/profile" element={<Profile/>}/>
            <Route path="/createPost" element={<CreatePost/>}/>            
            <Route path="/profile/:userid" element={<UserProfile/>}/>            
            <Route path="/followingpost" element={<MyfollowingPost/>}/>            

         </Routes>
        <ToastContainer theme="dark"/>
        {modalOpen && <Modal setModalOpen={setModalOpen}/>}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
