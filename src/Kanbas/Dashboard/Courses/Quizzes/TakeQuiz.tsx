import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { addResults, setResults } from "./resultsReducer";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";
import * as questionsClient from "./questionsClient";
import * as resultsClient from "./resultsClient";
import { setQuestions } from "./questionsReducer";
import { current } from "@reduxjs/toolkit";
import * as assignmentsResultsClient from "../Assignments/assignmentsResultsClient";
import * as coursesClient from "../client";
import { setAssignments } from "../Assignments/reducer";
import * as enrollmentsClient from "../../Enrollment/client";
import { setEnrollments, updateEnrollment } from "../../Enrollment/reducer";
import { setAssignmentResults } from "../Assignments/assignmentResultsReducer";
import { setQuizzes } from "./quizzesReducer";


export default function TakeQuiz() {
    const { cid, qid} = useParams()
    const [userGrades, setUserGrades] = useState<Record<string, number>>({});
    
    const {quizzes} = useSelector((state:any)=> state.quizzesReducer)
    const questions = quizzes.flatMap((quiz: any) =>
        (quiz.questions || []).map((question: any) => ({
            ...question,
            quizId: quiz._id,
            courseId: quiz.course,
        }))
    );
    const question = questions.filter((q:any) => q._id && q.quizId===qid && q.courseId===cid)
    const {results} = useSelector((state:any)=> state.resultsReducer)
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const result = results.find((res:any)=> res.quizId === qid && res.courseId=== cid && res.userId === currentUser._id)

    const {enrollments} = useSelector((state:any)=>state.enrollmentsReducer)
    const fetchEnrollments = async () => {
        const enrollments = await enrollmentsClient.findAllEnrollments()
        dispatch(setEnrollments(enrollments))
        };

    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userAnswers, setUserAnswers] = useState([]);




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

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const questionRefs = useRef<any[]>([]);

    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [isTimeUp, setIsTimeUp] = useState(false); 
    const [quizStartTime, setQuizStartTime] = useState<number>(0);
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);

    const fetchResults = async () => {
            const results = await resultsClient.fetchResultsByUser(cid as string, currentUser._id as string)
            dispatch(setResults(results))
        }
    const fetchAssignments = async () => {
        const assignments = await coursesClient.findAssignmentsForCourse(cid as string)
        dispatch(setAssignments(assignments))
    }
    const fetchQuizzes = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);

        dispatch(setQuizzes(quizzes));

        };

    const fetchAssignmentsResults = async () => {
        const assignmentsResults = await assignmentsResultsClient.fetchAllAssignmentsResultsByUser(currentUser._id as string)

        dispatch(setAssignmentResults(assignmentsResults))
    }
    const calculateGrade = async (userId: string, newResult: any = null) => {
        const updatedResults = newResult
            ? [...results.filter((r: any) => r._id !== newResult._id), newResult]
            : results;
        
        const assignmentsResults = await assignmentsResultsClient.fetchAllAssignmentsResultsByUser(userId);
        
        let totalWeightedScore = 0;
        let totalPercentage = 0;
    
        // Map quizzes and assignments to their latest results
        const latestQuizResults = updatedResults.reduce((acc: any, result: any) => {
            acc[result.quizId] = result; // Retain only the latest result for each quizId
            return acc;
        }, {});
    
        const latestAssignmentResults = assignmentsResults.reduce((acc: any, result: any) => {
            acc[result.assignmentId] = result; 
            return acc;
        }, {});
    
        const quizMap = quizzes.reduce((acc: any, quiz: any) => {
            acc[quiz._id] = quiz;
            return acc;
        }, {});
    
        const assignmentMap = assignments.reduce((acc: any, assignment: any) => {
            acc[assignment._id] = assignment;
            return acc;
        }, {});
    
        Object.values(latestQuizResults).forEach((result: any) => {
            const quiz = quizMap[result.quizId];
            if (quiz && quiz.percentage && quiz.points) {
                const weightedScore = (result.score / quiz.points) * quiz.percentage;
                totalWeightedScore += weightedScore;
                totalPercentage += quiz.percentage;
            }
        });
    
        Object.values(latestAssignmentResults).forEach((result: any) => {
            const assignment = assignmentMap[result.assignmentId];
            if (assignment && assignment.percentage && assignment.points) {
                const weightedScore = (result.score / assignment.points) * assignment.percentage;
                totalWeightedScore += weightedScore;
                totalPercentage += assignment.percentage;
            }
        });
    
        if (totalPercentage > 100) {
            totalWeightedScore = (totalWeightedScore / totalPercentage) * 100;
        }
    
        return Number(totalWeightedScore.toFixed(2));
    };
    
        

    const fetchQuestions = async () => {
        const questions = await questionsClient.fetchQuestions(qid as string);
        dispatch(setQuestions(questions));
      };
  

      const submit = async () => {
        try {
            let newResult;
            if (!result) {
                newResult = {
                    _id: Date.now().toString(),
                    quizId: qid,
                    courseId: cid,
                    userId: currentUser._id,
                    score: calculateScore(),
                    answers: userAnswers,
                    timetaken: calculateTimeTaken().toString(),
                    attempt: 1,
                    submitted_date: date_submit(),
                };

                const createdResult = await resultsClient.createResults(qid as string, currentUser._id, newResult);
                dispatch(addResults(createdResult));
            } else {
                newResult = {
                    ...result,
                    score: calculateScore(),
                    answers: userAnswers,
                    timetaken: calculateTimeTaken().toString(),
                    attempt: parseInt(result.attempt) + 1,
                    submitted_date: date_submit(),
                };
                await resultsClient.updateResults(newResult);
                dispatch(addResults(newResult));
            }
    
            await Promise.all([
                fetchResults(),
                fetchEnrollments(),
                fetchAssignments(),
                fetchAssignmentsResults(),
                fetchQuizzes(),
            ]);
    
            const enrollment = enrollments.find(
                (e: any) => e.course === cid && e.user === currentUser._id
            );
            if (enrollment) {
                const newCourseGrade = await calculateGrade(currentUser._id, newResult);
                const updatedEnrollment = { ...enrollment, courseGrade: newCourseGrade };
                await enrollmentsClient.updateEnrollment(updatedEnrollment);
                dispatch(updateEnrollment(updatedEnrollment));
            }
    
            navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuizResults`);
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };
    

        
    const handleNext = () => {
        if (currentQuestionIndex < question.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleAnswerSelection = (questionId: string, answer: any) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const scrollToQuestion = (index: number) => {
        if (questionRefs.current[index]) {
            questionRefs.current[index].scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };


    const calculateScore = () => {
        let totalScore = 0;

        question.forEach((q: any) => {
            const userAnswer = userAnswers[q._id];
        
    
            if (typeof q.correct_answer === 'string') {
                if (userAnswer === q.correct_answer) {
                    totalScore += parseInt(q.points, 10);
                }
            }

            else if (Array.isArray(q.correct_answer)) {
                if (q.correct_answer.includes(userAnswer)) {
                    totalScore += parseInt(q.points, 10); 
                }
            }
        });

        return totalScore
    }

    //--------------------------------------------------timer functions---------------------------------------//

    const calculateTimeTaken = () => {

        if (quizStartTime) {
            const elapsedTime = Date.now() - quizStartTime;  
    
            const timeTakenInSeconds = Math.abs(elapsedTime) / 1000;  

            const hoursTaken = Math.floor(timeTakenInSeconds / 3600);  
            const minutesTaken = Math.floor((timeTakenInSeconds % 3600) / 60);  
            const secondsTaken = Math.floor(timeTakenInSeconds % 60);  
    
            return `${String(hoursTaken).padStart(2, "0")}:${String(minutesTaken).padStart(2, "0")}:${String(secondsTaken).padStart(2, "0")}`;
        }
    
        return "00:00:00";  
    };

    const startTimer = (timeLimit: number) => {
        const endTime = Date.now() + timeLimit * 60 * 1000; // Calculate end time in milliseconds
        setIsTimeUp(false);
    
        const timer = setInterval(() => {
            const currentTime = Date.now();
            const timeLeft = Math.max(0, Math.floor((endTime - currentTime) / 1000)); // Calculate remaining time in seconds
    
            setRemainingTime(timeLeft);
    
            if (timeLeft === 0) {
                clearInterval(timer); // Stop timer when it reaches 0
                setIsTimeUp(true);
            }
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup function to clear the interval
    };
    
    // const startTimer = (timeLimit: number) => {
    //     setRemainingTime(timeLimit * 60);
    //     setIsTimeUp(false); 

    //     const timer = setInterval(() => {
    //         setRemainingTime((prevTime) => {
    //             if (prevTime === 0.5) {
    //                 clearInterval(timer); 
    //                 setIsTimeUp(true); 
    //                 return 0; 
    //             }
    //             return prevTime! - 0.5;
    //         });
    //     }, 1000);
    //     return () => clearInterval(timer);
    // };

    useEffect(() => {
        const quiz = quizzes.find((quiz: any) => quiz._id === qid && quiz.course == cid);
        if (quiz && quiz.time_limit) {
            setQuizStartTime(Date.now());
            startTimer(quiz.time_limit);
        }
        if (isTimeUp) {

            
            submit();
        }
    }, [cid, qid, quizzes, isTimeUp, navigate]);

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600); 
        const minutes = Math.floor((time % 3600) / 60);  
        const seconds = time % 60;  
    
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };
//----------------------------------------------------------------------------------------------------------//
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([fetchEnrollments(), fetchResults(), fetchAssignments(), fetchAssignmentsResults(),fetchQuizzes()]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; 
        }
        
    return (
        <div className="container-fluid" id="wd-take-quiz">


        {quizzes.filter((quiz:any)=>quiz.course == cid && quiz._id == qid)
        .map((quiz:any)=> (
            <>
            <div className="row d-flex">
            <div className="col-8 me-5 ">
            <div className="row mb-2">
                <h4 style={{ fontWeight: "bold" }}> {`${quiz.title}`} </h4>
            </div>
            <hr />


            <div className="row mb-2">
            <h4><strong>Quiz Instructions</strong></h4>
            </div>
            <hr />

            <div className="row ms-1">
                {quiz.description}

            </div>
            <hr />
            


            {question.length > 0 && (
                <>
                {(quiz?.one_question_at_a_time==true) &&
                <>

                <div className="row mt-3">

                    <ul className="list-group rounded-0 border-0">
                        <li className="list-group-item border-0">

                            <ul className="list-group rounded-0 border border-dark border-opacity-25">
                                <li className="list-group-item border" style={{ backgroundColor: '#f0f0f0' }}>
                                    <div className="row-auto mb-3">
                                        <div className="col float-start me-2"></div>
                                        <div className="col float-start ms-2 text-body" style={{fontWeight:"bold"}}>{question[currentQuestionIndex]?.title}</div>
                                        <div className="col float-end me-3 text-body" style={{fontWeight:"bold"}}>{question[currentQuestionIndex]?.points} Pts</div>
                                    </div>
                                </li>

                                <li className="list-group-item border-0">
                                    <br />
                                    <div className="row ms-4">
                                        {question[currentQuestionIndex]?.description}
                                    </div>
            
                                </li>

                                <li className="list-group-item border-0">

                                    {(question[currentQuestionIndex]?.type === "Multiple Choice" ) && 
                                    question[currentQuestionIndex]?.answers?.map((answer: any, index: number) => (
                                        <>
                                        <hr className="ms-4" style={{width:"95%"}}/>
                                        <div className="row">
                                            <div className="col-auto ms-5" >
                                                <input type="radio" 
                                                checked={userAnswers[question[currentQuestionIndex]._id] === answer}
                                                onChange={() => handleAnswerSelection(question[currentQuestionIndex]._id, answer)}
                                                className="me-3" id={`wd-answer-${index}`}/>
                                            </div>
                                            <div className="col-auto">
                                            <label htmlFor={`wd-answer-${index}`} className="form-label">
                                                {`${answer}`} 
                                            </label>
                                            </div>
                                        </div>  
                                        </>
                                    ))
                                }

                                    {(question[currentQuestionIndex]?.type === "True or False" ) && 
                                    question[currentQuestionIndex]?.answers?.map((answer: any, index: number) => (
                                        <>
                                        
                                        <div className="row mb-2">
                                        <hr className="ms-4" style={{width:"95%"}}/>
                                        <div className="row">
                                            <div className="col-auto">
                                                <input
                                                    type="radio"
                                                    name="trueFalseAnswer"
                                                    className="ms-3"
                                                    checked={userAnswers[question[currentQuestionIndex]._id] === "True"}
                                                    onChange={() => handleAnswerSelection(question[currentQuestionIndex]._id, "True")}
                                                />
                                            </div>
                                            <div className="col">True</div>
                                        </div>
                                        <hr className="ms-4" style={{width:"95%"}}/>
                                        <div className="row">
                                            <div className="col-auto">
                                                <input
                                                    type="radio"
                                                    name="trueFalseAnswer"
                                                    className="ms-3"
                                                    checked={userAnswers[question[currentQuestionIndex]._id] === "False"}
                                                    onChange={() => handleAnswerSelection(question[currentQuestionIndex]._id, "False")}
                                                />
                                            </div>
                                            <div className="col">False</div>
                                        </div>
                                        </div>  
                                        </>
                                    ))
                                }


                                    {(question[currentQuestionIndex]?.type === "Fill in the Blank" ) && 
                                    (       <>
                                        
                                        <div className="row mb-2">
                                        <hr className="ms-4" style={{width:"95%"}}/>
                                        <div className="row"> 
                                            <input type="text" name="FillInBlank" className="ms-4" style={{width:"10%"}}
                                            value={userAnswers[question[currentQuestionIndex]._id] || ""}
                                            onChange={(e) => handleAnswerSelection(question[currentQuestionIndex]._id, e.target.value)}/>
                                            </div>
                                            
                                        </div>

                                        </>)
                                }

                                </li>
                            </ul>
                            </li>
                            </ul>
                        </div>
                
                        
                    <div className="row mb-5">
                    <div className="col">
                    <button
                        className="btn btn-secondary mt-2 rounded-0 border border-light"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    ><IoMdArrowDropleft className="me-1"/>
                        Previous
                    </button>
                    </div>


                    <div className="col">
                    <button 
                        className="btn btn-secondary mt-2 float-end me-5 rounded-0 border border-light"
                        onClick={handleNext}
                        disabled={currentQuestionIndex === question.length - 1}
                    >
                        Next <IoMdArrowDropright />
                    </button>
                    </div>
                    </div>

                    <div className="row border border-1 border-dark border p-3 mb-5">
                        <div className="col">
                        <button className="btn btn-secondary float-end  rounded-0 border border-light position-relative end-10" style={{width:"20%"}}
                        onClick={submit}>
                            Submit Quiz
                        </button>
                        </div>

                    </div>

                    <br /><br /><br />

                    </>    
            }


        {(quiz?.one_question_at_a_time==false) &&
                <>
                <div className="row mt-3">
                    <ul className="list-group rounded-0 border-0">
                        {questions.filter((q:any)=> q.quizId===qid && q.courseId===cid)
                        .map((question:any, index:any)=>(
                            
                        
                        <li className="list-group-item border-0 mb-5" key={index}
                        ref={(el) => (questionRefs.current[index] = el)}>

                            <ul className="list-group rounded-0 border border-dark border-opacity-25">
                                <li className="list-group-item border" style={{ backgroundColor: '#f0f0f0' }}>
                                    <div className="row-auto mb-3">
                                        <div className="col float-start me-2"></div>
                                        <div className="col float-start ms-2 text-body" style={{fontWeight:"bold"}}>{question?.title}</div>
                                        <div className="col float-end me-3 text-body" style={{fontWeight:"bold"}}>{question?.points} Pts</div>
                                    </div>
                                </li>

                                <li className="list-group-item border-0">
                                    <br />
                                    <div className="row ms-4">
                                        {question?.description}
                                    </div>
            
                                </li>

                                <li className="list-group-item border-0">

                                    {(question.type === "Multiple Choice" ) && 
                                    question.answers?.map((answer: any, index: number) => (
                                        <>
                                        <hr className="ms-4" style={{width:"95%"}}/>
                                        <div className="row">
                                            <div className="col-auto ms-5" >
                                                <input type="radio" 
                                                checked={userAnswers[question._id] === answer}
                                                onChange={() => handleAnswerSelection(question._id, answer)}
                                                className="me-3" id={`wd-answer-${index}`}/>
                                            </div>
                                            <div className="col-auto">
                                            <label htmlFor={`wd-answer-${index}`} className="form-label">
                                                {`${answer}`} 
                                            </label>
                                            </div>
                                        </div>  
                                        </>
                                    ))
                                }

                                    {(question?.type === "True or False" ) && 
                                    question?.answers?.map((answer: any, index: number) => (
                                        <>
                                        
                                        <div className="row mb-2">
                                        <hr className="ms-4" style={{width:"95%"}}/>
                                        <div className="row">
                                            <div className="col-auto">
                                                <input
                                                    type="radio"
                                                    name="trueFalseAnswer"
                                                    className="ms-3"
                                                    checked={userAnswers[question._id] === "True"}
                                                    onChange={() => handleAnswerSelection(question._id, "True")}
                                                />
                                            </div>
                                            <div className="col">True</div>
                                        </div>
                                        <hr className="ms-4" style={{width:"95%"}}/>
                                        <div className="row">
                                            <div className="col-auto">
                                                <input
                                                    type="radio"
                                                    name="trueFalseAnswer"
                                                    className="ms-3"
                                                    checked={userAnswers[question._id] === "False"}
                                                    onChange={() => handleAnswerSelection(question._id, "False")}
                                                />
                                            </div>
                                            <div className="col">False</div>
                                        </div>
                                        </div>  
                                        </>
                                    ))
                                }


                            {(question?.type === "Fill in the Blank" ) && 
                                    (       <>
                                        
                                        <div className="row mb-2">
                                        <hr className="ms-4" style={{width:"95%"}}/>
                                        <div className="row"> 
                                            <input type="text" name="FillInBlank" className="ms-4" style={{width:"10%"}}
                                            value={userAnswers[question._id] || ""}
                                            onChange={(e) => handleAnswerSelection(question._id, e.target.value)}/>
                                            </div>
                                            
                                        </div>

                                        </>)
                                }

                                </li>
                            </ul>
                            </li>
                            ))}
                            </ul>
                        </div>
                        

                    <div className="row border border-1 border-dark border p-3 mb-5">
                        <div className="col">
                        <button className="btn btn-secondary float-end  rounded-0 border border-light position-relative end-10" style={{width:"20%"}}
                        onClick={submit}>
                            Submit Quiz
                        </button>
                        </div>

                    </div>

                    <br /><br /><br />

                    </>    
            }
                </>
            )}
            </div>



            <div className="col-3">
            <div className="row mb-2">
                <div className="row"><h5>Questions</h5></div>

                        {question.map((q:any, index:number)=>(
                            <div
                            className="row text-danger ms-4"
                            key={index}
                            style={{ cursor: "pointer" }}
                            onClick={() => {setCurrentQuestionIndex(index); scrollToQuestion(index)}}
                        >
                                <div className="col-auto"><FaRegQuestionCircle /></div>
                                <div className="col-auto">Question {`${index+1}`}</div>
                            </div>
                        ))}

                    </div>

                <div className="row">
                    <div className="row"><h5>Remaining Time</h5></div>
                    {!isTimeUp ? formatTime(remainingTime ?? 0) : null}

                </div>


            </div>
            </div>

            </>
        ))}
        </div>
    );
}