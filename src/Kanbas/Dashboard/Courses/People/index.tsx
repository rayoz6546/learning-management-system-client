import { FaUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { setEnrollments } from "../../Enrollment/reducer";
import { useDispatch, useSelector } from "react-redux";
import ProtectedContent from "../../../Account/ProtectedContent";
import PeopleDetails from "./Details";
import * as enrollmentsClient from "../../Enrollment/client";
import * as accountClient from "../../../Account/client"
import { setUsers } from "../../../Account/usersReducer";
import ProtectedContentAdmin from "../../../Account/ProtectedContentAdmin";
import ProtectedContentEnrollment from "../../../Account/ProtectedContentEnrollment";


export default function PeopleTable() {
  const { cid } = useParams();
  
const { users } = useSelector((state:any)=> state.usersReducer)

const [isLoading, setIsLoading] = useState(true);

 const { uid } = useParams();

 const fetchUsers = async () => {
   const users = await accountClient.findAllUsers()

   dispatch(setUsers(users))
};

  const { enrollments } = useSelector((state:any)=> state.enrollmentsReducer)
  const enrolledInCourse = enrollments.filter((e:any)=> e.course === cid)
  const enrolledUsers = users && users.filter((user:any)=>
  user && enrolledInCourse.some((e:any)=> e.user === user._id))

  const dispatch = useDispatch()

  const fetchEnrollments = async () => {
    const enrollments = await enrollmentsClient.findAllEnrollments()
    dispatch(setEnrollments(enrollments));
 };

 useEffect(() => {
  // Fetch data and set loading state
  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchUsers(), fetchEnrollments()]);
    setIsLoading(false);
  };
  fetchData();
}, []);

const [role, setRole] = useState("");
const filterUsersByRole = async (role: string) => {
  setRole(role);
  if (role) {
    const users = await accountClient.findUsersByRole(role);
    dispatch(setUsers(users))
  } else {
    fetchUsers();
  }
};
const [name, setName] = useState("");
const filterUsersByName = async (name: string) => {
  setName(name);
  if (name) {
    const users = await accountClient.findUsersByPartialName(name);
    dispatch(setUsers(users))
  } else {
    fetchUsers();
  }};

  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  if (enrolledUsers.length === 0) {
    return <div>No users enrolled in this course.</div>;
  }

  return (
<div id="wd-people-table">

<input onChange={(e) => filterUsersByName(e.target.value)} placeholder="Search people"
       className="form-control float-start w-25 me-2 wd-filter-by-name" />
        <select value={role} onChange={(e) =>filterUsersByRole(e.target.value)}
              className="form-select float-start w-25 wd-select-role" >
              <option value="">All Roles</option>    <option value="STUDENT">Students</option>
              <option value="FACULTY">Faculty</option>
        </select>

  <br /><br /><br />  
<ProtectedContentAdmin>
<table className="table table-striped">
        <thead>
        <tr>
            <th>Name</th>
            <th>University ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>

            {enrolledUsers
          .map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-name">{user.firstName}{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.universityId}</td>
              <td className="wd-username">{user.username}</td>
              <td className="wd-email">{user.email}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}

        </tbody>
      </table>
</ProtectedContentAdmin>


<ProtectedContent>

        <table className="table table-striped">
        <thead>
        <tr>
            <th>Name</th>
            <th>University ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>

            {enrolledUsers
          .map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-name">{user.firstName}{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.universityId}</td>
              <td className="wd-username">{user.username}</td>
              <td className="wd-email">{user.email}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}

        </tbody>
      </table>
      </ProtectedContent>


      <ProtectedContentEnrollment>

        <table className="table table-striped">
        <thead>
        <tr>
            <th></th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>

          </tr>
        </thead>
        <tbody>

            {enrolledUsers
          .map((user: any) => (
            <tr key={user._id}>
              <td><FaUserCircle className="me-2 fs-1 text-secondary" /></td>
              <td className="wd-full-name text-nowrap">{user.firstName}{user.lastName}</td>
              <td className="wd-login-id">{user.username}</td>
              <td className="wd-section">{user.email}</td>
              <td className="wd-role">{user.role}</td>

            </tr>
          ))}

        </tbody>
      </table>
      </ProtectedContentEnrollment>
      
</div> 
  );
}


