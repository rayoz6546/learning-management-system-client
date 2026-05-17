import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { setResults } from "../Quizzes/resultsReducer";
import { setQuizzes } from "../Quizzes/quizzesReducer";
import * as resultsClient from "../Quizzes/resultsClient";
import * as coursesClient from "../client";
import { FaArrowRight } from "react-icons/fa6";

export default function StudentQuizResults() {
    const {cid, uid, qid} = useParams()
    const {quizzes} = useSelector((state:any) => state.quizzesReducer)

    const questions = quizzes.flatMap((quiz: any) =>
        (quiz.questions || []).map((question: any) => ({
            ...question,
            quizId: quiz._id,
            courseId: quiz.course,
        }))
    );
    const dispatch = useDispatch()

    const quiz = quizzes.find((quiz:any)=>quiz.course === cid && quiz._id === qid)

    const {results} = useSelector((state:any)=> state.resultsReducer)
    const result = results.find((res:any)=>res.quizId === qid && res.courseId=== cid && res.userId === uid)
    const fetchResults = async () => {
        const results = await resultsClient.fetchResults(qid as string, uid as string)
        dispatch(setResults(results))
    }
    const today = new Date()

    const fetchQuizzes = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
    
        dispatch(setQuizzes(quizzes));
        };

 
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const fetchData = async () => {
                await fetchResults();
                await fetchQuizzes();
                setIsLoading(false); 
            };
            fetchData();
        }, []);

    if (isLoading) {
        return <div>Loading...</div>; 
    }
    return (
        <div className="container-fluid" id="wd-take-quiz">
            
                <div className="row d-flex">
                <div className="col-8 me-5 ">
                <div className="row mb-2">
                    <h4 style={{ fontWeight: "bold" }}> {`${quiz.title}`} </h4>
                </div>
                <hr />

                <div className="row mb-3">
                    <table className="table table-borderless mb-1">
                        <tbody>
                            <tr className="table">
                                
                                    <div className="details-row">
                                        <div><strong>Due</strong>{`${quiz.due_date}`.toString().split("T")[0]}</div>
                                        <div><strong>Points</strong>{quiz.points}</div>
                                        <div><strong>Questions</strong>{quiz.number_questions}</div>
                                        <div><strong>Available</strong>{`${quiz.available_from}`.toString().split("T")[0]} - {`${quiz.available_until}`.toString().split("T")[0]}</div>
                                        
                                    </div>
                                
                            </tr>
                            <tr style={{fontSize:"14px"}}>
                                <strong className="ms-2">Time Limit</strong> {quiz.time_limit} Minutes
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                </div></div>

     
                {result ? (
                               <>
                <div className="row mb-2">
                    <h5>Attempt History</h5>
                    <table className="table">
                        <thead>
                            <tr className="table"><th></th><th>Attempt</th><th>Time</th><th>Score</th></tr>
                        </thead>
                        <tbody>
                            <tr className="table"><td>LATEST</td><td>Attempt {result && result.attempt}</td><td>{result && result.timetaken}</td><td> {result && result.score} out of {quiz.points}</td></tr>
                        </tbody>
                    </table>
                    </div>
                <div className="row">
                    <p>Score for this Quiz:  <strong style={{fontSize:"20px"}}>{result && result.score}</strong> out of {quiz.points} <br />
                    Submitted {result && result.submitted_date} <br />
                    This attempt took {result && result.timetaken}</p>
                </div>


                <div className="row">
                    {questions.filter((q:any)=>q.quizId===qid && q.courseId===cid)
                    .map((question:any)=> (
                        <div className="row mb-3">

                        <ul className="list-group rounded-0 border-0">
                            <li className="list-group-item border-0">

                                <ul className="list-group rounded-0 border">
                                    <li className="list-group-item border" style={{ backgroundColor: '#f0f0f0' }}>
                                        <div className="row-auto mb-2">
                                            <div className="col float-start me-2"></div>
                                            <div className="col float-start">{question.title}</div>
                                            <div className="col float-end">{question.points} Pts</div>
                                        </div>
                                    </li>

                                    <li className="list-group-item border border-0 border-bottom">
                                        <div className="row ms-4 mt-3">
                                            {question.description}
                                        </div>
                                        <br />
                                    </li>

                                    <li className="list-group-item border border-0 ms-4 mb-3">

                                        {question?.type==="True or False" && (
                                            <>
                                  
                                            <div className="row mb-2">
                                                <div className="col-auto">
                                                    <input
                                                        type="radio"
                                                        name={`trueFalseAnswer-${question._id}`}
                                                    
                                                        checked={result.answers[question._id] == "True"}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="col-2 text-secondary">True</div>
                                                
                                                {((result.answers[question._id] === question.correct_answer) && (question.correct_answer==="True")) && (<div className="col text-success border-success border-start border-top" style={{fontWeight:"bold"}}><FaArrowRight className="fs-4"/> Correct!</div>)}
                                                {((result.answers[question._id] !== question.correct_answer) && ((question.correct_answer==="False") || (!result.answers[question._id]))) && (<div className="col text-danger border-danger border-start border-top" style={{fontWeight:"bold"}}><FaArrowRight className="fs-4"/> Incorrect!</div>)}
                                                
                                            </div>
                                    
                                            <div className="row">
                                                <div className="col-auto">
                                                    <input
                                                        type="radio"
                                                        name={`trueFalseAnswer-${question._id}`}
                                                
                                                        checked={result.answers[question._id] == "False"}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="col-2 text-secondary">False</div>

                                                {((result.answers[question._id] === question.correct_answer) && (question.correct_answer==="False")) && (<div className="col text-success border-success border-start border-top" style={{fontWeight:"bold"}}><FaArrowRight className="fs-4"/> Correct!</div>)}
                                                {((result.answers[question._id] !== question.correct_answer) && ((question.correct_answer==="True"))||(!result.answers[question._id])) && (<div className="col text-danger border-danger border-start border-top" style={{fontWeight:"bold"}}><FaArrowRight className="fs-4"/> Incorrect!</div>)}
                                            </div>

                                            </>)}


                                            {question?.type==="Multiple Choice" && (
                                                question.answers.map((answer:any, index:number)=>(
                                                    <div className="row mb-1" key={index}>
                                                    <ol className="list-group rounded-0 border-0">
                                                        <li className="list-group-item border-0">
                                                            <div className="row">
                                                                <div className="col-auto" >
                                                                    <p>{index+1}.</p>
                                                                </div>
                                                                <div className="col-auto">
                                                                    <input id={`wd-answer-${index}`} type="radio" className="me-3"checked={result.answers[question._id]===answer} disabled/>
                                                                </div>
                                                                <div className="col-auto">
                                                                <label htmlFor={`wd-answer-${index}`} className="form-label">{`${answer}`}</label>

                                                                </div>
                                                                {((result.answers[question._id] === question.correct_answer) && (answer === result.answers[question._id])) && (<div className="col text-success border-success border-start border-top" style={{fontWeight:"bold"}}><FaArrowRight className="fs-4"/> Correct!</div>) }
                                                                {((result.answers[question._id] !== question.correct_answer) && ((answer === result.answers[question._id]) || (!result.answers[question._id]))) && (<div className="col text-danger border-danger border-start border-top" style={{fontWeight:"bold"}}><FaArrowRight className="fs-4"/> Incorrect!</div>) }
                                                            </div>
                                                        </li>
                                                    </ol>
                                                </div>
                                                ))
                                            )}



                            {question?.type === "Fill in the Blank" && (
                                <div className="row mb-1">
   
                
                                    <ol className="list-group rounded-0 border-0">
                                        <li className="list-group-item border-0">
                                            <div className="row">
                                                <div className="col-auto">
                                                    <input 
                                                        type="text" 
                                                        className="form-control me-3" 
                                                        value={result.answers[question._id]} 
                                                        disabled
                                                    />
                                                </div>

                                               
                                                {(() => {
                                        
                                                    const correctAnswers = Array.isArray(question.correct_answer)
                                                        ? question.correct_answer
                                                        : [question.correct_answer];

                                                    const userAnswer = result.answers[question._id];
                                                    const isCorrect = correctAnswers.includes(userAnswer);

                                                   
                                                    return isCorrect ? (
                                                        <div className="col text-success border-success border-start border-top" style={{ fontWeight: "bold" }}>
                                                            <FaArrowRight className="fs-4" /> Correct!
                                                        </div>
                                                    ) : (
                                                        <div className="col text-danger border-danger border-start border-top" style={{ fontWeight: "bold" }}>
                                                            <FaArrowRight className="fs-4" /> Incorrect!
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            )}

                                    </li>

                                    {(quiz.show_correct_answers && (quiz.show_correct_answers_when==="Immediately" || quiz.show_correct_answers_when===today.toISOString().slice(0, 10))) && <li className="list-group-item border border-0 ms-4 mb-3" style={{color:"grey", fontWeight:"bold"}}>correct answer(s):<> </>
                                    {Array.isArray(question?.correct_answer) 
                                        ? <>
                                            {question.correct_answer.map((a:any, i:any)=> 
                                                <span key={i}>
                                                {a}
                                                {i < question.correct_answer.length - 1 ? ", " : ""}
                                                </span>
                                            )}

                                            </>
                                        : question.correct_answer}
                                    </li>}
                     
  


                                </ul>

                            </li>

                        </ul>

                    </div>
                    ))}

                    
                </div></>) : <><p>No Submission Yet</p></>}

        </div>
        </div>
    );
}