import ProtectedContent from "../../../Account/ProtectedContent";
import Modules from "../Modules";
import StudentViewButton from "../Quizzes/StudentViewButton";
import { useViewContext } from "../Quizzes/View";
import CourseStatus from "./Status";
export default function Home({ collapsed, setCollapsed,allIconsVisible, setAllIconsVisible,toggleAllIcons, visibleIcons, toggleIcons }: { collapsed: boolean, setCollapsed:any,allIconsVisible:any, setAllIconsVisible:any, visibleIcons:any,   toggleAllIcons: () => void; toggleIcons: (Id:any)=>void
 }) {
  const { isStudentView, toggleView } = useViewContext();
  return (
    <>
      <ProtectedContent><StudentViewButton
          isStudentView={isStudentView}
          onClick={toggleView}
      /></ProtectedContent>
    <div className="d-flex" id="wd-home">
      <div className="flex-fill">
          <Modules collapsed={collapsed} setCollapsed={setCollapsed} allIconsVisible={allIconsVisible} setAllIconsVisible={setAllIconsVisible} toggleAllIcons={toggleAllIcons} visibleIcons={visibleIcons} toggleIcons={toggleIcons} />
        </div>

        
      <div className="d-none d-lg-block m-3" >
          <CourseStatus isStudentView={isStudentView}/>
        </div>
      </div>
    </>
  );
}
