import mongoose from "mongoose";
import validator from "validator";

const Schema = new mongoose.Schema({
    "title": {
      type: String,
      minlength: [2, "title should be greater than two letter"],
      maxlength: [30, "title should be less than 30 character"],
      trim: true,
      required: [true, "Please enter your name"],
    },
    "description": {
      type: String,
      minlength: [2, "Description should be greater than two letter"],
      trim: true,
      required: [true, "Please enter your Description "],
    },
    "lecture": [
      {
        "title": {
          type: String,
          required:true,
        },
        "description": {
          type: String,
          required:true,
        },
        "video": [
          {
            public_id: {
              type: String,
              required: true,
            },
            url: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    "poster": [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    "views": {
      type: Number,
      default:0,
    },
    "noOfVideos": {
      type: Number,
      default:0,
    },
    "category": {
        type: String,
        required:true,
      },
      "createdBy": {
        type: String,
        required:[true,"Enter course creator name"],
      },
    "createdAt": {
      type: Date,
      default: Date.now,
    },
  });

export const Course= new mongoose.model("Course", Schema);