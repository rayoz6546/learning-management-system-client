import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { CiNoWaitingSign } from "react-icons/ci";
import ModuleEditor from "./ModuleEditor";
import ProtectedContent from "../../../Account/ProtectedContent";
import { useDispatch, useSelector } from "react-redux";
import { updateModule, updateLessonInModule } from "./reducer";
import * as modulesClient from "../Modules/client"
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function ModulesControls({ moduleName, setModuleName, addModule, collapsed, setCollapsed, allIconsVisible,setAllIconsVisible, toggleAllIcons }:
  { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; collapsed:any, setCollapsed:any,allIconsVisible:any,setAllIconsVisible:any,toggleAllIcons:()=>void }) {
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  // Publish all modules only
  const publishModulesOnly = async () => {
    modules.forEach(async (module: any) => {
      await modulesClient.updateModule({...module,published: true});
        
      dispatch(updateModule({ ...module, published: true }));
    });
  };

  // Publish all modules and items
  const publishModulesAndItems = async () => {
    modules.forEach(async (module: any) => {
      await modulesClient.updateModule({...module,published: true});
      dispatch(updateModule({ ...module, published: true }));
      module.lessons.forEach(async (lesson: any) => {
      await modulesClient.updateLesson(module._id, lesson._id, {...lesson,published: true,});
      dispatch(updateLessonInModule({ moduleId: module._id, lessonId: lesson._id, updatedLesson: { published: true } }));
      });
    });
  };

  // Unpublish all modules only
  const unpublishModulesOnly = async () => {
    modules.forEach(async (module: any) => {
      await modulesClient.updateModule({...module,published: false});
      dispatch(updateModule({ ...module, published: false }));
    });
  };

  // Unpublish all modules and items
  const unpublishModulesAndItems = async () => {
    modules.forEach(async (module: any) => {
      await modulesClient.updateModule({...module,published: false});
      dispatch(updateModule({ ...module, published: false }));
      module.lessons.forEach(async (lesson: any) => {
        await modulesClient.updateLesson(module._id, lesson._id, {...lesson,published: false});
        dispatch(updateLessonInModule({ moduleId: module._id, lessonId: lesson._id, updatedLesson: { published: false } }));
      });
    });
  };

  const toggleCollapseAll = () => {
    setCollapsed(!collapsed);
  };



  return (
    <div id="wd-modules-controls" className="text-nowrap">

      <ProtectedContent>
      <button id="wd-view-progress" className="btn btn-lg btn-secondary me-1 float-end"  onClick={toggleAllIcons}>
          <FiMoreVertical />
        </button>
        <button id="wd-add-module-btn" className="btn btn-lg btn-primary me-1 float-end"
          data-bs-toggle="modal" data-bs-target="#wd-add-module-dialog">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Module
        </button>

        <div className="dropdown d-inline me-1 float-end">
          <button id="wd-publish-all-btn" className="btn btn-lg btn-secondary dropdown-toggle"
            type="button" data-bs-toggle="dropdown">
            <GreenCheckmark />
            Publish All
          </button>
          <ul className="dropdown-menu">
            <li>
              <button id="wd-publish-all-modules-and-items-btn" className="dropdown-item" 
                onClick={publishModulesAndItems}>
                <GreenCheckmark />
                Publish all modules and items
              </button>
            </li>
            <li>
              <button id="wd-publish-modules-only-button" className="dropdown-item" 
                onClick={publishModulesOnly}>
                <GreenCheckmark />
                Publish modules only
              </button>
            </li>

            <li>
              <button id="wd-unpublish-all-modules-and-items" className="dropdown-item" 
                onClick={unpublishModulesAndItems}>
                <CiNoWaitingSign className="fs-5 me-1" />
                Unpublish all modules and items
              </button>
            </li>

            <li>
              <button id="wd-unpublish-modules-only" className="dropdown-item" 
                onClick={unpublishModulesOnly}>
                <CiNoWaitingSign className="fs-5 me-1" />
                Unpublish modules only
              </button>
            </li>
          </ul>
        </div>


        <ModuleEditor dialogTitle="Add Module" moduleName={moduleName}
          setModuleName={setModuleName} addModule={addModule} />
      </ProtectedContent>
      <button
          id="wd-collapse-all"
          className="btn btn-lg btn-secondary me-1 float-end"
          onClick={toggleCollapseAll}
        >
          {collapsed ? "Uncollapse All" : "Collapse All"}
        </button>
    </div>
  );
}
