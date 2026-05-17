import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";
export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);



  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile)); 
    setProfile(updatedProfile); 
    navigate("/Kanbas/Dashboard")
  };

  const fetchProfile = async () => {
    if (!currentUser || !currentUser._id) {
      navigate("/Kanbas/Account/Signin");
      return;
    }
    try {
      const userProfile = await client.findUserById(currentUser._id);
      if (!userProfile) {
        navigate("/Kanbas/Account/Signin");
        return;
      }
      setProfile(userProfile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      navigate("/Kanbas/Account/Signin");
    }
  };


  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/Kanbas/Account/Signin");
  };

  useEffect(() => { fetchProfile(); }, [currentUser]);useEffect(() => {
  if (currentUser) {
    fetchProfile();
  } else {
    navigate("/Kanbas/Account/Signin");
  }
}, [currentUser]);
  return (

    <div className="wd-profile-screen p-5" style={{width:"700px", position:"relative"}}>
      <h3>Profile</h3>
      {profile && (
        <div>


            <input value={profile.role} id="wd-role" className="form-control mb-3"
                 disabled/>

          <div style={{display:"flex"}} className="text-nowrap">
          <label htmlFor="wd-uniId" style={{width:"150px"}}>University ID</label>
          <input value={profile.universityId} id="wd-uniId" className="form-control mb-2"
                 disabled/>
          </div>

          <div style={{display:"flex"}} className="text-nowrap" >
          <label htmlFor="wd-password" style={{width:"150px"}}>Password</label>
          <input value={profile.password} id="wd-password" className="form-control mb-2"
                 onChange={(e) => setProfile({ ...profile, password:  e.target.value })}/>
          </div>

        <div style={{display:"flex"}} className="text-nowrap">
        <label htmlFor="wd-username" style={{width:"150px"}}>Username</label>
        <input value={profile.username} id="wd-username" className="form-control mb-2"
                 onChange={(e) => setProfile({ ...profile, username: e.target.value })}/>
        </div>


        <div style={{display:"flex"}} className="text-nowrap">
        <label htmlFor="wd-firstName" style={{width:"150px"}}>First Name</label>
          <input value={profile.firstName} id="wd-firstname" className="form-control mb-2"
                 onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}/>
        </div>

        <div style={{display:"flex"}} className="text-nowrap">
        <label htmlFor="wd-lastName" style={{width:"150px"}}>Last Name</label>
          <input value={profile.lastName} id="wd-lastname" className="form-control mb-2"
                 onChange={(e) => setProfile({ ...profile, lastName:  e.target.value })}/>
        </div>

        <div style={{display:"flex"}} className="text-nowrap">
        <label htmlFor="wd-dob" style={{width:"150px"}}>Date of Birth</label>
          <input value={profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : ""} id="wd-dob" className="form-control mb-2"
                 onChange={(e) => setProfile({ ...profile, dob: e.target.value })} type="date"/>
        </div>

        <div style={{display:"flex"}} className="text-nowrap">
          <label htmlFor="wd-email" style={{width:"150px"}}>Email</label>
          <input value={profile.email} id="wd-email" className="form-control mb-2"
                 onChange={ (e) => setProfile({ ...profile, email: e.target.value })}/>
        </div>



          <button onClick={updateProfile} className="btn btn-info w-100 mb-2"> Update </button>
          <button onClick={signout} className="btn btn-dark w-100 mb-2" id="wd-signout-btn">
            Sign out
          </button>
        </div>
      )}
</div>
);}
