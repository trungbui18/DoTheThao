import React from "react";
import { Navigate } from "react-router-dom";
const PrivateRouteUser =({children})=> {
    const token =localStorage.getItem("token");
    if(!token){
        alert("Bạn cần đăng nhập");
        return <Navigate to="/loginUser" />
    }
    return children;
}
export default PrivateRouteUser;