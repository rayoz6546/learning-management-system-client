import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const {cid} = useParams()
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const active = (path: string) => (pathname.includes(path) ? "active" : "");
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0 d-none d-md-block">

      {links.map((link) => (
              <Link to={`/Kanbas/Account/${link}`} className={`list-group-item border border-0 ${pathname.includes(link) ? "active" : "text-danger"}`}>
                {link}
              </Link>
            )
            )}
      {currentUser && currentUser.role === "ADMIN" && (
       <Link to={`/Kanbas/Account/Users`} className={`list-group-item border-0 border-white ${active("Users")}`}> Users </Link> )}
    </div>

);}