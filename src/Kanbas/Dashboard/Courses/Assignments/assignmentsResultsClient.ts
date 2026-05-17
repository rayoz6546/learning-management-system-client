import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const ASSIGNMENTSRESULTS_API = `${REMOTE_SERVER}/api/assignmentsResults`;



export const deleteAssignmentResult = async (resultId: string) => {
 const response = await axios.delete(`${ASSIGNMENTSRESULTS_API}/${resultId}`);
 return response.data;
};


export const updateAssignmentResult = async (result: any) => {

    const { data } = await axios.put(`${ASSIGNMENTSRESULTS_API}/${result._id}`, result);
    return data;
  };


  export const createAssignmentResult = async (assignmentId: string, userId:any,result: any) => {
    const response = await axios.post(
      `${ASSIGNMENTSRESULTS_API}/${assignmentId}/${userId}`,
        result
    );
    return response.data;
  };

  
export const deleteAllAssignmentResults = async (assignmentId: string) => {
const response = await axios.delete(`${ASSIGNMENTSRESULTS_API}/all/${assignmentId}`);
return response.data;
};


export const fetchAllAssignmentsResultsByUser = async (userId:string)=> {
    const response = await axios.get(`${ASSIGNMENTSRESULTS_API}/user/${userId}`);

    return response.data;
  }

  export const fetchAllAssignmentsResultsByAssignment = async (assignmentId: string) => {
    try {
        const response = await axios.get(`${ASSIGNMENTSRESULTS_API}/assignment/${assignmentId}`);

        return response.data;
       
    } catch (error) {
        console.error("Error fetching assignment results:", error);
        throw error;
    }
};

export const fetchAllAssignmentsResults = async ()=> {
  const response = await axios.get(`${ASSIGNMENTSRESULTS_API}`);

  return response.data;
}