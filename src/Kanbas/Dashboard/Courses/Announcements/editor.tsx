import { useEffect, useState } from "react";
import { deleteAnnouncement, setAnnouncements, updateAnnouncement } from "./reducer";
import * as announcementsClient from "./client";
import * as coursesClient from "../client";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import * as client from "../../../Account/client";
import { setUsers } from "../../../Account/usersReducer";
import { FaUserCircle } from "react-icons/fa";
import ProtectedContent from "../../../Account/ProtectedContent";

export default function AnnouncementEditor() { 
    const { cid, anid } = useParams();
    const [editAnnouncement, setEditAnnouncement] = useState(false);
    const { announcements } = useSelector((state: any) => state.announcementsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [isLoading, setIsLoading] = useState(true);
    const announcement = announcements?.find((a: any) => a._id === anid);
    const [announcementTitle, setAnnouncementTitle] = useState(announcement ? announcement.title : "");
    const [announcementBody, setAnnouncementBody] = useState(announcement ? announcement.body : "");
    const { users } = useSelector((state: any) => state.usersReducer);
    
    const author = announcement && users?.find((u: any) => u._id === announcement.author);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const users = await client.findAllUsers();
        dispatch(setUsers(users));
    };

    const handleDeleteAnnouncement = async (announcementId: string) => {
        navigate(`/Kanbas/Courses/${cid}/Announcements`);
        await announcementsClient.deleteAnnouncement(announcementId);
        dispatch(deleteAnnouncement(announcementId));
    };

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
    };

    const handleUpdateAnnouncement = async (announcementId: string) => {
        try {
            const updatedAnnouncement = {
                _id: announcementId,
                courseId: cid,
                title: announcementTitle,
                body: announcementBody,
                date: date_submit(),
                author: currentUser._id,
            };
            await announcementsClient.updateAnnouncement(updatedAnnouncement);
            dispatch(updateAnnouncement(updatedAnnouncement));
        } catch (error) {
            console.error("Failed to update course:", error);
        }
    };

    const fetchAnnouncements = async () => {
        const announcements = await coursesClient.findAnnouncementsForCourse(cid as string);
        dispatch(setAnnouncements(announcements));
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([fetchAnnouncements(), fetchUsers()]);
            setIsLoading(false);
        };
        fetchData();
    }, [cid, anid, dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!announcement || !author) {
        return <div>Failed to load announcement. If this is a newly added announcement, please come back later.</div>
    }
 
    return (
        <>
            <ProtectedContent>
                <div>
                    <button className="btn btn-primary float-end me-5" onClick={() => handleDeleteAnnouncement(anid as string)}>Delete</button>
                    <button className="btn btn-secondary float-end me-2" onClick={() => setEditAnnouncement((prev: any) => !prev)}>Edit</button>

                    {editAnnouncement && 
                        <div style={{ width: "700px", position: "relative" }} className="p-5">
                            <h5>Edit Announcement</h5>
                            <button className="btn btn-secondary float-end mb-2" onClick={() => { setEditAnnouncement(false); }}>Cancel</button>
                            <button className="btn btn-primary float-end me-2 mb-2" onClick={() => { handleUpdateAnnouncement(anid as string); setEditAnnouncement(false); }}>Update</button>
                            <br /><br />
                            <div style={{ display: "flex" }}>
                                <p style={{ width: "150px" }}>Title</p>
                                <input className="form-control mb-2" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
                            </div>
                            <div style={{ display: "flex" }}>
                                <p style={{ width: "150px" }}>Body</p>
                                <textarea className="form-control mb-2" value={announcementBody} onChange={(e) => setAnnouncementBody(e.target.value)} />
                            </div>
                        </div>
                    }
                </div>
            </ProtectedContent>
            <div id="wd-announcement-editor" className="p-5">
                <div className="border p-4">
                    <div className="d-flex mb-4">
                        <FaUserCircle className="me-2 fs-1 text-secondary" />
                        <p className="mt-2">{author.firstName} {author.lastName} | {author.role}</p>
                    </div>
                    <h3 style={{ fontWeight: "bold" }}>{announcement.title}</h3>
                    <p style={{
                        position: "relative",
                        overflow: "hidden",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        wordBreak: "break-word"
                    }} className="mb-4">{announcement.body}</p>
                    <strong>Posted On: {announcement.date}</strong>
                </div>
            </div>
        </>
    );
}
