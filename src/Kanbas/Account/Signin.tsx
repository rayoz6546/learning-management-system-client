import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { FaStarOfLife } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const signin = async () => {
    setError("")
    try {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    navigate("/Kanbas/Dashboard");
  }
    catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div id="wd-signin-screen" className="p-5" style={{width:"500px", position:"relative"}}>
      <h3>Sign in</h3>
      
      <div id="required-field"><input defaultValue={credentials.universityId}
             onChange={(e) => setCredentials({ ...credentials, universityId: e.target.value })}
              id="wd-uniId" placeholder="User ID" className="form-control mb-2"/><FaStarOfLife className="required-star text-danger"/></div>


      <div id="required-field"><input value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} type="password"
             className="wd-password form-control mb-2" placeholder="Password" /><FaStarOfLife className="required-star text-danger"/></div>

      {error && (
        <p className="text-danger" style={{ fontSize: "14px", marginBottom: "10px" }}>
          <RiErrorWarningLine className="fs-5 mb-1 text-danger me-2" />
          {error}
        </p>
      )}


      <button onClick={signin} id="wd-signin-btn" className="btn btn-primary w-100" > Sign in </button>
      <Link  id="wd-signup-link" to="/Kanbas/Account/Signup">Sign up</Link>

      
      <div className="fload-end mt-5" style={{display:"flex", position:"absolute", left:"370px"}}><FaStarOfLife className="text-danger" style={{scale:"0.5"}}/><p style={{fontSize:"10px"}}>required fields</p></div>
    </div>
);}
