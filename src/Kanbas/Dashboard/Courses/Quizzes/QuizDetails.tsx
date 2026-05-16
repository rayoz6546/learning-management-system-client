import { useNavigate, useParams } from "react-router";
import { GrEdit } from "react-icons/gr";
import StudentViewButton from "./StudentViewButton";
import { useViewContext } from "./View";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProtectedContent from "../../../Account/ProtectedContent";
import ProtectedContentEnrollment from "../../../Account/ProtectedContentEnrollment";
import { useEffect } from "react";
import * as resultsClient from "./resultsClient";
import * as coursesClient from "../client";
import { setResults } from "./resultsReducer";
import { setQuizzes } from "./quizzesReducer";
import { setQuestions } from "./questionsReducer";
import * as questionsClient from "./questionsClient";


export default function QuizDetails() {
    const { cid, qid } = useParams()
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const dispatch = useDispatch()

    const { isStudentView, toggleView } = useViewContext();

    const navigate = useNavigate()
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    
    const {results} = useSelector((state:any)=> state.resultsReducer)
    const result = results.find((res:any)=>res.quizId === qid && res.courseId=== cid && res.userId === currentUser._id)

    const { questions } = useSelector((state: any) => state.questionsReducer); 

    const fetchResults = async () => {
        const results = await resultsClient.fetchResults(qid as string, currentUser._id)
        dispatch(setResults(results))
     }
 
 
     const fetchQuizzes = async () => {
         const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
  
         dispatch(setQuizzes(quizzes));
 
         };
         
        const fetchQuestions = async () => {
        const questions = await questionsClient.fetchQuestions(qid as string);
        dispatch(setQuestions(questions));
        };

     useEffect(() => {
 

        fetchResults()
         
     }, []);


    return (
        <>
        
            <ProtectedContentEnrollment>


            <>{quizzes
                    .filter((quiz: any) => quiz.course == cid)
                    .filter((quiz: any) => quiz._id == qid)
                    .map((quiz: any) => (
                        <>
                       

                            <div className="row">
                                <h4 style={{ fontWeight: "bold" }}> {`${quiz.title}`} </h4>
                            </div>

                            <div className="row ms-1">
                                <table className="table">
                                    <thead>
                                        <tr className="table"><th>Due</th><th>Available From</th><th>Until</th><th>Points</th><th>Questions</th><th>Time Limit</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr className="table"><td>{`${quiz.due_date}`.toString().split("T")[0]}</td><td>{`${quiz.available_from}`.toString().split("T")[0]}</td><td>{`${quiz.available_until}`.toString().split("T")[0]}</td><td>{`${quiz.points}`}</td><td>{`${quiz.number_questions}`}</td><td>{`${quiz.time_limit}`} Minutes</td></tr>
                                    </tbody>
                                </table>
                            </div>
             
                    {(quiz.availability==="Available" || quiz.availability==="") && (
                        <>
                            {(result?.attempt==null )&& (
                                <div className="row-auto d-flex justify-content-center">
                                <button id="wd-takequiz-btn" className="btn btn-lg btn-danger fs-6 rounded-1 me-1"
                                onClick={() =>{navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/TakeQuiz`);}}>
                                    Take Quiz</button>
                            </div>)}

                            {result?.attempt>=quiz.number_attempts && (
                                <div className="row-auto d-flex justify-content-center">
                                <button id="wd-takequiz-btn" className="btn btn-lg btn-secondary fs-6 rounded-1 me-1"
                                onClick={() =>{navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuizResults`);}}>
                                    See Last Attempt</button>
                                </div>
                            )}

                            {(result?.attempt<quiz.number_attempts) && (
                                <div className="row-auto d-flex justify-content-center">
                                <button id="wd-takequiz-btn" className="btn btn-lg btn-secondary fs-6 rounded-1 me-1"
                                onClick={() =>{navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuizResults`);}}>
                                    See Last Attempt</button>
                                
                                <button id="wd-takequiz-btn" className="btn btn-lg btn-danger fs-6 rounded-1 me-1"
                                onClick={() =>{navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/TakeQuiz`);}}>
                                    New Attempt</button>
                                </div>
                            )}
                            </>
                        )}

                        {(quiz.availability=="Not Available Until") && (
                            <>
                            This quiz is locked until {quiz.available_until.toString().split("T")[0]}.
                            </>
                        )}

                        {(quiz.availability=="Closed") && (
                            <>
                            This quiz is closed.
                            </>
                        )}

                        </>
                    ))}</>

            </ProtectedContentEnrollment>





            <ProtectedContent><StudentViewButton
                isStudentView={isStudentView}
                onClick={toggleView}
            /></ProtectedContent>

            <div className="container-fluid" id="wd-quiz-details" >
  

            <ProtectedContent>{isStudentView ?
                    (<><div className="p-5 row d-flex justify-content-center">

                        <div className="col-auto"><Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/Preview`}><button id="wd-preview-btn" className="btn btn-lg btn-secondary fs-6 rounded-1 float-end me-1">
                            Preview</button></Link></div>

                        <div className="col-auto"><Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/Editor/Details`}><button id="wd-edit-btn" className="btn btn-lg btn-secondary fs-6 rounded-1 float-end me-1"
                        >
                            <GrEdit className="me-1" />Edit</button></Link></div>
                    </div>
                        <hr />

                        {quizzes
                            .filter((quiz: any) => quiz.course == cid)
                            .filter((quiz: any) => quiz._id == qid)
                            .map((quiz: any) => (
                                <>
                                    <div className="row">
                                        <h4 style={{ fontWeight: "bold" }}> {`${quiz.title}`} </h4>
                                    </div>

                                    <div className="row">

                                        <div className="col d-flex flex-column">
                                            <ul className="list-group rounded-0 border-0">
                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Quiz Type</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Points</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Assignment Group</strong></div>
                                                </li>


                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Shuffle Answers</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Time Limit</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Multiple Attempts</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>How Many Attempts</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Show Correct Answers</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Access Code</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>One Question at a Time</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Webcam Required</strong></div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap d-flex justify-content-end">
                                                    <div className="col-auto me-5"><strong>Lock Questions After Answering</strong></div>
                                                </li>
                                            </ul>
                                        </div>




                                        <div className="col d-flex flex-column overflow-hidden">
                                            <ul className="list-group rounded-0 border-0">
                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.quiz_type}`}</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.points}`}</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.assignment_group}`}</div>
                                                </li>


                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.shuffle_answers}`}</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.time_limit}`} Minutes</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.multiple_attempts}`}</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.number_attempts}`}</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.show_correct_answers}`}</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.access_code}`}</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.one_question_at_a_time}`}</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.webcam_required}`}</div>
                                                </li>

                                                <li className="list-group-item border-0 text-nowrap">
                                                    <div className="col-auto">{`${quiz.lock_questions_after_answering}`}</div>
                                                </li>
                                            </ul>
                                        </div>


                                    </div>


                                    <br />
                                    <br />

                                    <div className="row">
                                        <table className="table">
                                            <thead>
                                                <tr className="table"><th>Due</th><th>Available From</th><th>Until</th></tr>
                                            </thead>
                                            <tbody>
                                                <tr className="table"><td>{`${quiz.due_date}`.toString().split("T")[0]}</td><td>{`${quiz.available_from}`.toString().split("T")[0]}</td><td>{`${quiz.available_until}`.toString().split("T")[0]}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>


                                </>


                            )
                            )} </>) :

                    (<>{quizzes
                        .filter((quiz: any) => quiz.course == cid)
                        .filter((quiz: any) => quiz._id == qid)
                        .map((quiz: any) => (
                            <>
                                <div className="row">
                                    <h4 style={{ fontWeight: "bold" }}> {`${quiz.title}`} </h4>
                                </div>

                                <div className="row">
                                    <table className="table">
                                        <thead>
                                            <tr className="table"><th>Due</th><th>Available From</th><th>Until</th><th>Points</th><th>Questions</th><th>Time Limit</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr className="table"><td>{`${quiz.due_date}`.toString().split("T")[0]}</td><td>{`${quiz.available_from}`.toString().split("T")[0]}</td><td>{`${quiz.available_until}`.toString().split("T")[0]}</td><td>{`${quiz.points}`}</td><td>{`${quiz.number_questions}`}</td><td>{`${quiz.time_limit}`} Minutes</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                {(quiz.availability=="Available" || quiz.availability=="") && (
                                <div className="row-auto d-flex justify-content-center">
                                    <button id="wd-takequiz-btn" className="btn btn-lg btn-danger fs-6 rounded-1 me-1">
                                        Take Quiz</button>
                                </div>
                                )}

                                {(quiz.availability=="Not Available Until") && (
                                    <>
                                    This quiz is locked until {quiz.available_until.toString().split("T")[0]}.
                                    </>
                                )}

                                {(quiz.availability=="Closed") && (
                                    <>
                                    This quiz is closed.
                                    </>
                                )}
                            </>
                        ))}</>)



                }</ProtectedContent>



            </div>
        </>

    );
}
