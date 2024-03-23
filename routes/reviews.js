// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import express from "express";
import * as products from "../data/products.js";
import * as reviews from "../data/reviews.js";
import * as helper from "../helpers.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router
  .route('/:productId')
  .get(async (req, res) => {
    try {
      req.params.productId = helper.checkIfString(req.params.productId);
      if(ObjectId.isValid(req.params.productId) === false) {
        throw new Error(`invalid object ID: ${req.params.productId}.`);
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
    try {
      const product = await products.get(req.params.productId);

      if(product.reviews.length === 0) {
        throw new Error(`No reviews found for ${product}`);
      }

      const reviewList = await reviews.getAllReviews(req.params.productId);
      return res.status(200).json(reviewList);
    } catch (error) {
      return res.status(404).send(error.message);
    }
  })
  .post(async (req, res) => {
    try {
      req.params.productId = helper.checkIfString(req.params.productId);
      req.body.title = helper.checkIfString(req.body.title);
      req.body.reviewerName = helper.checkIfString(req.body.reviewerName);
      req.body.review = helper.checkIfString(req.body.review);
      req.body.rating = helper.checkIfRatingValid(req.body.rating);

      if(ObjectId.isValid(req.params.productId) === false) {
        throw new Error(`invalid object ID: ${req.params.productId}.`);
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
    try {
      await products.get(req.params.productId);

      const review = await reviews.createReview(req.params.productId, req.body.title, req.body.reviewerName, req.body.review, req.body.rating);

      const product = await products.get(req.params.productId);
      return res.status(200).json(product);
    } catch (error) {
      return res.status(404).send(error.message);
    }
  });

router
  .route('/review/:reviewId')
  .get(async (req, res) => {
    try {
      req.params.reviewId = helper.checkIfString(req.params.reviewId);

      if(ObjectId.isValid(req.params.reviewId) === false) {
        throw new Error(`invalid object ID: ${req.params.reviewId}.`);
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
    try {
      const review = await reviews.getReview(req.params.reviewId);
      return res.status(200).json(review);
    } catch (error) {
      return res.status(404).send(error.message);
    }
  })
  .patch(async (req, res) => {
    try {
      const product = await reviews.updateReview(req.params.reviewId, req.body);
    } catch (error) {
      
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
  });

  export default router;