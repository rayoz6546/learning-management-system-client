import { useEffect, useState } from "react";
import ProtectedContent from "../../../Account/ProtectedContent";
import { useDispatch, useSelector } from "react-redux";
import * as announcementsClient from "./client";
import * as coursesClient from "../client";
import { useParams } from "react-router";
import { addAnnouncement, deleteAnnouncement, setAnnouncements, updateAnnouncement } from "./reducer";
import { BsGripVertical } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { TfiAnnouncement } from "react-icons/tfi";
import ProtectedContentEnrollment from "../../../Account/ProtectedContentEnrollment";
export default function Announcements() { 
    const { cid } = useParams()
    const [addNewAnnouncement, setAddAnnouncement] = useState(false)
    const {announcements} = useSelector((state:any)=>state.announcementsReducer)
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [isLoading, setIsLoading] = useState(true); 
    const [announcementTitle, setAnnouncementTitle] = useState("")
    const [announcementBody, setAnnouncementBody] = useState("")

    const dispatch = useDispatch();

    const date_submit = () => {
        const now = new Date();
        const month = now.toLocaleString('en-US', { month: 'short' });
        const day = now.getDate(); 
    
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };
        const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
        return `${month} ${day} at ${formattedTime}`;
    }
    const resetNewAnnouncement = () => {
        setAnnouncementTitle("")
        setAnnouncementBody("")
      }
    const handleAddAnnouncement = async () => {
        const announcement = {
            _id: new Date().getTime().toString(),
            courseId: cid,
            title: announcementTitle,
            body: announcementBody,
            date: date_submit(),
            author: currentUser._id,
        }
        const newAnnouncement = await coursesClient.createAnnouncementForCourse(cid as string, announcement);
        dispatch(addAnnouncement(newAnnouncement))
        resetNewAnnouncement()
        setAddAnnouncement(false)
    }

    const fetchAnnouncements = async () => {
      const announcements = await coursesClient.findAnnouncementsForCourse(cid as string);
      console.log(announcements)
      dispatch(setAnnouncements(announcements));
    };


      useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          await Promise.all([fetchAnnouncements()]);
          setIsLoading(false);
        };
        fetchData();
      }, []);
    
      if (isLoading) {
        return <div>Loading...</div>; 
      }

    return (
        <div id="wd-annoucements" className="p-2">
            <ProtectedContent>
                <div className="mb-5">
            <button className="btn btn-secondary float-end" onClick={()=>setAddAnnouncement((prev:any)=>!prev)}>Add Announcement</button>

            {addNewAnnouncement && 
        <div style={{width:"700px", position:"relative"}} className="mb-5">
        <h5>New Announcement</h5>
        <button className="btn btn-secondary float-end mb-2" id="wd-cancel-add-course-click" onClick={()=> {setAddAnnouncement(false); resetNewAnnouncement()}}>Cancel </button>
        <button className="btn btn-primary float-end me-2 mb-2" id="wd-add-course-click" onClick={()=>{handleAddAnnouncement()}}> Add </button>

        <br /><br />
      
        <div style={{display:"flex"}}>
          <p style={{width:"150px"}}>Title</p>
          <input className="form-control mb-2" onChange={(e) => setAnnouncementTitle(e.target.value ) }/>
         </div>

         <div style={{display:"flex"}}>
          <p style={{width:"150px"}}>Body</p>
          <textarea className="form-control mb-2" onChange={(e) => setAnnouncementBody(e.target.value ) }/>
         </div>


        </div>
        }</div>

         <div className="wd-title p-3 ps-2 bg-secondary"><BsGripVertical className="me-2 fs-3" /><IoMdArrowDropdown className="me-2"/>ANNOUNCEMENTS ({announcements.length})</div>
         <ul id="wd-announcement-list" className="wd-lessons list-group rounded-0">
        {announcements.map((a: any)=> 
        <>
            
                <li className="wd-announcement list-group-item p-3 ps-1 d-flex align-items-center">
                <div className={`wd-${a._id} d-flex w-100` } >
                    <TfiAnnouncement className="me-4 ms-2 fs-4 text-dark" />
                    <div style={{width:"100%"}}>
                        <div className="d-flex justify-content-between w-100">
                      <a className="wd-announcement-link" href={`#/Kanbas/Courses/${cid}/Announcements/${a._id}`} style={{fontWeight:'bold', textDecoration:"none", color:"black", position:"relative",overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '500px'}}>{`${a.title}`}</a>
                      <span className="ms-2" style={{ whiteSpace: 'nowrap', fontWeight:"bold" }}>Posted On: {a.date}</span>
                      </div>
             

                        <div  style={{overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '500px',whiteSpace: 'nowrap',}}>

                        {a.body}</div>
                      </div>
                    </div>
                </li>
        </>)}
        </ul>
            </ProtectedContent>


            <ProtectedContentEnrollment>
            <div className="wd-title p-3 ps-2 bg-secondary"><BsGripVertical className="me-2 fs-3" /><IoMdArrowDropdown className="me-2"/>ANNOUNCEMENTS ({announcements.length})</div>
         <ul id="wd-announcement-list" className="wd-lessons list-group rounded-0">
            {announcements.map((a: any)=> 
            <>
                    <li className="wd-announcement list-group-item p-3 ps-1 d-flex align-items-center">
                    <div className={`wd-${a._id} d-flex w-100` } >
                        <TfiAnnouncement className="me-4 ms-2 fs-4 text-dark" />
                        <div style={{width:"100%"}}>
                            <div className="d-flex justify-content-between w-100">
                        <a className="wd-announcement-link" href={`#/Kanbas/Courses/${cid}/Announcements/${a._id}`} style={{fontWeight:'bold', textDecoration:"none", color:"black", position:"relative",overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '500px'}}>{`${a.title}`}</a>
                        <span className="ms-2" style={{ whiteSpace: 'nowrap', fontWeight:"bold" }}>Posted On: {a.date}</span>
                        </div>


                            <div  style={{overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '500px',whiteSpace: 'nowrap', }}>

                            {a.body}</div>
                        </div>
                        </div>
                    </li>
            </>)}
            </ul>

            </ProtectedContentEnrollment>
        </div>
    );
}