// This data file should export all functions using the ES6 standard as shown in the lecture code
import * as helper from "../helpers.js";

const createReview = async (
  productId,
  title,
  reviewerName,
  review,
  rating
) => {
  productId = helper.checkIfString(productId);
  title = helper.checkIfString(title);
  reviewerName = helper.checkIfString(reviewerName);
  

};

const getAllReviews = async (productId) => {

};

const getReview = async (reviewId) => {

};

const updateReview = async (reviewId, updateObject) => {

};

const removeReview = async (reviewId) => {

};
