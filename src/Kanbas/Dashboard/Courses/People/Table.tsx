import { FaUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { setEnrollments } from "../../Enrollment/reducer";
import { useDispatch } from "react-redux";
import ProtectedContent from "../../../Account/ProtectedContent";
import PeopleDetails from "./Details";
import * as peopleClient from "./client"


export default function PeopleTable({ users = [] }: { users?: any[] }) {
  const { cid } = useParams();
  const dispatch = useDispatch();
  
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>([]);

  const fetchEnrollments = async () => {
    const enrolledUsers = await peopleClient.findCoursePeople(cid as string)
    setEnrolledUsers(enrolledUsers);
 };

 useEffect(() => {
  fetchEnrollments();
}, [cid]);

  return (
    <div id="wd-people-table">
       <PeopleDetails />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map((user: any) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                <Link to={`/Kanbas/Account/Users/${user._id}`} className="text-decoration-none">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>
                  <span className="wd-last-name">{user.lastName}</span>
                  </Link>
                </td>
                <td className="wd-login-id">{user.loginId}</td>
                <td className="wd-section">{user.section}</td>

                <td className="wd-role">{user.role}</td>
                <td className="wd-last-activity">{user.lastActivity}</td>
                <td className="wd-total-activity">{user.totalActivity}</td>
                
              </tr>
            ))}

    
            {enrolledUsers && enrolledUsers
          
          .map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName}</span>
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}

        </tbody>
      </table>
      
    </div>
  );
}


