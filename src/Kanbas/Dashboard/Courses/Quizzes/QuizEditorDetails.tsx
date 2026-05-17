import { useParams } from "react-router";
import Editor from 'react-simple-wysiwyg';
import { useEffect, useState } from 'react';
import { MdDateRange } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setQuizzes } from "./quizzesReducer";

import * as coursesClient from "../client";


export default function QuizEditorDetails({setQuizTitle, setQuizAvailableFrom, setQuizAvailableUntil, setQuizDueDate,setQuizScore,
    setQuizPoints, setQuizNumberAttempts, setQuizType, setQuizAssignmentGroup, setQuizShuffle, setQuizTimeLimit, setQuizMultipleAttempts, showCorrectAnswersWhen,
    setQuizNumberQuestions, setQuizShowCorrectAnswers, setQuizAccessCode, setQuizOneQuestionAtATime, setQuizWebcamRequired, setQuizAvailability,
    setQuizLockQuestions, setQuizDescription, setNewQuizTitle, setNewQuizAvailableFrom, setNewQuizAvailableUntil, setNewQuizDueDate,setNewQuizScore, setShowCorrectAnswersWhen,
    setNewQuizPoints, setNewQuizNumberAttempts, setNewQuizType, setNewQuizAssignmentGroup, setNewQuizShuffle, setNewQuizTimeLimit, setNewQuizMultipleAttempts,
    setNewQuizNumberQuestions, setNewQuizShowCorrectAnswers, setNewQuizAccessCode, setNewQuizOneQuestionAtATime, setNewQuizWebcamRequired, setNewQuizAvailability,setPublished, setNewPublished,
    setNewQuizLockQuestions, setNewQuizDescription, quizzes, newQuizId, handleUpdateQuiz, handleCancelQuiz, setPercentage, setNewPercentage}:{
    setQuizTitle:any, setQuizAvailableFrom:any, setQuizAvailableUntil:any, setQuizDueDate:any,setQuizScore:any,
    setQuizPoints:any, setQuizNumberAttempts:any, setQuizType:any, setQuizAssignmentGroup:any, setQuizShuffle:any, setQuizTimeLimit:any, setQuizMultipleAttempts:any, showCorrectAnswersWhen:any,
    setQuizNumberQuestions:any, setQuizShowCorrectAnswers:any, setQuizAccessCode:any, setQuizOneQuestionAtATime:any, setQuizWebcamRequired:any, 
    setQuizLockQuestions:any, setQuizDescription:any, setQuizAvailability: any, setNewQuizAvailability:any,
    setNewQuizTitle:any, setNewQuizAvailableFrom:any, setNewQuizAvailableUntil:any, setNewQuizDueDate:any,setNewQuizScore:any,
    setNewQuizPoints:any, setNewQuizNumberAttempts:any, setNewQuizType:any, setNewQuizAssignmentGroup:any, setNewQuizShuffle:any, setNewQuizTimeLimit:any, setNewQuizMultipleAttempts:any, setShowCorrectAnswersWhen:any,
    setNewQuizNumberQuestions:any, setNewQuizShowCorrectAnswers:any, setNewQuizAccessCode:any, setNewQuizOneQuestionAtATime:any, setNewQuizWebcamRequired:any, setPublished:any, setNewPublished:any,
    setNewQuizLockQuestions:any, setNewQuizDescription:any, quizzes:any, newQuizId:any, handleUpdateQuiz:(b:boolean)=>void, handleCancelQuiz:()=>void, setPercentage:any, setNewPercentage:any
    }
) {
    const { cid, qid } = useParams()
  

    const [isTimeLimitEnabled, setIsTimeLimitEnabled] = useState(false);



    const calculateAvailability = (dueDate: any, availableFrom: any, availableUntil: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    

        const dueDateObj = dueDate instanceof Date ? dueDate : new Date(dueDate);
        const availableFromObj = availableFrom instanceof Date ? availableFrom : new Date(availableFrom);
        const availableUntilObj = availableUntil instanceof Date ? availableUntil : new Date(availableUntil);
    
 
        dueDateObj.setHours(0, 0, 0, 0);
        availableFromObj.setHours(0, 0, 0, 0);
        availableUntilObj.setHours(0, 0, 0, 0);
    
        if (today > availableUntilObj) {
            setNewQuizAvailability("Closed")

        }
    
        if (today > availableFromObj && today < availableUntilObj) {
            setNewQuizAvailability("Available")

        }
    
        if (today < availableFromObj) {
            setNewQuizAvailability("Not Available Until")

        }
        

    };

    useEffect(() => {

        calculateAvailability(setQuizDueDate, setQuizAvailableFrom, setQuizAvailableUntil);

    }, [setQuizDueDate, setQuizAvailableFrom, setQuizAvailableUntil]);

    const quiz = quizzes.find((q:any) => q._id === qid && q.course === cid);
    const dispatch = useDispatch()
   const fetchQuizzes = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));

      };
      useEffect(() => {
        if (!quiz) {
            fetchQuizzes();
        } else {
            setNewQuizTitle(quiz.title || "New Quiz");
            setNewQuizDescription(quiz.description || "")
            setNewQuizAvailableFrom(quiz.available_from || "");
            setNewQuizAvailableUntil(quiz.available_until || "");
            setNewQuizDueDate(quiz.due_date || "");
            setNewQuizPoints(quiz.points || "0");
            setNewQuizType(quiz.quiz_type || "Graded Quiz");
            setNewQuizShuffle(quiz.shuffle_answers || true);
            setNewQuizMultipleAttempts(quiz.multiple_attempts || false);
            setNewQuizShowCorrectAnswers(quiz.show_correct_answers || true);
            setShowCorrectAnswersWhen(
                (quiz.show_correct_answers_when==="" ? "Immediately" : quiz.show_correct_answers_when) ?? "Immediately"
            );
            setNewQuizAccessCode(quiz.access_code || "");
            setNewQuizOneQuestionAtATime(quiz.one_question_at_a_time ?? true);
            setNewQuizTimeLimit(quiz.time_limit || "20");
            setNewQuizNumberAttempts(quiz.number_attempts || "1");
            setNewQuizAssignmentGroup(quiz.assignment_group || "QUIZZES");
            setNewQuizNumberQuestions(quiz.number_questions || "0");
            setNewQuizScore(quiz.score || "");
            setNewQuizWebcamRequired(quiz.webcam_required || false);
            setNewQuizLockQuestions(quiz.lock_questions_after_answering || false);
            setNewPublished(quiz.published || false);
            setNewPercentage(quiz.percentage || null);
        }
    }, [
        dispatch,
        quiz,
        qid,
        setNewQuizTitle,
        setNewQuizAvailableFrom,
        setNewQuizAvailableUntil,
        setNewQuizDueDate,
        setNewQuizPoints,
        setNewQuizType,
        setNewQuizShuffle,
        setNewQuizMultipleAttempts,
        setNewQuizShowCorrectAnswers,
        setShowCorrectAnswersWhen,
        setNewQuizAccessCode,
        setNewQuizOneQuestionAtATime,
        setNewQuizTimeLimit,
        setNewQuizNumberAttempts,
        setNewQuizAssignmentGroup,
        setNewQuizNumberQuestions,
        setNewQuizScore,
        setNewQuizWebcamRequired,
        setNewQuizLockQuestions,
        setNewPublished,
        setNewPercentage,
    ]);
    return (
        <div className="container-fluid">

            <div id="wd-quiz-editor-details" className="p-2 row">
 


                            <div className="row mb-4"><input id="wd-quiz-editor-title" value={setQuizTitle} type="text" className="form-control" style={{ width: "70%" }} 
                            onChange={(e) => setNewQuizTitle(e.target.value)}/></div>
                            <div className="row mb-1"><p >Quiz Instructions:</p></div>
                            <div className="row mb-5"><Editor value={setQuizDescription} onChange={(e) => setNewQuizDescription(e.target.value)} /></div>

                            <div className="row mb-2" style={{ position: "relative", left: "-200px" }}>
                                <div className="row mb-2">
                                    <div className="col" style={{ textAlign: "right" }}>
                                        <label htmlFor="wd-quiz-editor-type" className="form-label">Quiz Type</label>
                                    </div>
                                    <div className="col">
                                        <select value = {setQuizType} id="wd-quiz-editor-type" className="form-select" onChange={(e) => setNewQuizType(e.target.value.toString())}>
                                            <option value="Graded Quiz">Graded Quiz</option>
                                            <option value="Practice Quiz">Practice Quiz</option>
                                            <option value="Graded Survey">Graded Survey</option>
                                            <option value="Ungraded Survey">Ungraded Survey</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col" style={{ textAlign: "right" }}>
                                        <label htmlFor="wd-quiz-editor-group" className="form-label">Assignment Group</label>
                                    </div>
                                    <div className="col">
                                        <select value = {setQuizAssignmentGroup} id="wd-quiz-editor-group" className="form-select" onChange={(e) => setNewQuizAssignmentGroup(e.target.value.toString())}>
                                            <option value="QUIZZES">QUIZZES</option>
                                            <option value="EXAMS">EXAMS</option>
                                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                                            <option value="PROJECTS">PROJECTS</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col" style={{ textAlign: "right" }}>
                                        <label className="form-label"></label>
                                    </div>

                                    <div className="col">
                                        <ul className="list-group rounded-0 border-0">
                                            <li className="list-group-item border-0">
                                                <div className="row"><label className="form-label" style={{ fontWeight: "bold" }}>Options</label></div>
                                            </li>

                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                    <div className="col mt-1">
                                                        <label htmlFor="wd-quiz-editor-percentage">Percentage</label></div>
                                                    <div className="col"><input type="text" name="wd-quiz-editor-percentage" id="wd-quiz-editor-percentage"
                                                        value = {setPercentage} onChange={(e) => setNewPercentage(parseInt(e.target.value))} /></div>
                                                </div>
                                            </li>

                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                    <div className="col"><input type="checkbox" name="wd-quiz-editor-timelimit" id="wd-quiz-editor-timelimit" className="form-check-input me-2"
                                                        checked={isTimeLimitEnabled}
                                                        onChange={(e) => setIsTimeLimitEnabled(e.target.checked)} />
                                                        <label htmlFor="wd-quiz-editor-timelimit">Time Limit</label></div>
                                                    <div className="col"><input type="text" name="wd-quiz-editor-timelimit" id="wd-quiz-editor-timelimit" style={{ width: "20%" }}
                                                        value = {setQuizTimeLimit} onChange={(e) => setNewQuizTimeLimit(e.target.value)} disabled={!isTimeLimitEnabled} />
                                                        <label htmlFor="wd-quiz-editor-timelimit" className="ms-1">Minutes</label></div>
                                                </div>
                                            </li>
                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                <div className="col-auto"><input type="checkbox" name="wd-quiz-editor-attempts" id="wd-quiz-editor-attempts" className="form-check-input me-2"
                                                    checked = {setQuizMultipleAttempts} onChange={() => {setNewQuizMultipleAttempts((prev: any) => !prev); {if (setQuizMultipleAttempts) { setNewQuizNumberAttempts("1")}} }} />
                                                    <label htmlFor="wd-quiz-editor-attempts">Allow Multiple Attempts</label></div>
                                                <div className="col"><input type="text" name="wd-quiz-editor-nbre-attempts" id="wd-quiz-editor-nbre-attempts" style={{ width: "20%" }}
                                                    value = {(setQuizMultipleAttempts) ? setQuizNumberAttempts : "1"} onChange={(e) => {(setQuizMultipleAttempts) ? setNewQuizNumberAttempts(e.target.value) : setNewQuizNumberAttempts("1")}} disabled={!setQuizMultipleAttempts} />
                                                    <label htmlFor="wd-quiz-editor-timelimit" className="ms-1">Attempts</label></div>
                                                </div>
                                            </li>

                                            <li className="list-group-item border-0">
                                                <div className="row mb-3">
                                                    <div className="col"><input type="checkbox" name="wd-quiz-editor-show" id="wd-quiz-editor-show" className="form-check-input me-2"
                                                    checked = {setQuizShowCorrectAnswers} onChange={(e) => setNewQuizShowCorrectAnswers(e.target.checked)}/>
                                                        <label htmlFor="wd-quiz-editor-show">Show Correct Answers</label></div>
                                                </div>

                                                {setQuizShowCorrectAnswers ? 
                                                <div className="col">
                                    
                                                    <select
                                                        id="wd-quiz-editor-show-when"
                                                        className="form-select"
                                                        value={showCorrectAnswersWhen} // Tie value to state
                                                        onChange={(e) => setShowCorrectAnswersWhen(e.target.value)} // Update state on change
                                                    >
                                                        <option value="Immediately">Immediately</option>
                                                        <option value="Choose Date">Choose Date</option>
                                                        {/* Include a fallback option for any existing value */}
                                                        {showCorrectAnswersWhen &&
                                                            !["Immediately", "Choose Date"].includes(showCorrectAnswersWhen) && (
                                                                <option value={showCorrectAnswersWhen}>{showCorrectAnswersWhen}</option>
                                                            )}
                                                        </select>

                                                    {showCorrectAnswersWhen === "Choose Date" && (
                                                        <div className="input-group mt-2">
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={showCorrectAnswersWhen !== "Choose Date" ? "" : showCorrectAnswersWhen}
                                                            
                                                                onChange={(e) => setShowCorrectAnswersWhen(e.target.value)}
                                                            />
                                                        </div>
                                                    )}
                                                </div> : null}

                                                
  
                                            </li>

                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                    <div className="col mt-1">
                                                        <label htmlFor="wd-quiz-editor-code">Access Code</label></div>
                                                    <div className="col"><input type="text" name="wd-quiz-editor-code" id="wd-quiz-editor-code"
                                                        value = {setQuizAccessCode} onChange={(e) => setNewQuizAccessCode(e.target.value)} /></div>
                                                </div>
                                            </li>

                                            <li className="list-group-item border-0">
                                                <div className="col"><input type="checkbox" name="wd-quiz-editor-order" id="wd-quiz-editor-order" className="form-check-input me-2"
                                                    checked = {setQuizOneQuestionAtATime} onChange={() => setNewQuizOneQuestionAtATime((prev: any) => !prev)} />
                                                    <label htmlFor="wd-quiz-editor-order">One Question at a Time</label></div>
                                            </li>



                                        </ul>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col" style={{ textAlign: "right" }}>
                                        <label htmlFor="wd-assign-to" className="form-label">Assign</label>
                                    </div>

                                    <div className="col">
                                        <ul className="list-group rounded-0 border">

                                            <li className="list-group-item border-0">
                                                <div className="row"><label htmlFor="wd-assign-to" className="form-label" style={{ fontWeight: "bold" }}>Assign to</label></div>
                                                <div className="row"><input type="text" name="wd-assign-to" id="wd-assign-to" className="form-control me-2" value="Everyone" /></div>
                                            </li>


                                            <li className="list-group-item border-0">
                                                <div className="row"><label htmlFor="wd-due-date" className="wd-due-date" style={{ fontWeight: "bold" }}>Due</label></div>
                                                <div className="row"><div className="input-group"><input type="date" name="wd-due-date" id="wd-due-date" className="form-control" value={setQuizDueDate ? new Date(setQuizDueDate).toISOString().split("T")[0] : ""}
                                                    onChange={(e) => setNewQuizDueDate(new Date (e.target.value))} /></div></div>
                                            </li>

                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="row"><label htmlFor="wd-available-from" className="wd-available-from" style={{ fontWeight: "bold" }}>Available From</label></div>
                                                        <div className="row"><div className="input-group"><input type="date" name="wd-available-from" id="wd-available-from" className="form-control" value={setQuizAvailableFrom ? new Date(setQuizAvailableFrom).toISOString().split("T")[0] : ""}
                                                            onChange={(e) => setNewQuizAvailableFrom(new Date (e.target.value))} /></div></div>
                                                    </div>

                                                    <div className="col">
                                                        <div className="row"><label htmlFor="wd-available-until" className="wd-available-until" style={{ fontWeight: "bold" }}>Until</label></div>
                                                        <div className="row"><div className="input-group"><input type="date" name="wd-available-until" id="wd-available-until" className="form-control" value={setQuizAvailableUntil ? new Date(setQuizAvailableUntil).toISOString().split("T")[0] : ""}
                                                            onChange={(e) => setNewQuizAvailableUntil(new Date (e.target.value))} /></div></div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>


                                </div>
                            </div>



                <hr />
                <div className="row mt-2 mb-4">
                    <div className="col d-flex justify-content-center">
                            <button className="btn btn-secondary rounded-1 me-2" type="submit" onClick={()=> {handleCancelQuiz()}}>Cancel</button>
                            <button className="btn btn-primary rounded-1 me-2" type="submit" onClick = {()=>{setNewPublished(false); handleUpdateQuiz(false)}}>Save</button>
                            <button className="btn btn-primary rounded-1" type="submit" onClick = {()=>{setNewPublished(true); handleUpdateQuiz(true)}}>Save & Publish</button>

                    </div>
                </div>

                <hr />

            </div>
        </div>
    );

}
