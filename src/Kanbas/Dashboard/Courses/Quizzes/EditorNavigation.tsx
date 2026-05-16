import React, { useEffect, useState } from "react";
import QuizEditor from "./QuizEditor"
import QuizEditorDetails from "./QuizEditorDetails"
import QuizEditorQuestions from "./QuizEditorQuestions"
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addQuiz,setQuizzes,updateQuiz } from "./quizzesReducer";
import { addQuestion, deleteQuestion, resetQuestions, setQuestions, updateQuestion } from "./questionsReducer";
import * as coursesClient from "../client";
import * as quizzesClient from "../Quizzes/client";
import * as questionsClient from "../Quizzes/questionsClient";


export default function EditorNavigation({newQuizId, quizzes, setPublished, setNewPublished}:{newQuizId:any, quizzes:any, setPublished:any, setNewPublished:any}) {
    const { cid, qid } = useParams()

    const quiz = quizzes.find((q:any) => q._id === qid && q.course === cid);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [setQuizTitle, setNewQuizTitle] = useState(quiz ? quiz.title : "New Quiz")
    const [setQuizAvailability, setNewQuizAvailability] = useState(quiz ? quiz.availability : "")
    const [setQuizAvailableFrom, setNewQuizAvailableFrom] = useState(quiz ? quiz.available_from : "")
    const [setQuizAvailableUntil, setNewQuizAvailableUntil] = useState(quiz ? quiz.available_until : "")
    const [setQuizDueDate, setNewQuizDueDate] = useState(quiz ? quiz.due_date : "")
    const [setQuizPoints, setNewQuizPoints] = useState(quiz ? quiz.points : "0")
    const [setQuizNumberQuestions, setNewQuizNumberQuestions] = useState(quiz ? quiz.number_questions : "0")
    const [setQuizScore, setNewQuizScore] = useState(quiz ? quiz.score : "")
    const [setQuizType, setNewQuizType] = useState(quiz ? quiz.quiz_type : "Graded Quiz")
    const [setQuizAssignmentGroup, setNewQuizAssignmentGroup] = useState(quiz ? quiz.assignment_group : "QUIZZES")
    const [setQuizShuffle, setNewQuizShuffle] = useState(quiz ? quiz.shuffle_answers : true)
    const [setQuizTimeLimit, setNewQuizTimeLimit] = useState(quiz ? quiz.time_limit : "20")
    const [setQuizMultipleAttempts, setNewQuizMultipleAttempts] = useState(quiz ? quiz.multiple_attempts : false)
    const [setQuizNumberAttempts, setNewQuizNumberAttempts] = useState(quiz ? quiz.number_attempts : "1")
    const [setQuizShowCorrectAnswers, setNewQuizShowCorrectAnswers] = useState(quiz ? quiz.show_correct_answers : true)
    const [setQuizAccessCode, setNewQuizAccessCode] = useState(quiz ? quiz.access_code : "None")
    const [setQuizOneQuestionAtATime, setNewQuizOneQuestionAtATime] = useState(quiz ? quiz.one_question_at_a_time : true)
    const [setQuizWebcamRequired, setNewQuizWebcamRequired] = useState(quiz ? quiz.webcam_required : false)
    const [setQuizLockQuestions, setNewQuizLockQuestions] = useState(quiz ? quiz.lock_questions_after_answering : false)

    const [setQuizDescription, setNewQuizDescription] = useState(quiz ? quiz.description : "")
    const [setQuizQuestions, setNewQuizQuestions] = useState(quiz ? quiz.questions : [])

    const [questionsToDelete, setQuestionsToDelete] = useState([])
    const [questionsToAdd, setQuestionsToAdd] = useState([])
    const [questionsToUpdate, setQuestionsToUpdate]= useState([])

    const [stagedQuestions, setStagedQuestions] = useState<any[]>([]);

    const { questions } = useSelector((state: any) => state.questionsReducer); 

    const fetchQuestions = async () => {
        const questions = await questionsClient.fetchQuestions(qid as string);
        dispatch(setQuestions(questions));
      };

    useEffect(() => {


        if (quiz && quiz.questions) {
            setStagedQuestions([...quiz.questions]);
        }
    }, [quiz]);

    const handleSaveQuestions = () => {

        setStagedQuestions([...stagedQuestions]);
    };

    const handleCancelQuestions = () => {

        if (quiz) {

        setStagedQuestions([...quiz.questions]); }


        else {
            setStagedQuestions([])
        }

        
    }


    const handleUpdateQuiz = async () => {


 
        const newQuizQuestions = stagedQuestions.length;

        const newQuizPoints = stagedQuestions.reduce((total: number, question: any) => total + parseInt(question.points, 10), 0);


        if (quiz) {
                const updatedQuiz = {
                _id: qid,
                title: setQuizTitle,
                course: cid,
                availability: setQuizAvailability,
                available_from: setQuizAvailableFrom,
                available_until: setQuizAvailableUntil,
                due_date: setQuizDueDate,
                points: newQuizPoints,
                number_questions: newQuizQuestions,
                score: setQuizScore,
                quiz_type: setQuizType,
                assignment_group: setQuizAssignmentGroup,
                shuffle_answers: setQuizShuffle,
                time_limit: setQuizTimeLimit,
                multiple_attempts: setQuizMultipleAttempts,
                number_attempts: setQuizNumberAttempts,
                show_correct_answers: setQuizShowCorrectAnswers,
                access_code: setQuizAccessCode,
                one_question_at_a_time: setQuizOneQuestionAtATime,
                webcam_required: setQuizWebcamRequired,
                lock_questions_after_answering: setQuizLockQuestions,
                description: setQuizDescription,
                published: setPublished,
                questions: stagedQuestions,}

            await quizzesClient.updateQuiz(updatedQuiz);
            dispatch(updateQuiz(updatedQuiz));
        } else {
                const newQuiz = {                
                _id: newQuizId,
                title: setQuizTitle,
                course: cid,
                availability: setQuizAvailability,
                available_from: setQuizAvailableFrom,
                available_until: setQuizAvailableUntil,
                due_date: setQuizDueDate,
                points: newQuizPoints,
                number_questions: newQuizQuestions,
                score: setQuizScore,
                quiz_type: setQuizType,
                assignment_group: setQuizAssignmentGroup,
                shuffle_answers: setQuizShuffle,
                time_limit: setQuizTimeLimit,
                multiple_attempts: setQuizMultipleAttempts,
                number_attempts: setQuizNumberAttempts,
                show_correct_answers: setQuizShowCorrectAnswers,
                access_code: setQuizAccessCode,
                one_question_at_a_time: setQuizOneQuestionAtATime,
                webcam_required: setQuizWebcamRequired,
                lock_questions_after_answering: setQuizLockQuestions,
                description: setQuizDescription,
                published: setPublished,
                questions: stagedQuestions,}

            const new_quiz = await coursesClient.createQuizForCourse(cid as string, newQuiz);
            dispatch(addQuiz(new_quiz));
        }
    
        // // Commit questions to the server
        // const currentQuestions = questions.filter((q:any) => q.quizId === qid);
    
        // // Add or update questions
        // for (const question of stagedQuestions) {

        //     if (!currentQuestions.find((q:any) => q._id === question._id)) {
        //         const new_q = await questionsClient.createQuestion(qid as string, question); // New question
        //         dispatch(addQuestion(new_q))
        //     } else {
        //         await questionsClient.updateQuestion(question); // Update existing question
        //         dispatch(updateQuestion(question))
        //     }
        // }
    
        // // Delete removed questions
        // for (const question of currentQuestions) {
        //     if (!stagedQuestions.find((q) => q._id === question._id)) {
        //         await questionsClient.deleteQuestion(question._id);
        //         dispatch(deleteQuestion(question._id))
        //     }
        // }
        
        dispatch(setQuestions(stagedQuestions)); 



    
    }

    

    const handleCancelQuiz = () => {

        if (quiz) {
        setStagedQuestions([...quiz.questions]);}
        else {
            setStagedQuestions([])
        }
        navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    }




    return (
        <div id="wd-quiz-editor-navigation">
            <QuizEditor />
            <Routes>
                <Route path={`/Kanbas/Courses/${cid}/Quizzes/${qid}/Editor/*`} element={<Navigate to="Details" />} />
                <Route path="Details" element={<QuizEditorDetails 
                setQuizTitle={setQuizTitle} setQuizAvailableFrom={setQuizAvailableFrom} setQuizAvailableUntil={setQuizAvailableUntil} setQuizDueDate={setQuizDueDate} setQuizScore={setQuizScore}
                setQuizPoints={setQuizPoints} setQuizNumberAttempts={setQuizNumberAttempts} setQuizType={setQuizType} setQuizAssignmentGroup={setQuizAssignmentGroup} setQuizShuffle={setQuizShuffle} setQuizTimeLimit={setQuizTimeLimit} setQuizMultipleAttempts={setQuizMultipleAttempts}
                setQuizNumberQuestions={setQuizNumberQuestions} setQuizShowCorrectAnswers={setQuizShowCorrectAnswers} setQuizAccessCode={setQuizAccessCode} setQuizOneQuestionAtATime={setQuizOneQuestionAtATime} setQuizWebcamRequired={setQuizWebcamRequired} 
                setQuizLockQuestions={setQuizLockQuestions} setQuizDescription={setQuizDescription} setQuizAvailability={setQuizAvailability}
                setNewQuizTitle={setNewQuizTitle} setNewQuizAvailableFrom={setNewQuizAvailableFrom} setNewQuizAvailableUntil={setNewQuizAvailableUntil} setNewQuizDueDate={setNewQuizDueDate} setNewQuizScore={setNewQuizScore}
                setNewQuizPoints={setNewQuizPoints} setNewQuizNumberAttempts={setNewQuizNumberAttempts} setNewQuizType={setNewQuizType} setNewQuizAssignmentGroup={setNewQuizAssignmentGroup} setNewQuizShuffle={setNewQuizShuffle} setNewQuizTimeLimit={setNewQuizTimeLimit} setNewQuizMultipleAttempts={setNewQuizMultipleAttempts}
                setNewQuizNumberQuestions={setNewQuizNumberQuestions} setNewQuizShowCorrectAnswers={setNewQuizShowCorrectAnswers} setNewQuizAccessCode={setNewQuizAccessCode} setNewQuizOneQuestionAtATime={setNewQuizOneQuestionAtATime} setNewQuizWebcamRequired={setNewQuizWebcamRequired} 
                setNewQuizLockQuestions={setNewQuizLockQuestions} setNewQuizDescription={setNewQuizDescription} setNewQuizAvailability={setNewQuizAvailability}
                quizzes={quizzes} newQuizId={newQuizId} handleCancelQuiz={handleCancelQuiz} handleUpdateQuiz={handleUpdateQuiz}/>} />
                <Route path="Questions" element={<QuizEditorQuestions quiz={quiz} setQuizQuestions={setQuizQuestions} setNewQuizQuestions={setNewQuizQuestions} questionsToDelete={questionsToDelete}  setQuestionsToDelete={setQuestionsToDelete} handleSaveQuestions={handleSaveQuestions}
           
              handleCancelQuestions={handleCancelQuestions}

                questionsToAdd={questionsToAdd} setQuestionsToAdd={setQuestionsToAdd} questionsToUpdate={questionsToUpdate} setQuestionsToUpdate={setQuestionsToUpdate}
                stagedQuestions={stagedQuestions} setStagedQuestions={setStagedQuestions}/>} />
            </Routes>
        </div>
    );
}
