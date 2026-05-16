import { useLocation, useParams } from "react-router";
import { LuGlasses } from "react-icons/lu";

export default function StudentViewButton({ isStudentView, onClick }: { isStudentView: boolean; onClick: () => void }) {
    const { pathname } = useLocation();
    const isQuizzes = pathname.includes("Quizzes")
    return (
        <>
            {isQuizzes ?
                (<div className="col d-none d-md-block"><button id="wd-student-view-button" className="btn btn-lg btn-secondary fs-6 rounded-1 me-2" style={{ position: "absolute", right: "10px", top: "12px" }} onClick={onClick}>
                    <LuGlasses className="me-2 fs-5" />{isStudentView ? "Student View" : "Faculty View"}</button></div>) : null}
        </>

    );
}
