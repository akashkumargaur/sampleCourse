import { catchAsynError } from "../middleware/catchAsyncError.js";
import { Course } from "../models/Course.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js"
import cloudinary from "cloudinary"

export const getAllCourses = catchAsynError( async (req, res, next) => {
    const course = await Course.find().select("-lecture");
    res.status(200).json({
      success: true,
      course,
    });
});
//create course
export const createCourse = catchAsynError( async (req, res, next) => {
  const {title,description,category,createdBy} = req.body;

  if(!title || !description || !category || !createdBy ){
    return next(new ErrorHandler("please add all field",400))
  }

  const file=req.file;

  const fileUrl=getDataUri(file)

  const mycloud= await cloudinary.v2.uploader.upload(fileUrl.content)

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    poster:{
      public_id:mycloud.public_id,
      url:mycloud.secure_url,
    }
  });

  res.status(200).json({
    success: true,
    course,
  });
});
// get perticular lecture
export const getCourseLecture = catchAsynError( async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if(!course ){
    return next(new ErrorHandler("course not Found",404))
  }

  course.views+=1;

  await course.save();

  res.status(200).json({
    success: true,
    lecture:course.lecture,
  });
});

//add lecture max free size 100mb
export const addLecture = catchAsynError( async (req, res, next) => {
  const {title,description} = req.body;
  const id=req.params.id;

  if(! title || !description){
    return next(new ErrorHandler("Enter title or description",404))
  }

  const course = await Course.findById(id)

  if(!course){
    return next(new ErrorHandler("course not Found",404))
  }

  //upload file here

  const file=req.file;

  const fileUrl=getDataUri(file)

  const mycloud= await cloudinary.v2.uploader.upload(fileUrl.content,{resource_type:"video",})

  course.lecture.push({
    title,
    description,
    video:{
      public_id:mycloud.public_id,
      url:mycloud.secure_url,
    }
  })

  course.noOfVideos=course.lecture.length;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture added successfully",
  });
});

//delete course
export const deleteCourse = catchAsynError( async (req, res, next) => {
  const id=req.params.id;

  const course = await Course.findById(id)

  if(!course){
    return next(new ErrorHandler("course not Found",404))
  }

  //delete file here
  await cloudinary.v2.uploader.destroy(course.poster[0].public_id)

  for (let index = 0; index < course.lecture.length; index++) {
    const single = course.lecture[index];
    await cloudinary.v2.uploader.destroy(single.video[0].public_id,{resource_type:"video",})
  }

  await course.remove();

  res.status(200).json({
    success: true,
    message: "Course removed successfully",
  });
});

//delete Lecture
export const deleteLecture = catchAsynError( async (req, res, next) => {
  const {courseId,lectureId}=req.query;

  const course = await Course.findById(courseId)

  if(!course){
    return next(new ErrorHandler("course not Found",404))
  }

  const lecture=course.lecture.find((item)=>{
    if(item._id.toString()===lectureId.toString()) return item;
  })
  //delete file here
  await cloudinary.v2.uploader.destroy(lecture.video[0].public_id,{resource_type:"video",})
  //remove deleted course
  course.lecture=course.lecture.find((item)=>{
    if(item._id.toString()!==lectureId.toString()) return item;
  })

  course.noOfVideos=course.lecture.length;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture removed successfully",
  });
});