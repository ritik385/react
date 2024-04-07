import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import queryString from 'query-string'; // Import queryString for parsing

import NavBar from './component/navbar';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'; // Remove unused imports
import Home from './component/screen/home';
import Profile from './component/screen/profile';
import Signin from './component/screen/signin';
import Signup from './component/screen/signup';
import CreatePost from './component/screen/CreatePost';

import { reducer, initialState } from './reducers/userReducer';
import UserProfile from './component/screen/Userprofile';
import SubscribesUserPosts from './component/screen/SubscribesUserPosts'
export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: 'USER', payload: user });
      // navigate('/');
    }else if(location.pathname == '/signin' || location.pathname == '/signup'){
      return;
    }else{
      navigate('signup');
    }
  }, [navigate, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/myfollowerspost" element={<SubscribesUserPosts />} />
    </Routes>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
