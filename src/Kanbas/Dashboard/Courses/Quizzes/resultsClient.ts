import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const RESULTS_API = `${REMOTE_SERVER}/api/results`;


   
   
   export const updateResults = async (result: any) => {
   
       const { data } = await axios.put(`${RESULTS_API}/${result._id}`, result);
       return data;
     };

  export const fetchResults = async (quizId:string, userId:string)=> {
    const response = await axios.get(`${RESULTS_API}/${quizId}/${userId}`);
    return response.data;
  }

  export const createResults = async (quizId: string, userId:any,result: any) => {
    const response = await axios.post(
      `${RESULTS_API}/${quizId}/${userId}`,
        result
    );
    return response.data;
  };

  export const deleteAll = async (courseId: string, quizId: string) => {
    const response = await axios.delete(`${RESULTS_API}/${courseId}/${quizId}`);
    return response.data;
  }
