import { BsPlus } from "react-icons/bs";
import AddLessonDialog from "./LessonAddDialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
import * as coursesClient from "../client";
import { setModules, updateModule, editModule } from "./reducer";
import { useParams } from "react-router";
import { CiNoWaitingSign } from "react-icons/ci";
import * as modulesClient from "./client";

export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  setIsModuleEditing,
  editModule,
  openAddLessonDialog,
  allIconsVisible,
  visibleIcons,
  toggleIcons,
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
  openAddLessonDialog: (moduleId: string) => void; 
  allIconsVisible: any;
  setIsModuleEditing:any;
  visibleIcons:any,
  toggleIcons: (Id:any)=>void
}) {

  const { modules } = useSelector((state: any) => state.modulesReducer);
  const module = modules.find((m:any)=> m._id === moduleId)
  const isVisible = allIconsVisible || visibleIcons[moduleId];
  const dispatch = useDispatch()
  const togglePublishStatus = async () => {
    const updatedModule = {...module, published:!module.published} ;
    try {
      await modulesClient.updateModule(updatedModule);
      dispatch(updateModule(updatedModule)); 
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };
  return (
    <div className="float-end">
      {isVisible && (
        <>
          <FaPencil
            onClick={() => {editModule(moduleId); setIsModuleEditing((prev:any)=>!prev)}}
            className="text-primary me-3"
            style={{ cursor: "pointer" }}
          />
          <FaTrash
            onClick={() => deleteModule(moduleId)}
            className="text-danger me-2"
            style={{ cursor: "pointer" }}
          />
          <BsPlus
            className="fs-2 text-success"
            onClick={() => openAddLessonDialog(moduleId)} // Open dialog with correct moduleId
            style={{ cursor: "pointer" }}
          />
                    <span
            onClick={togglePublishStatus}
            className="ms-2"
            style={{ cursor: "pointer" }}
          >
            {module.published ? (
              <FaCheckCircle className="text-success fs-4" />
            ) : (
              <CiNoWaitingSign className="text-danger fs-4" />
            )}
          </span>
        </>
      )}
      <button
        id="wd-module-menu-btn"
        className="btn fs-5"
        onClick={()=>toggleIcons(moduleId)}
      >
        <IoEllipsisVertical style={{ cursor: "pointer" }} />
      </button>
    </div>
  );
}

