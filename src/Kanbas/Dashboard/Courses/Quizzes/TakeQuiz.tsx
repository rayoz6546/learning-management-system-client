import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { addResults } from "./resultsReducer";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";
import * as questionsClient from "./questionsClient";
import * as resultsClient from "./resultsClient";
import { setQuestions } from "./questionsReducer";
import { setQuizzes } from "./quizzesReducer";
import * as coursesClient from "../client";


export default function TakeQuiz() {
    const { cid, qid} = useParams()

    
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


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userAnswers, setUserAnswers] = useState([]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const questionRefs = useRef<any[]>([]);

    const [remainingTime, setRemainingTime] = useState<number | null>(null); 
    const [isTimeUp, setIsTimeUp] = useState(false); 
    const [quizStartTime, setQuizStartTime] = useState<number | null>(null); 


    const fetchQuestions = async () => {
        const questions = await questionsClient.fetchQuestions(qid as string);
        dispatch(setQuestions(questions));
      };
  

    const submit = async () => {

        if (!result) {
   
        const newResult = {
            _id: Date.now().toString(),
            quizId: qid,
            courseId: cid,
            userId: currentUser._id,
            score: calculateScore(),
            answers: userAnswers,
            timetaken: calculateTimeTaken().toString(),
            attempt: 1,
        }


        const new_result = await resultsClient.createResults(qid as string, currentUser._id, newResult)
        dispatch(addResults(new_result))}

        else {
            const updatedResult = {
                _id: result._id,
                quizId: qid,
                courseId: cid,
                userId: currentUser._id,
                score: calculateScore(),
                answers: userAnswers,
                timetaken: calculateTimeTaken().toString(),
                attempt: parseInt(result.attempt)+1,
            }
            await resultsClient.updateResults(updatedResult);
            dispatch(addResults(updatedResult));
        }
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuizResults`)

    }


        
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
        setRemainingTime(timeLimit * 60);
        setIsTimeUp(false); 

        const timer = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime === 1) {
                    clearInterval(timer); 
                    setIsTimeUp(true); 
                    return 0; 
                }
                return prevTime! - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    };

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
                                                <input type="checkbox" 
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
                                                <input type="checkbox" 
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