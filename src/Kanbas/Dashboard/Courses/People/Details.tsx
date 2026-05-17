import { useEffect, useState } from "react";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import * as client from "../../../Account/client";
import { FaPencil } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, setUsers, updateUser } from "../../../Account/usersReducer";
export default function PeopleDetails() {
  const { uid} = useParams();
  const { users } = useSelector((state:any)=> state.usersReducer)
  const user = users.find((u:any)=>u._id === uid)
 const fetchUsers = async () => {
   const users = await client.findAllUsers()

   dispatch(setUsers(users))
};

const [firstName, setFirstName] = useState(user ? user.firstName : "");
const [lastName, setLastName] = useState(user ? user.lastName : "");
const [username, setUsername] = useState(user ? user.username : "");
const [email, setEmail] = useState(user ? user.email : "");
const [dob, setDob] = useState(user ? user.dob : "");
const [lastActivity, setLastActivity] = useState(user ? user.lastActivity : "");
const [totalActivity, setTotalActivity] = useState(user ? user.totalActivity : "");



  const dispatch = useDispatch()
  const navigate = useNavigate();


  const handleDeleteUser = async () => {
    await client.deleteUser(uid as string);
    dispatch(deleteUser(uid))
    navigate("/Kanbas/Account/Users");
  };


  const handleUpdateUser = async () => {
    const updatedUser = {
      ...user, 
      username: username,
      firstName: firstName,
      lastName: lastName,
      email:email,
      dob:dob,
      lastActivity:lastActivity,
      totalActivity: totalActivity
    }
    await client.updateUser(updatedUser)
    dispatch(updateUser(updatedUser))
    navigate("/Kanbas/Account/Users");
  }

  useEffect(() => {
    if (user) { 
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setUsername(user.username || "")
      setEmail(user.email || "")
      setDob(user.dob || "")
      setLastActivity(user.lastActivity || "")
      setTotalActivity(user.totalActivity || "")
    }
    else {
      fetchUsers()
    }
  }, [
    setFirstName,setLastActivity,setLastName,setEmail,setUsername,
    setEmail, setDob,setLastActivity, setTotalActivity,        dispatch,
    user,
    uid
  ]);


  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    // Fetch data and set loading state
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator
  }
if (!user) return (<></>);

return (
  <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-3 shadow w-50">
    <button onClick={() => navigate("/Kanbas/Account/Users")} className="btn position-fixed end-0 top-0 wd-close-details">
      <IoCloseSharp className="fs-1" /> </button>
    <div className="text-center mt-2"> <FaUserCircle className="text-secondary me-2 fs-1" /> </div><hr />

        <div className="mb-3 d-flex align-items-center">
        <b className="me-3" style={{ minWidth: "150px" }}>Roles:</b>
        <input className="form-control" value={user.role} disabled/>
      </div>
      <div className="mb-3 d-flex align-items-center">
        <b className="me-3" style={{ minWidth: "150px" }}>University ID:</b>
        <input className="form-control" value={user.universityId} disabled/>
      </div>
      <div className="mb-3 d-flex align-items-center">
        <b className="me-3" style={{ minWidth: "150px" }}>First Name:</b>
        <input className="form-control" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
      </div>
      <div className="mb-3 d-flex align-items-center">
        <b className="me-3" style={{ minWidth: "150px" }}>Last Name:</b>
        <input className="form-control" value={lastName}  onChange={(e)=>setLastName(e.target.value)}/>
      </div>
      <div className="mb-3 d-flex align-items-center">
        <b className="me-3" style={{ minWidth: "150px" }}>Username:</b>
        <input className="form-control" value={username}  onChange={(e)=>setUsername(e.target.value)}/>
      </div>
      <div className="mb-3 d-flex align-items-center">
        <b className="me-3" style={{ minWidth: "150px" }}>Email:</b>
        <input className="form-control" value={email}  onChange={(e)=>setEmail(e.target.value)}/>
      </div>
      <div className="mb-3 d-flex align-items-center">
        <b className="me-3" style={{ minWidth: "150px" }}>Date of Birth:</b>
        <input className="form-control" type="Date" onChange={(e)=>setDob(new Date (e.target.value))} 
        value={dob ? new Date(dob).toISOString().split("T")[0] : ""} />
      </div>
      <div className="mb-3 d-flex align-items-center">
        <b className="me-3" style={{ minWidth: "150px" }}>Last Activity:</b>
        <input className="form-control" value={lastActivity}  disabled/>
      </div>
      <div className="mb-3 d-flex align-items-center">
        <b className="me-3" style={{ minWidth: "150px" }}>Total Activity:</b>
        <input className="form-control" value={totalActivity}  disabled/>
      </div>
    <hr />
    <button onClick={()=> handleDeleteUser()} className="btn btn-danger float-end wd-delete" > Delete </button>
    <button onClick={()=> handleUpdateUser()} className="btn btn-warning wd-delete me-2" > Update </button>
    <button onClick={() => navigate("/Kanbas/Account/Users")}
            className="btn btn-secondary me-2" > Cancel </button>
    </div> 
    
    



); }