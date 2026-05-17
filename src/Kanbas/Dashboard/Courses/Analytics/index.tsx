import ProtectedContent from "../../../Account/ProtectedContent";
import { useEffect, useRef, useState } from "react";
import * as resultsClient from "../Quizzes/resultsClient";
import * as coursesClient from "../client";
import * as usersClient from "../../../Account/client"
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setResults } from "../Quizzes/resultsReducer";
import { setQuizzes } from "../Quizzes/quizzesReducer";
import ProtectedContentEnrollment from "../../../Account/ProtectedContentEnrollment";
import * as assignmentsResultsClient from "../Assignments/assignmentsResultsClient";
import { setAssignmentResults } from "../Assignments/assignmentResultsReducer";
import { setAssignments } from "../Assignments/reducer";
import * as enrollmentsClient from "../../Enrollment/client";
import { setEnrollments } from "../../Enrollment/reducer";
import { setUsers } from "../../../Account/usersReducer";


type BoxplotData = {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
};

function BoxplotCanvas({ boxplotData }: { boxplotData: BoxplotData }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!boxplotData) return;

        const canvas = canvasRef.current;
        if (!canvas) return; // Ensure canvas is not null
        const ctx = canvas.getContext("2d");
        if (!ctx) return; // Ensure context is not null

        const width = canvas.width-20;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Dimensions and padding
        const padding = 30;
        const boxWidth = width - 2 * padding;
        const centerY = height / 2;

        // Map values to canvas width
        const scale = (value: number) =>
            padding + (boxWidth * (value - boxplotData.min)) / (boxplotData.max - boxplotData.min);

        // Whiskers
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(scale(boxplotData.min), centerY);
        ctx.lineTo(scale(boxplotData.q1), centerY); // Min to Q1
        ctx.moveTo(scale(boxplotData.q3), centerY);
        ctx.lineTo(scale(boxplotData.max), centerY); // Q3 to Max
        ctx.stroke();


        ctx.fillStyle = "rgb(81, 146, 230)";
        ctx.fillRect(scale(boxplotData.q1), centerY - 10, scale(boxplotData.q3) - scale(boxplotData.q1), 20);

    
        ctx.strokeStyle = "rgb(184, 244, 5)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(scale(boxplotData.median), centerY - 10);
        ctx.lineTo(scale(boxplotData.median), centerY + 10);
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";

        ctx.fillText(`Min: ${boxplotData.min}`, scale(boxplotData.min), centerY - 20);

        ctx.fillText(`Max: ${boxplotData.max}`, scale(boxplotData.max), centerY - 20);

        ctx.fillText(`Q1: ${boxplotData.q1}`, scale(boxplotData.q1), centerY + 25);

        ctx.fillText(`Q3: ${boxplotData.q3}`, scale(boxplotData.q3), centerY + 25);

        ctx.fillText(`Median: ${boxplotData.median}`, scale(boxplotData.median), centerY - 35);
    }, [boxplotData]);

    return <canvas ref={canvasRef} width={600} height={100}></canvas>;
}





export default function Analytics() {
    const { cid } = useParams();
    const navigate = useNavigate()
    const { users } = useSelector((state:any) => state.usersReducer)
    const {quizzes} = useSelector((state:any) => state.quizzesReducer)
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const {assignmentResults} = useSelector((state:any)=> state.assignmentsResultsReducer)
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const {results} = useSelector((state:any)=> state.resultsReducer)
    const {enrollments} = useSelector((state:any)=>state.enrollmentsReducer)

    const fetchEnrollments = async () => {
        const enrollments = await enrollmentsClient.findAllEnrollments()
        dispatch(setEnrollments(enrollments))
        };

    const fetchResults = async () => {
            const results = await resultsClient.fetchAllResults()
            dispatch(setResults(results))
        }

    const dispatch = useDispatch()


    const fetchQuizzes = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
    
        dispatch(setQuizzes(quizzes));

        };
    const fetchUsers = async () => {
        const users = await usersClient.findUsersForCourse(cid as string)

        dispatch(setUsers(users));

        };

    const fetchAssignmentsResults = async () => {
        const assignmentsResults = await assignmentsResultsClient.fetchAllAssignmentsResults()

        dispatch(setAssignmentResults(assignmentsResults))
    }

    const fetchAssignments = async () => {
        const assignments = await coursesClient.findAssignmentsForCourse(cid as string)
        dispatch(setAssignments(assignments))
    }

    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {
        // Fetch data and set loading state
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([fetchUsers(), fetchEnrollments(),fetchResults(),fetchAssignmentsResults(),fetchAssignments(),fetchQuizzes()]);
            setIsLoading(false);
        };
        fetchData();
        }, []);
    if (isLoading) {
        return <div>Loading...</div>; 
        }

    
    const getBoxplotData = (assignmentId: string): BoxplotData | null => {
        const scores = assignmentResults
            .filter((r: any) => r.assignmentId === assignmentId)
            .map((r: any) => r.score)
            .sort((a: number, b: number) => a - b);
    
        if (scores.length === 0) {
            return null; // No data
        }
    
        const min = scores[0];
        const max = scores[scores.length - 1];
        const median = scores[Math.floor(scores.length / 2)];
        const q1 = scores[Math.floor(scores.length / 4)];
        const q3 = scores[Math.floor((3 * scores.length) / 4)];
    
        return { min, q1, median, q3, max };
    };

    const getBoxplotDataQuiz = (quizId: string): BoxplotData | null => {
        const facultyUser = users.find((u: any) => u.role === "FACULTY")
        const scores =results
            .filter((r: any) => r.quizId === quizId && r.userId !== facultyUser._id)
            .map((r: any) => r.score)
            .sort((a: number, b: number) => a - b);
    
        if (scores.length === 0) {
            return null; // No data
        }
    
        const min = scores[0];
        const max = scores[scores.length - 1];
        const median = scores[Math.floor(scores.length / 2)];
        const q1 = scores[Math.floor(scores.length / 4)];
        const q3 = scores[Math.floor((3 * scores.length) / 4)];
    
        return { min, q1, median, q3, max };
    };
    
    return (
        <div>

            <h4 style={{background:"lightgrey"}} className="p-2">Assignments</h4>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Assignment Name</th>
                    <th>Total Points</th>
                    <th>Score Distribution</th>
                </tr>
                </thead>

                <tbody>
                    {assignments.map((assignment:any) => {
                        const boxplotData = getBoxplotData(assignment._id);

                        return (
                            <tr key={assignment._id}>
                                <td>{assignment.title}</td>
                                <td>{assignment.points}</td>
                                <td>
                                    {boxplotData ? (
                                        <BoxplotCanvas boxplotData={boxplotData} />
                                    ) : (
                                        "No Data"
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>


            </table>

            
            <h4 style={{background:"lightgrey"}} className="p-2">Quizzes</h4>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Quiz Name</th>
                    <th>Total Points</th>
                    <th>Score Distribution</th>

                </tr>
                </thead>

                <tbody>
                    {quizzes.map((quiz:any) => {
                        const boxplotData = getBoxplotDataQuiz(quiz._id);

                        return (
                            <tr key={quiz._id}>
                                <td>{quiz.title}</td>
                                <td>{quiz.points}</td>
                                <td>
                                    {boxplotData ? (
                                        <BoxplotCanvas boxplotData={boxplotData} />
                                    ) : (
                                        "No Data"
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            


        </div>
    )
}