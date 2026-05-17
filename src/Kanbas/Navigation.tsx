import { Link, useLocation } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import { FaGithub } from "react-icons/fa";

export default function KanbasNavigation() {
  const { pathname } = useLocation();
  const links = [
    { label: "Dashboard", path: "/Kanbas/Dashboard", icon: AiOutlineDashboard },
    { label: "Courses",   path: "/Kanbas/Dashboard", icon: LiaBookSolid },
    { label: "Github Client",      path: "https://github.com/rayoz6546/kanbas-react-web-app.git",             icon: FaGithub },
    { label: "Github Server",      path: "https://github.com/rayoz6546/kanbas-node-server-app.git",             icon: FaGithub },
  ];

  return (
    <div id="wd-kanbas-navigation" style={{ width: 120 }} className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">


        <h1 className="ms-4 text-info" style={{fontSize:"100px"}}>K</h1>

        <Link to="/Kanbas/Account" className={`list-group-item text-center border-0 bg-black
            ${pathname.includes("Account") ? "bg-white text-info" : "bg-black text-white"}`}>
        <FaRegCircleUser className={`fs-1 ${pathname.includes("Account") ? "text-info" : "text-white"}`} />
        <br />
        Account
      </Link>
      
      {links.map((link) => (
        <Link key={link.path} to={link.path} className={`list-group-item bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-info bg-white" : "text-white bg-black"}`}>
          {link.icon({ className: "fs-1 text-info"})}
          <br />
          {link.label}
        </Link>
      ))}

 
    </div>
);}
