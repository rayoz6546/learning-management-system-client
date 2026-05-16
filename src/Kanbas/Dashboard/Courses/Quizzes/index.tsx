import { useNavigate, useParams } from "react-router";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoEllipsisVertical, IoRocketOutline } from "react-icons/io5";
import AssignmentControlButtons from "../Assignments/AssignmentsControlButtons"
import { useEffect, useState } from "react";
import StudentViewButton from "./StudentViewButton";
import { FaCircle, FaPlus } from "react-icons/fa6";
import { FiMoreVertical } from "react-icons/fi";
import { useViewContext } from "./View";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuiz, publishQuiz, setQuizzes, unpublishQuiz, updateQuiz } from "./quizzesReducer";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import QuizRemove from "./QuizRemove";
import ProtectedContent from "../../../Account/ProtectedContent";
import ProtectedContentEnrollment from "../../../Account/ProtectedContentEnrollment";
import { deleteAllQuestions, setQuestions} from "./questionsReducer";

import GreenCheckmark from "../Modules/GreenCheckmark";
import { CiNoWaitingSign } from "react-icons/ci";
import * as coursesClient from "../client";
import * as quizzesClient from "../Quizzes/client";
import * as questionsClient from "../Quizzes/questionsClient";
import { GrEdit } from "react-icons/gr";
import { setResults } from "./resultsReducer";
import * as resultsClient from "./resultsClient";

export default function Quizzes({newQuizId, quizzes, setPublished, setNewPublished}:{newQuizId:any, quizzes:any, setPublished:any, setNewPublished:any}) {
    const { cid } = useParams()
    const { isStudentView, toggleView } = useViewContext();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quizToDelete, setQuizToDelete] = useState("")
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const [visibleIcons, setVisibleIcons] = useState<Record<string, boolean>>({});
    const {results} = useSelector((state:any)=> state.resultsReducer)
    const [scores, setScores] = useState<Record<string, number | null>>({}); 
    const {questions} = useSelector((state:any)=> state.questionsReducer)




    const toggleIcons = (quizId: string) => {
        setVisibleIcons((prev) => ({
            ...prev,
            [quizId]: !prev[quizId],
        }));
    };

    const fetchQuizzes = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));

      };

      const fetchScore = async (quizId: string) => {
        try {
            const results_ = await resultsClient.fetchResults(quizId, currentUser._id);
            if (results_ && results_.length > 0) {
                const result = results_.find((r: any) => r.quizId === quizId && r.courseId === cid && r.userId === currentUser._id);
                return result ? result.score : "-";
            }
            return "-";
        } catch (error) {
            console.error("Error fetching score:", error);
            return "-";
        }
    };
 
    useEffect(() => {
        const fetchScores = async () => {
            const newScores: Record<string, number | null> = {};
            for (const quiz of quizzes) {
                const score = await fetchScore(quiz._id);
                newScores[quiz._id] = score;
            }
            setScores(newScores);  
        };

        fetchScores();
    }, [quizzes, currentUser._id, cid]);

 
    


    const removeQuiz = async (quizId: string) => {
    await quizzesClient.deleteQuiz(quizId, cid as string);
    dispatch(deleteQuiz(quizId));
    await questionsClient.deleteAllQuestions(quizId);
    dispatch(deleteAllQuestions(quizId))
    await resultsClient.deleteAll(cid as string, quizId)
    };


    useEffect(() => {
        fetchQuizzes()

    }, []); 
    

    const handlePublishToggle = async (quiz:any) => {
        setNewPublished((prevState: any) => !prevState); 
        await quizzesClient.updateQuiz({...quiz, published: setPublished});
        dispatch(updateQuiz({ ...quiz, published: setPublished}));

    };

    
    return (
        <>

            <ProtectedContent><StudentViewButton
                isStudentView={isStudentView}
                onClick={toggleView}
            /></ProtectedContent>

            <div id="wd-quizzes" className="p-3">
                <div className="row mb-5">
                    <div className="col">
                        <input type="search" className="form-control rounded-0 me-1 wd-search-bar" id="wd-search-assignment"
                            placeholder="    Search for Quiz" style={{ width: "300px" }} />
                    </div>

                    <ProtectedContent>{isStudentView ?
                        (<><div className="col mb-3">

                            <div className="col">
                                <button id="wd-quiz-menu-btn" className="btn btn-lg btn-secondary fs-6 rounded-1 float-end">
                                    <FiMoreVertical /></button>
                            </div>

                            <div className="col text-nowrap">
                                <button id="wd-add-quiz-btn" className="btn btn-lg btn-danger fs-6 rounded-1 float-end me-1"
                                    onClick={() =>{navigate(`/Kanbas/Courses/${cid}/Quizzes/${newQuizId}/Editor/Details`);}}>
                                        
                                    <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                                    Quizzes</button>
                            </div>
                        </div> <hr /></>) : null}</ProtectedContent>
                </div>


                <div className="row">

                    <ul id="wd-quiz-list" className="list-group rounded-0">
                        <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
                            <div className="wd-assignments-title p-3 ps-2 bg-secondary">
                                <IoMdArrowDropdown className="me-2 fs-5" />
                                Assignment Quizzes
                            </div>
                            <ul className="wd-assignments list-group rounded-0">
                            <ProtectedContent>{quizzes
                                    .filter((quiz: any) => quiz.course === cid)
                                    .map((quiz: any) => (
                                        <li className="wd-assignment list-group-item p-3 ps-1 d-flex align-items-center">
                                            <div className="d-flex align-items-center">

                                                <IoRocketOutline className="ms-2 me-3 fs-3 text-success" />
                                                <div className={`wd-${quiz._id}`}>
                                                    <a className="wd-quiz-link" href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}>
                                                        <strong>{quiz.title}</strong>
                                                    </a>
                                                    <br />

                                                    {(quiz.availability==="Closed") && ( <>
                                                        <strong>Closed</strong> | <strong>Due</strong> {`${quiz.due_date}`.toString().split("T")[0]} | {isStudentView? `${quiz.points} pts |`: null} {`${quiz.number_questions}`} Questions {isStudentView? null: `| Score: - /${quiz.points}`}
                                                        </>
                                                    )}
                                                    
                                                    {(quiz.availability==="Available") && ( <>
                                                        <strong>Available</strong> | <strong>Due</strong> {`${quiz.due_date}`.toString().split("T")[0]} | {isStudentView? `${quiz.points} pts |`: null} {`${quiz.number_questions}`} Questions {isStudentView? null: `| Score: - /${quiz.points}`}
                                                        </>
                                                    )}
                                                    {(quiz.availability==="Not Available Until") && ( <>
                                                        <strong>Not Available Until</strong> {`${quiz.available_until}`.toString().split("T")[0]} | <strong>Due</strong> {`${quiz.due_date}`.toString().split("T")[0]} | {isStudentView? `${quiz.points} pts |`: null} {`${quiz.number_questions}`} Questions {isStudentView? null: `| Score: - /${quiz.points}`}
                                                        </>
                                                    )}
                                                    {(quiz.availability==="") && ( <>
                                                        <strong>Undefined</strong> | <strong>Due</strong> {`${quiz.due_date}`.toString().split("T")[0]} | {isStudentView? `${quiz.points} pts |`: null} {`${quiz.number_questions}`} Questions {isStudentView? null: `| Score: - /${quiz.points}`}
                                                        </>
                                                    )}

                                                     <br />
                                                        
                                                </div>
                                            </div>

                                            {isStudentView ?
                                                <div className="ms-auto d-flex align-items-center">
                                          

                                                    {visibleIcons[quiz._id] && (
                                                        <>
                                                            <FaTrash
                                                                className="me-2 text-danger" data-bs-toggle="modal" data-bs-target="#wd-add-quiz-dialog"
                                                                
                                                                onClick={() => {console.log("Setting quizToDelete:", quiz._id);setQuizToDelete(quiz._id)}}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                           <QuizRemove
                                                            dialogTitle="Delete Quiz"
                                                            deleteQuiz={(id) => {
                                                                console.log(id)
                                                                removeQuiz(id);
                                                                dispatch(deleteAllQuestions(id));
                                                                setQuizToDelete(""); 
                                                            }}
                                                            quizId={quizToDelete} 
                                                           
                                                        />

                                                            <GrEdit
                                                                className="me-2 text-primary"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/Editor/Details`
                                                                    )
                                                                }
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </>
                                                    )}

                                                    <div className="d-flex align-items-center">
                                                    <span className="me-1 position-relative" onClick={()=>handlePublishToggle(quiz)} >

                                                    {quiz.published ? ( 
                                                        <FaCheckCircle style={{ top: "0.5px" }} className="me-1 text-success position-relative fs-5" />
                                                    ) : ( 
                                                        <CiNoWaitingSign className="fs-5 position-relative me-1" style={{ top: "0.5px" }}/>
                                                    )}
                                                    </span>

                                                    <IoEllipsisVertical className="fs-6"onClick={() => toggleIcons(quiz._id)} style={{ cursor: "pointer" }}/>
                                                    </div>



 
                                                </div> : null}
                                        </li>
                                    ))
                                }</ProtectedContent>


                        <ProtectedContentEnrollment>{quizzes
                                    .filter((quiz: any) => quiz.course === cid)
                                    .map((quiz: any) => (
                                        <>
                          
                                        {quiz.published && ( <li className="wd-assignment list-group-item p-3 ps-1 d-flex align-items-center">
                                            <div className="d-flex align-items-center">

                                                <IoRocketOutline className="ms-2 me-3 fs-3 text-success" />
                                                <div className={`wd-${quiz._id}`}>
                                                    <a className="wd-quiz-link" href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}>
                                                        <strong>{quiz.title}</strong>
                                                    </a>
                                                    <br />

                                                    {(quiz.availability==="Closed") && ( <>
                                                        <strong>Closed</strong> | <strong>Due</strong> {`${quiz.due_date}`.toString().split("T")[0]} | {`${quiz.number_questions}`} Questions | Score: {scores[quiz._id]} / {quiz.points}
                                                        </>
                                                    )}
                                                    
                                                    {(quiz.availability==="Available") && ( <>
                                                        <strong>Available</strong> | <strong>Due</strong> {`${quiz.due_date}`.toString().split("T")[0]} | {`${quiz.number_questions}`} Questions | Score: {scores[quiz._id]} / {quiz.points}
                                                      
                                                        </>
                                                    )}
                                                    {(quiz.availability==="Not Available Until") && ( <>
                                                        <strong>Not Available Until</strong> {`${quiz.available_until}`.toString().split("T")[0]} | <strong>Due</strong> {`${quiz.due_date}`.toString().split("T")[0]} | {`${quiz.number_questions}`} Questions | Score: {scores[quiz._id]} / {quiz.points}
                                                        </>
                                                    )}
                                                    {(quiz.availability==="") && ( <>
                                                        <strong>Undefined</strong> | <strong>Due</strong> {`${quiz.due_date}`.toString().split("T")[0]} | {`${quiz.number_questions}`} Questions | Score: {scores[quiz._id]} / {quiz.points}
                                                        </>
                                                    )}
                                                    
                                                </div>
                                            </div>

                                            
                                        </li>)}</>
                                    ))
                                }</ProtectedContentEnrollment>
                            </ul>
                        </li >
                    </ul>
                </div>


            </div>

        </>
    );
}
