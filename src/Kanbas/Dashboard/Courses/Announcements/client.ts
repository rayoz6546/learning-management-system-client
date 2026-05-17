import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const ANNOUNCEMENT_API = `${REMOTE_SERVER}/api/announcements`;



export const deleteAnnouncement = async (announcementId: string) => {
 const response = await axios.delete(`${ANNOUNCEMENT_API}/${announcementId}`);
 return response.data;
};


export const updateAnnouncement = async (announcement: any) => {

    const { data } = await axios.put(`${ANNOUNCEMENT_API}/${announcement._id}`, announcement);
    return data;
  };