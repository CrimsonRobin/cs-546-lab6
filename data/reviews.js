// This data file should export all functions using the ES6 standard as shown in the lecture code
import { ObjectId } from "mongodb";
import * as helper from "../helpers.js";
import * as products from "../data/products.js";

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
  review = helper.checkIfString(review);
  rating = helper.checkIfRatingValid(rating);

  if(ObjectId.isValid(productId) === false) {
    throw new Error(`invalid object ID: ${productId}.`);
  }

  const product = await products.get(productId);

  if (product === null) {
    throw new Error(`No product with ID: ${productId}.`);
  }

  const date = new Date();

  let newReview = {
    title: title,
    reviewDate: date.toLocaleDateString("en-US"),
    reviewerName: reviewerName,
    review: review, 
    rating: rating
  }
  //update review array
  product.reviews.push(newReview);

  //update rating
  let ratingArray = product.reviews.map({rating});

  return newReview;
};

const getAllReviews = async (productId) => {

};

const getReview = async (reviewId) => {

};

const updateReview = async (reviewId, updateObject) => {

};

const removeReview = async (reviewId) => {

};

export {createReview, getAllReviews, getReview, updateReview, removeReview};