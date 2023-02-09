import  express  from "express";
import { getAllCourses ,createCourse,getCourseLecture, addLecture, deleteCourse, deleteLecture} from "../controllers/courseController.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/Auth.js";
import singleUpload from "../middleware/multer.js";

const router= express.Router();

//get all course without lecture
router.route("/course").get(getAllCourses)
//create new Course only admin
router.route("/createCourse").post(isAuthenticated,authorizeAdmin,singleUpload,createCourse)
//get course  add lecture 
router.route("/course/:id").get(isAuthenticated,getCourseLecture)
.post(isAuthenticated,authorizeAdmin,singleUpload,addLecture).delete(isAuthenticated,authorizeAdmin,deleteCourse)
//delete Lecture
router.route("/lecture").delete(isAuthenticated,authorizeAdmin,deleteLecture)
export default  router;