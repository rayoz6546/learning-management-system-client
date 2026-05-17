import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;
export const deleteModule = async (moduleId: string) => {
 const response = await axios.delete(`${MODULES_API}/${moduleId}`);
 return response.data;
};


export const updateModule = async (module: any) => {
    const { data } = await  axios.put(`${MODULES_API}/${module._id}`, module);
    return data;
  };


  export const createLessonForModule = async (moduleId: string, lesson: any) => {
    const { data } = await axios.post(`${MODULES_API}/${moduleId}/lessons`, lesson);
    return data;
  };

  export const deleteLesson = async (moduleId: string, lessonId: string) => {
    const response = await axios.delete(`${MODULES_API}/${moduleId}/lessons/${lessonId}`);
    return response.data;
  };


  export const updateLesson = async (
    moduleId: string,
    lessonId: string,
    updatedLesson: any 
  ) => {
    
    const response = await axios.put(
      `${MODULES_API}/${moduleId}/lessons/${lessonId}`,
      updatedLesson
    );
    return response.data;
  };


