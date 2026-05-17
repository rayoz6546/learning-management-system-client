import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { HiLink } from "react-icons/hi";
import { FaRegFileAlt } from "react-icons/fa";
import { useParams } from "react-router";

import React, { useState, useEffect } from "react";
import * as coursesClient from "../client";
import { addModule, editModule, updateModule, deleteModule, setModules, deleteLessonFromModule, updateLessonInModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import ProtectedContent from "../../../Account/ProtectedContent";
import * as modulesClient from "./client";
import ProtectedContentEnrollment from "../../../Account/ProtectedContentEnrollment";

import { useViewContext } from "../Quizzes/View";
import StudentViewButton from "../Quizzes/StudentViewButton";
import AddLessonDialog from "./LessonAddDialog";
import * as filesClient from "../filesClient";
import { addFile, deleteFile, setFiles } from "../filesReducer";
import ProtectedContentAdmin from "../../../Account/ProtectedContentAdmin";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
export default function Modules({ collapsed, setCollapsed, allIconsVisible, setAllIconsVisible,toggleAllIcons, visibleIcons,toggleIcons}: { collapsed: boolean, setCollapsed:any, allIconsVisible:any, setAllIconsVisible:any,visibleIcons:any,  toggleAllIcons: () => void;toggleIcons: (Id:any)=>void
}) {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const { isStudentView, toggleView } = useViewContext();
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const { files } = useSelector((state: any) => state.filesReducer);


    const dispatch = useDispatch();


    const fetchModules = async () => {
      const modules = await coursesClient.findModulesForCourse(cid as string);
      dispatch(setModules(modules));
    };

    const fetchFiles = async () => {
    try {
        const files = await filesClient.fetchFiles();
        dispatch(setFiles(files));
    } catch (error) {
        console.error("Error fetching files:", error);
    }
    }


    const [isEditing, setIsEditing] = useState(false);
    const [editingID, setEditingID] = useState("")

    const [isModuleEditing, setIsModuleEditing] = useState(false);


    const [newLessonName, setNewLessonName] = useState("");
    const saveLessonName = async (lesson:any, lessonId:string, moduleId:string) => {

      if (newLessonName.trim() !== "") {
        try {
          const updatedLesson = { ...lesson, name: newLessonName };
          await modulesClient.updateLesson(moduleId, lessonId, updatedLesson);
          dispatch(
            updateLessonInModule({
              moduleId,
              lessonId,
              updatedLesson,
            })
          );
          setIsEditing(false);
          setEditingID("")
        } catch (error) {
          console.error("Error updating lesson name:", error);
        }
      }
    };



    const [newLessonLink, setNewLessonLink] = useState("");
    const saveLessonLink = async (lesson:any, lessonId:string, moduleId:string) => {

      if (newLessonLink.trim() !== "") {
        try {
          console.log(newLessonLink)
          const updatedLesson = { ...lesson, link: newLessonLink };
          await modulesClient.updateLesson(moduleId, lessonId, updatedLesson);
          dispatch(
            updateLessonInModule({
              moduleId,
              lessonId,
              updatedLesson,
            })
          );
          setIsEditing(false);
          setEditingID("")
        } catch (error) {
          console.error("Error updating lesson name:", error);
        }
      }
    };

    const [errorFile, setErrorFile] = useState<string | null>(null); 
    const [lessonFile, setLessonFile] = useState<File | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          setLessonFile(null)
          setErrorFile("File size must be less than 2MB.")
        }
        else {
          setLessonFile(file)
        }
      }

      
    }


    const updateFile = async (lesson:any, module:any) => {
      const file = files.find((f:any)=> f.itemId === lesson._id)

      const updatedLesson = {...lesson, name: lessonFile && lessonFile.name}
        try {
            if (lessonFile) {
              await filesClient.deleteFile(file._id)
              dispatch(deleteFile(file._id))
              const fileUploadResponse = await filesClient.uploadFile(lessonFile, lesson._id);
              dispatch(addFile(fileUploadResponse));
              const newerLesson = {...updatedLesson, file: fileUploadResponse.fileId}
              await modulesClient.updateLesson(module._id, lesson._id, newerLesson)
              dispatch(updateLessonInModule({
                moduleId: module._id, 
                lessonId: lesson._id, 
                updatedLesson: newerLesson
              }))
            }
          }
      
      
           catch (error) {
            console.error("Failed to add lesson:", error);
          }
    }

    const createModuleForCourse = async () => {
      if (!cid) return;
      const newModule = { name: moduleName, course: cid, published:false };
      const module = await coursesClient.createModuleForCourse(cid, newModule);
      dispatch(addModule(module));
      fetchModules();
    };
  
    const removeModule = async (moduleId: string) => {
      await modulesClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
      fetchModules();

    };

    const saveModule = async (module: any) => {

      await modulesClient.updateModule(module);
      dispatch(updateModule(module));
    };
  
    const handleDelete = async (moduleId: string, lessonId: string, lesson:any) => {
      try {
        await modulesClient.deleteLesson(moduleId, lessonId);

  
        dispatch(deleteLessonFromModule({ moduleId, lessonId }));
        const file = files.find((f:any)=> f.itemId === lesson._id)
        if (lesson.file!=="") { 
          await filesClient.deleteFile(file._id);
          dispatch(deleteFile(file._id))
        }
      } catch (error) {
        console.error("Failed to delete lesson:", error);
      }
    };
    const toggleCollapseAll = () => {
      setCollapsed(!collapsed);
    };

    const [showLessonDialog, setShowLessonDialog] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const openAddLessonDialog = (moduleId: string) => {
      setSelectedModuleId(moduleId);
      setShowLessonDialog(true);
    };
  
    const closeAddLessonDialog = () => {
      setShowLessonDialog(false);
      setSelectedModuleId(null);
    };
  
    const [isLoading, setIsLoading] = useState(true); 


    useEffect(() => {
      // Fetch data and set loading state
      const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([fetchModules(), fetchFiles()]);
        setIsLoading(false);
      };
      fetchData();
    }, []);


    if (isLoading) {
      return <div>Loading...</div>; // Display loading indicator
    }

  
    return (
      <>
        <ProtectedContent><StudentViewButton
            isStudentView={isStudentView}
            onClick={toggleView}
        /></ProtectedContent>
      <div>

        {isStudentView ? (<>


        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={createModuleForCourse}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          allIconsVisible={allIconsVisible}
          setAllIconsVisible={setAllIconsVisible}
          toggleAllIcons={toggleAllIcons}


        />
                    
        <br /><br /><br /><br />


        <ul id="wd-modules" className="list-group rounded-0">

        {modules
          .map((module: any) => (
            <>
  
                <ProtectedContent>

                  
          <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />     
      { module.editing && isModuleEditing ? (
        <>
        <input className="form-control w-50 d-inline-block"
              onChange={(e) => dispatch(updateModule({ ...module, name: e.target.value }))}
               onKeyDown={(e) => {
                 if (e.key === "Enter") {
                  dispatch(updateModule({ ...module, editing: false }));
                  saveModule({ ...module, editing: false });

                 }
               }}
               defaultValue={module.name}/></>
      ): <>{module.name}</>}
              <ProtectedContent>
              <ModuleControlButtons setIsModuleEditing={setIsModuleEditing} moduleId={module._id} 
              deleteModule={(moduleId:any) => removeModule(moduleId)}
                  editModule={(moduleId:any) => dispatch(editModule(moduleId))} openAddLessonDialog={openAddLessonDialog} allIconsVisible={allIconsVisible} visibleIcons={visibleIcons} toggleIcons={toggleIcons}
                  /></ProtectedContent>
            </div>

            
                    {module.lessons && !collapsed && (
                      <>
                        {module.lessons.map((lesson: any) => (
                          <>
                          <ul className="wd-lessons list-group rounded-0" style={{borderLeft: lesson.published ? "3px solid green" : "none",}}> 
                          {(lesson.name!==""  && lesson.file==="") ? <>
                            <li className="wd-lesson list-group-item p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />
                            
                            {isEditing && editingID=== lesson._id ? (
                                <input
                                  type="text"
                                  className="form-control d-inline w-auto"
                                  defaultValue={lesson.name}
                                  onChange={(e) => setNewLessonName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {saveLessonName(lesson, lesson._id, module._id);setIsEditing(false); setEditingID("")}
                                  }}
                                />
                              ) : (
                                <span
                                >
                                  {lesson.name}
                                </span>
                              )}
                      <ProtectedContent><LessonControlButtons setEditingID={setEditingID} setIsEditing={setIsEditing} handleDelete={handleDelete} moduleId={module._id} lessonId={lesson._id} allIconsVisible={allIconsVisible} visibleIcons={visibleIcons} toggleIcons={toggleIcons}/></ProtectedContent>
                  </li></> : null

                  }

                {lesson.link!=="" ? <>
                    <li className="wd-lesson list-group-item p-3 ps-1">
                    <HiLink className="ms-2 fs-4" /> 
                    {isEditing && editingID=== lesson._id ? (
                                <input
                                  type="text"
                                  className="form-control d-inline w-auto"
                                  defaultValue={lesson.link}
                                  onChange={(e) => setNewLessonLink(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {saveLessonLink(lesson, lesson._id, module._id);setIsEditing(false);setEditingID("")}
                                  }}
                                />
                              ) : (
                                <>
                                <button className="btn btn-link fs-5" onClick={() => window.open(lesson.link,"_blank")}>   
                                  {lesson.link}

                                </button>
                                </>
                              )}
                      <ProtectedContent><LessonControlButtons setEditingID={setEditingID} setIsEditing={setIsEditing} handleDelete={handleDelete} moduleId={module._id} lessonId={lesson._id} allIconsVisible={allIconsVisible} visibleIcons={visibleIcons} toggleIcons={toggleIcons}/></ProtectedContent>
                  </li></> : null

                  }


                  {lesson.file !== "" ? (
                    <li className="wd-lesson list-group-item p-3 ps-1">
                      <FaRegFileAlt className="me-2 ms-2 fs-4" />
                      
                      {isEditing && editingID=== lesson._id? (
                        <>
                                <input
                                type="file"
                                onChange={handleFileUpload}
                                className="form-control d-inline w-auto"
      
                                />
  
                                <button className="btn btn-primary" onClick={()=>{updateFile(lesson, module); setIsEditing(false); setErrorFile(null)}}>Update</button><br />
                                {errorFile && <p className="text-danger mt-2" style={{ fontSize: "0.875rem", marginLeft:"40px" }}>{errorFile}</p>}
                                <p className="text-muted mt-3" style={{fontSize:"15px", marginLeft:"40px"}}>Current File: {lesson.name}</p>

                                
                                </>
                              ) :
                            
                      <a
                        href={`${REMOTE_SERVER}/api/files/${files && files.find((f: any) => f.itemId === lesson._id)?._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="btn btn-link fs-5"
                      >
                         {lesson.name}
                      </a>}
                      <ProtectedContent>
                        <LessonControlButtons
                          setEditingID={setEditingID}
                          setIsEditing={setIsEditing}
                          handleDelete={handleDelete}
                          moduleId={module._id}
                          lessonId={lesson._id}
                          allIconsVisible={allIconsVisible} 
                          visibleIcons={visibleIcons} 
                          toggleIcons={toggleIcons}
                        />
                      </ProtectedContent>
                    </li>
                  ) : null}
              </ul>
                  </>
                  
                ))}
                </>
                
                )}

              {selectedModuleId === module._id && (
                <AddLessonDialog
                  dialogTitle={`Add Lesson to ${module.name}`}
                  moduleId={module._id}
                  closeDialog={closeAddLessonDialog}
                />
              )}
                </li></ProtectedContent>


                {module.published && (
                  <>
                  <ProtectedContentEnrollment>
                <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
                  <div className="wd-title p-3 ps-2 bg-secondary">
                    <BsGripVertical className="me-2 fs-3" />       {module.name}

                  </div>
      
                  
                  {module.lessons && !collapsed && (
                    <ul className="wd-lessons list-group rounded-0">
                      {module.lessons.map((lesson: any) => (
                        <>
                        
                        {lesson.published && (
                           <>
                           {(lesson.name!==""  && lesson.file==="") ? <>
                             <li className="wd-lesson list-group-item p-3 ps-1">
                             <BsGripVertical className="me-2 fs-3" /> {lesson.name}  
                           </li></> : null
         
                           }
         
                         {lesson.link!=="" ? <>
                             <li className="wd-lesson list-group-item p-3 ps-1">
                             <HiLink className="ms-2 fs-4" /> <button className="btn btn-link fs-5" onClick={() => window.open(lesson.link,"_blank")}>{lesson.link}</button> 
                           </li></> : null
         
                           }
         
         {lesson.file !== "" ? (
                    <li className="wd-lesson list-group-item p-3 ps-1">
                      <FaRegFileAlt className="me-2 ms-2 fs-4" />
                      <a
                        href={`${REMOTE_SERVER}/api/files/${files && files.find((f: any) => f.itemId === lesson._id)?._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="btn btn-link fs-5"
                      >
                         {lesson.name}
                      </a>

                    </li>
                  ) : null}
                           </>
                        )}</>
                      ))}
                      </ul>
                      )}
                      </li></ProtectedContentEnrollment>



                <ProtectedContentAdmin>
                <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
                  <div className="wd-title p-3 ps-2 bg-secondary">
                    <BsGripVertical className="me-2 fs-3" />       {module.name}
 
                  </div>

                  
                  {module.lessons && !collapsed && (
                    <ul className="wd-lessons list-group rounded-0">
                      {module.lessons.map((lesson: any) => (
                        <>
                        {lesson.published && (
                          <>
                          {(lesson.name!==""  && lesson.file==="") ? <>
                            <li className="wd-lesson list-group-item p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> {lesson.name}  
                          </li></> : null

                          }

                        {lesson.link!=="" ? <>
                            <li className="wd-lesson list-group-item p-3 ps-1">
                            <HiLink className="ms-2 fs-4" /> <button className="btn btn-link fs-5" onClick={() => window.open(lesson.link,"_blank")}>{lesson.link}</button> 
                          </li></> : null

                          }

                {lesson.file !== "" ? (
                    <li className="wd-lesson list-group-item p-3 ps-1">
                      <FaRegFileAlt className="me-2 ms-2 fs-4" />
                      <a
                        href={`${REMOTE_SERVER}/api/files/${files && files.find((f: any) => f.itemId === lesson._id)?._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="btn btn-link fs-5"
                      >
                        {lesson.name}
                      </a>

                    </li>
                  ) : null}
                          </>
                        )}</>
                      ))}
                      </ul>
                      )}
                      </li></ProtectedContentAdmin>
      </>
                )}
                </>))}
    
        </ul></>):(
        <>
      <button
          id="wd-collapse-all"
          className="btn btn-lg btn-secondary me-1 float-end"
          onClick={toggleCollapseAll}
        >
          {collapsed ? "Uncollapse All" : "Collapse All"}
        </button>
                    
        <br /><br /><br /><br />
        <ul id="wd-modules" className="list-group rounded-0">

              {modules
                .map((module: any) => (
                  <>
                  
                      {module.published && (
                          
                              <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
                                <div className="wd-title p-3 ps-2 bg-secondary">
                                  <BsGripVertical className="me-2 fs-3" />       {!module.editing && module.name}

                                </div>
                    
                                
                                {module.lessons && !collapsed && (
                                  <ul className="wd-lessons list-group rounded-0">
                                    {module.lessons.map((lesson: any) => (
                                      <>
                                      {lesson.published && (
                                        <>
                                        {(lesson.name!==""  && lesson.file==="") ? <>
                                          <li className="wd-lesson list-group-item p-3 ps-1">
                                          <BsGripVertical className="me-2 fs-3" /> {lesson.name} 
                                        </li></> : null
                      
                                        }
                      
                                      {lesson.link!=="" ? <>
                                          <li className="wd-lesson list-group-item p-3 ps-1">
                                          <HiLink className="ms-2 fs-4" /> <button className="btn btn-link fs-5" onClick={() => window.open(lesson.link,"_blank")}>{lesson.link}</button> 
                                        </li></> : null
                      
                                        }
                      
                      {lesson.file !== "" ? (
                    <li className="wd-lesson list-group-item p-3 ps-1">
                      <FaRegFileAlt className="me-2 ms-2 fs-4" />
                      <a
                        href={`${REMOTE_SERVER}/api/files/${files && files.find((f: any) => f.itemId === lesson._id)?._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="btn btn-link fs-5"
                      >
                         {lesson.name}
                      </a>

                    </li>
                  ) : null}
                                        </>
                                      )}</>
                                    ))}
                                    </ul>
                                    )}
                                    </li>)}
                      </>))}
            </ul>
        </>)}
        </div>
        
        </>

  );}
  
  