import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;


export const findAllEnrollments = async () => {
  const response = await axiosWithCredentials.get(`${ENROLLMENTS_API}`)
  return response.data;
}

export const enroll = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(`${ENROLLMENTS_API}/${userId}/courses/${courseId}`);
  return response.data;
 };


 
  export const unenroll = async (userId: string, courseId: string) => {
   const response = await axiosWithCredentials.delete(`${ENROLLMENTS_API}/${userId}/courses/${courseId}`);
   return response.data;
  };

  
   export const unenrollAll = async (courseId: string) => {
    const response = await axiosWithCredentials.delete(`${ENROLLMENTS_API}/All/courses/${courseId}`);
    return response.data
   }

export const updateEnrollment = async (enrollment: any) => {
    const response = await axiosWithCredentials.put(`${ENROLLMENTS_API}/${enrollment._id}`, enrollment);
    return response.data;
}