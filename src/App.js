import {BrowserRouter, Routes, Route} from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import  Footer from "./Layout/Footer";
import  Header from "./Layout/Header";
import  Home from "./Component/Home";
import  PhotoDetails from "./Component/PhotoDetails";
import  User from "./Component/User";
import  Login from "./Auth/Login";
import  Register from "./Auth/Register";
import "./App.css";
import Verify from "./Auth/Verify";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/photo" element={<Home/>}/>
          <Route path="/photo/:photoid" element={<PhotoDetails/>}/>
          <Route path="/profile" element={<User/>}/>
          <Route path="/auth/login" element={<Login/>}/>
          <Route path="/auth/register" element={<Register/>}/>
          <Route path="/auth/active-account/:key"  element={<Verify/>}/>
          <Route path="auth/forgotPassword" element={<ForgotPassword/>}/>
          <Route path="/auth/resetPassword/:key" element={<ResetPassword/>} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;