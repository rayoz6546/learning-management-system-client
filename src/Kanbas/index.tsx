import { Routes, Route, Navigate, useNavigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KanbasNavigation from "./Navigation";
import Courses from "./Dashboard/Courses"
import "./styles.css"
import { useEffect, useState } from "react";
import * as userClient from "./Account/client";
import ProtectedContent from "./Account/ProtectedContent";
import ProtectedRoute from "./Account/ProtectedRoute";
import { ViewProvider } from "./Dashboard/Enrollment/EnrollmentView";
import { useDispatch, useSelector } from "react-redux";
import Session from "./Account/Session";
import * as courseClient from "./Dashboard/Courses/client";
import { setCourses } from "./Dashboard/Courses/reducer";
import { setEnrollments } from "./Dashboard/Enrollment/reducer";



export default function Kanbas() {


  return (
    <Session>
    <div id="wd-kanbas">
        <KanbasNavigation />
        <div className="wd-main-content-offset p-3">
          <ViewProvider>
      <Routes>
        <Route path="/" element={<Navigate to="Dashboard" />} />
        <Route path="/Account/*" element={<Account />} />
        <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/Courses/:cid/*" element={<ProtectedRoute><Courses/></ProtectedRoute>} />
        <Route path="/Calendar" element={<h1>Calendar</h1>} />
        <Route path="/Inbox" element={<h1>Inbox</h1>} />
      </Routes>
      </ViewProvider>  
      </div>

    </div>
    </Session>
);}

  