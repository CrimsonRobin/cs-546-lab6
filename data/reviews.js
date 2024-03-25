// This data file should export all functions using the ES6 standard as shown in the lecture code
import { ObjectId } from "mongodb";
import { products } from "../config/mongoCollections.js";
import * as helper from "../helpers.js";
import * as p from "../data/products.js";

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

  const product = await p.get(productId);

  if (product === null) {
    throw new Error(`No product with ID: ${productId}.`);
  }

  const date = new Date();

  const newReview = {
    _id: new ObjectId(),
    title: title,
    reviewDate: date.toLocaleDateString("en-US"),
    reviewerName: reviewerName,
    review: review, 
    rating: rating
  }

  //update review array
  const prodreviewArray = product.reviews;
  prodreviewArray.push(newReview);

  //update rating
  const ratingArray = prodreviewArray.map(({rating}) => rating);
  let avgRating = 0;

  if(ratingArray.length > 0) {
    for(let r of ratingArray) {
      avgRating += r;
    }
    avgRating = avgRating / ratingArray.length;
  }

  const productCollection = await products();
  await productCollection.updateOne(
    {_id: ObjectId.createFromHexString(productId)}, 
    {$set: 
      {
        reviews: prodreviewArray,
        averageRating: avgRating
      }
    }
  );
  
  newReview._id = newReview._id.toString();
  return newReview;
};

const getAllReviews = async (productId) => {
  productId = helper.checkIfString(productId);

  if(ObjectId.isValid(productId) === false) {
    throw new Error(`invalid object ID: ${productId}.`);
  }

  const product = await p.get(productId);

  return product.reviews;

};

const getReview = async (reviewId) => {
  reviewId = helper.checkIfString(reviewId);

  if(ObjectId.isValid(reviewId) === false) {
    throw new Error(`invalid object ID: ${reviewId}.`);
  }

  const productCollection = await products();
  let reviewArray = await productCollection
  .find({})
  .project(
    {
      _id: 0,
      reviews: 1
    })
  .toArray(); // an array of objects of objects

  let reviewObject = undefined;
  for(let prod of reviewArray) {
    for(let rev of prod.reviews) {
      if(rev._id.toString() === reviewId) {
        reviewObject = rev;
      }
    }
  }

  if(reviewObject === undefined) {
    throw new Error(`No review with ID: ${reviewId}`);
  }

  return reviewObject;
};

const updateReview = async (reviewId, updateObject) => {
  reviewId = helper.checkIfString(reviewId);

  if(ObjectId.isValid(reviewId) === false) {
    throw new Error(`invalid object ID: ${reviewId}.`);
  }

  const review = await getReview(reviewId);

  if(Object.hasOwn(updateObject, "reviewId") === false && Object.hasOwn(updateObject, "title") === false && Object.hasOwn(updateObject, "reviewerName") === false && Object.hasOwn(updateObject, "review") === false && Object.hasOwn(updateObject, "rating") === false) {
    throw new Error(`updated Object has none of the necessary fields.`);
  }

  if(Object.hasOwn(updateObject, "reviewId") === true) {
    updateObject.reviewId = helper.checkIfString(updateObject.reviewId);
    review.reviewId = updateObject.reviewId;
  }

  if(Object.hasOwn(updateObject, "title") === true) {
    updateObject.title = helper.checkIfString(updateObject.title);
    review.title = updateObject.title;
  }

  if(Object.hasOwn(updateObject, "reviewerName") === true) {
    updateObject.reviewerName = helper.checkIfString(updateObject.reviewerName);
    review.reviewerName = updateObject.reviewerName;
  }

  if(Object.hasOwn(updateObject, "review") === true) {
    updateObject.review = helper.checkIfString(updateObject.review);
    review.review = updateObject.review;
  }

  if(Object.hasOwn(updateObject, "rating") === true) {
    updateObject.rating = helper.checkIfRatingValid(updateObject.rating);
    review.rating = updateObject.rating;
  }

  const date = new Date();

  review.reviewDate = date.toLocaleDateString("en-US");

  const productCollection = await products();
  const product = await productCollection.find({'reviews._id': ObjectId.createFromHexString(reviewId)}).toArray();
  const reviewList = await getAllReviews(product.at(0)._id.toString());

  const newReviewList = reviewList.map((r) => r._id.toString() === reviewId ? review : r);

  const ratingArray = newReviewList.map(({rating}) => rating);
  let avgRating = 0;

  if(ratingArray.length > 0) {
    for(let r of ratingArray) {
      avgRating += r;
    }
    avgRating = avgRating / ratingArray.length;
  }

  const updatedProduct = await productCollection.findOneAndUpdate(
    {_id: product.at(0)._id}, 
    {$set: 
      {
        reviews: newReviewList,
        averageRating: avgRating
      }
    },
    {returnDocument: "after"}
  );

  if (!updatedProduct) {
    throw new Error("the product could not be updated successfully.");
  }

  updatedProduct._id = updatedProduct._id.toString();
  return updatedProduct;
};

const removeReview = async (reviewId) => {
  reviewId = helper.checkIfString(reviewId);

  if(ObjectId.isValid(reviewId) === false) {
    throw new Error(`invalid object ID: ${reviewId}.`);
  }

  await getReview(reviewId);

  const productCollection = await products();
  const productArray = await productCollection.find({'reviews._id': ObjectId.createFromHexString(reviewId)}).toArray();
  const reviewList = await getAllReviews(productArray.at(0)._id.toString());

  const newReviewList = reviewList.filter(({_id}) => _id.toString() !== reviewId);

  const ratingArray = newReviewList.map(({rating}) => rating);
  let avgRating = 0;

  if(ratingArray.length > 0) {
    for(let r of ratingArray) {
      avgRating += r;
    }
    avgRating = avgRating / ratingArray.length;
  }

  const updatedProduct = await productCollection.findOneAndUpdate(
    {_id: productArray.at(0)._id}, 
    {$set: 
      {
        reviews: newReviewList,
        averageRating: avgRating
      }
    },
    {returnDocument: "after"}
  );

  if (!updatedProduct) {
    throw new Error("the product could not be updated successfully.");
  }

  updatedProduct._id = updatedProduct._id.toString();
  return updatedProduct;
};

export {createReview, getAllReviews, getReview, updateReview, removeReview};