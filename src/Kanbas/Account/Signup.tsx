
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./reducer";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaStarOfLife } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setUsers } from "./usersReducer";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const [confirmPass, setConfirmPass] = useState("")
  const [submit, setSubmit] = useState(false)
  const [role, setRole] = useState("STUDENT")
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const { users } = useSelector((state:any)=> state.usersReducer)
   const fetchUsers = async () => {
     const users = await client.findAllUsers()
  
     dispatch(setUsers(users))
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const signup = async () => {
    setError("");
    if (confirmPass === user.password && user.username) { 
    try {
      const newIndex = users.length + 1;
      const userWithRole = { ...user, role, universityId: `${new Date().getFullYear()}${newIndex}`};
      const currentUser = await client.signup(userWithRole);
      dispatch(setCurrentUser(currentUser));
      navigate("/Kanbas/Account/Profile");
  
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }

  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  if (!users)  {
    return (<div>no enrollments</div>)
  }
  return (
    <div className="wd-signup-screen p-5" style={{width:"500px",position: "relative"}}>
      <h3>Sign up</h3>

      <div style={{position:"relative",display:"flex"}} className="mb-2">
      <button className={`btn btn-secondary me-2 ${role==="STUDENT" ? "active" : ""}`} style={{position:"relative", width:"100%"}} onClick={()=>setRole("STUDENT")}>Student</button>
      <button className={`btn btn-secondary ${role==="FACULTY" ? "active" : ""}`} style={{position:"relative", width:"100%"}} onClick={()=>setRole("FACULTY")}>Faculty</button>
      </div>

    {(role!=="") && 
    <>
      {/* <div id="required-field"><input value={user.universityId} onChange={(e) => setUser({ ...user, universityId: e.target.value })}
             className="wd-uniId form-control mb-2" placeholder={role==="STUDENT" ? "Student ID" : "Faculty ID"} /><FaStarOfLife className="required-star text-danger"/></div> */}

  <div id="required-field"><input value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
             className="wd-username form-control mb-2" placeholder="Username" /><FaStarOfLife className="required-star text-danger"/></div>

      <div id="required-field"><input value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} type="password"
             className="wd-password form-control mb-2" placeholder="Password" /><FaStarOfLife className="required-star text-danger"/></div>

      <div id="required-field"><input value={user.confirmPass} onChange={(e) => setConfirmPass(e.target.value)} type="password" 
             className="wd-password form-control mb-2" placeholder="Confirm Password" /><FaStarOfLife className="required-star text-danger"/></div>

      {((!user.username || !user.password ) && submit ? <p className="text-danger" style={{ fontSize: "14px", marginBottom: "10px" }}><RiErrorWarningLine className="fs-5 mb-1 text-danger me-2"/> Please enter username and password</p> : null)}
      {(confirmPass!==user.password && submit ? <p className="text-danger" style={{ fontSize: "14px", marginBottom: "10px" }}><RiErrorWarningLine className="fs-5 mb-1 text-danger me-2"/> Password does not match</p> : null)}
      {error && (
        <p className="text-danger" style={{ fontSize: "14px", marginBottom: "10px" }}>
          <RiErrorWarningLine className="fs-5 mb-1 text-danger me-2" />
          {error}
        </p>
      )}
      <button onClick={()=>{signup();setSubmit((prev:any)=>!prev)}} className="wd-signup-btn btn btn-primary mb-2 w-100"> Sign up </button><br />
      <Link to="/Kanbas/Account/Signin" className="wd-signin-link">Sign in</Link>

      <div className="fload-end mt-5" style={{display:"flex", position:"absolute", left:"370px"}}><FaStarOfLife className="text-danger" style={{scale:"0.5"}}/><p style={{fontSize:"10px"}}>required fields</p></div>
      </>
    }
    </div>
);}

