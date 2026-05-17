import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PeopleTable from "../Dashboard/Courses/People";
import * as client from "./client";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addUser, setUsers } from "./usersReducer";
import { Link } from "react-router-dom";
import PeopleDetails from "../Dashboard/Courses/People/Details";
export default function Users() {

const { users } = useSelector((state:any)=> state.usersReducer)

const dispatch = useDispatch()

 const { uid } = useParams();

 const fetchUsers = async () => {
   const users = await client.findAllUsers()

   dispatch(setUsers(users))
};

const [role, setRole] = useState("");
const filterUsersByRole = async (role: string) => {
  setRole(role);
  if (role) {
    const users = await client.findUsersByRole(role);
    dispatch(setUsers(users))
  } else {
    fetchUsers();
  }
};
const [name, setName] = useState("");
const filterUsersByName = async (name: string) => {
  setName(name);
  if (name) {
    const users = await client.findUsersByPartialName(name);
    dispatch(setUsers(users))
  } else {
    fetchUsers();
  }};

  const createStudent = async () => {
    const newIndex = users.length + 1;
    const user = await client.createUser({
      universityId: `2024${newIndex}`,
      password: "password123",
      username: `user${newIndex}`,
      firstName: "",
      lastName: "",
      email: `user${newIndex}@rayan.edu`,
      dob: "",
      role: "STUDENT",
    });
    dispatch(addUser(user))
  };

  const createFaculty = async () => {
    const newIndex = users.length + 1;
    const user = await client.createUser({
      universityId: `2024${newIndex}`,
      password: "password123",
      username: `user${newIndex}`,
      firstName: "",
      lastName: "",
      email: `user${newIndex}@kanbas.edu`,
      dob: "",
      role: "FACULTY",
    });
    dispatch(addUser(user))
  };

const navigate = useNavigate()

useEffect(() => {
  fetchUsers();
}, [uid]);

if (!users)  {
  return (<div>no enrollments</div>)
}
return (
  <div className="p-5">

    <h3>Users</h3>
    <button onClick={createStudent} className="float-end btn btn-danger wd-add-people">
        <FaPlus className="me-2" />
        Student
      </button>
      <button onClick={createFaculty} className="float-end me-2 btn btn-danger wd-add-people">
        <FaPlus className="me-2" />
        Faculty
      </button>

    
    <input onChange={(e) => filterUsersByName(e.target.value)} placeholder="Search people"
             className="form-control float-start w-25 me-2 wd-filter-by-name" />
    <select value={role} onChange={(e) =>filterUsersByRole(e.target.value)}
              className="form-select float-start w-25 wd-select-role" >
        <option value="">All Roles</option>    <option value="STUDENT">Students</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrators</option>
        </select>
    
        <PeopleDetails />
    <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>University ID</th>

            <th>Role</th>

          </tr>
        </thead>
        <tbody>
          {
            users.map((user: any) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <Link to={`/Kanbas/Account/Users/${user._id}`} className="text-decoration-none">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-login-name">{user.firstName} {user.lastName}</span>
                  </Link>
                  </td>
                <td className="wd-user-id">{user.universityId}</td>

                <td className="wd-role">{user.role}</td>

              
              </tr>
            ))}
                    </tbody>
                </table>
  </div>
);}