// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import express from "express";
import * as products from "../data/products.js";
import * as helper from "../helpers.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      const productList = await products.getAll();
      return res.json(productList);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  })
  .post(async (req, res) => {
    try {
      req.body.productName = helper.checkIfString(req.body.productName);
      req.body.productDescription = helper.checkIfString(req.body.productDescription);
      req.body.modelNumber = helper.checkIfString(req.body.modelNumber);
      req.body.price = helper.checkIfPriceValid(req.body.price);
      req.body.manufacturer = helper.checkIfString(req.body.manufacturer);
      req.body.manufacturerWebsite = helper.checkIfString(req.body.manufacturerWebsite);
      req.body.dateReleased = helper.checkIfString(req.body.dateReleased);

      if(req.body.manufacturerWebsite.toLowerCase().startsWith("http://www.") === false || req.body.manufacturerWebsite.toLowerCase().endsWith(".com") === false) {
        throw new Error(`${req.body.manufacturerWebsite} does not start with http://www. or ends in .com`);
      }
      if(req.body.manufacturerWebsite.length < 20) {
        throw new Error(`${req.body.manufacturerWebsite} is not at least 20 characters long.`);
      }

      if(!isHttpUri(req.body.manufacturerWebsite)) {
        throw new Error(`${req.body.manufacturerWebsite} is formatted incorrectly.`);
      }

      helper.checkIfValidArray(req.body.keywords);
      helper.checkIfValidArray(req.body.categories);
      

      if(isValid(new Date(req.body.dateReleased)) === false || isMatch(req.body.dateReleased, "MM/dd/yyyy") === false) {
        throw new Error(`${req.body.dateReleased} is not a valid date.`);
      }

      if(new Date(req.body.dateReleased) > Date.now()) {
        throw new Error(`${req.body.dateReleased} is not a valid date.`);
      }

      if(req.body.dateReleased.length !== 10) {
        throw new Error(`${req.body.dateReleased} is not in mm/dd/yyyy format.`);
      }

      if(typeof req.body.discontinued !== "boolean") {
        throw new Error(`${req.body.discontinued} is not a boolean.`);
      }

      const product = await products.create(req.body.productName, req.body.productDescription, req.body.modelNumber, req.body.price, req.body.manufacturer, req.body.manufacturerWebsite, req.body.keywords, 
        req.body.categories, req.body.dateReleased, req.body.discontinued);

      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  });

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
      return res.status(200).json(product);
    } catch (error) {
      return res.status(404).send(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.productId = helper.checkIfString(req.params.productId);
      if(ObjectId.isValid(req.params.productId) === false) {
        throw new Error(`invalid object ID: ${req.params.productId}.`);
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
    try {
      await products.get(req.params.productId);

      await products.remove(req.params.productId);

      return res.status(200).json({_id: req.params.productId, deleted: true});
    } catch (error) {
      return res.status(404).send(error.message);
    }
  })
  .put(async (req, res) => {
    try {
      req.params.productId = helper.checkIfString(req.params.productId);
      if(ObjectId.isValid(req.params.productId) === false) {
        throw new Error(`invalid object ID: ${req.params.productId}.`);
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
    try {
      await products.get(req.params.productId);
    } catch (error) {
      return res.status(404).send(error.message);
    }
    try {
      req.body.productName = helper.checkIfString(req.body.productName);
      req.body.productDescription = helper.checkIfString(req.body.productDescription);
      req.body.modelNumber = helper.checkIfString(req.body.modelNumber);
      req.body.price = helper.checkIfPriceValid(req.body.price);
      req.body.manufacturer = helper.checkIfString(req.body.manufacturer);
      req.body.manufacturerWebsite = helper.checkIfString(req.body.manufacturerWebsite);
      req.body.dateReleased = helper.checkIfString(req.body.dateReleased);

      if(req.body.manufacturerWebsite.toLowerCase().startsWith("http://www.") === false || req.body.manufacturerWebsite.toLowerCase().endsWith(".com") === false) {
        throw new Error(`${req.body.manufacturerWebsite} does not start with http://www. or ends in .com`);
      }
      if(req.body.manufacturerWebsite.length < 20) {
        throw new Error(`${req.body.manufacturerWebsite} is not at least 20 characters long.`);
      }

      if(!isHttpUri(req.body.manufacturerWebsite)) {
        throw new Error(`${req.body.manufacturerWebsite} is formatted incorrectly.`);
      }

      helper.checkIfValidArray(req.body.keywords);
      helper.checkIfValidArray(req.body.categories);
      

      if(isValid(new Date(req.body.dateReleased)) === false || isMatch(req.body.dateReleased, "MM/dd/yyyy") === false) {
        throw new Error(`${req.body.dateReleased} is not a valid date.`);
      }

      if(new Date(req.body.dateReleased) > Date.now()) {
        throw new Error(`${req.body.dateReleased} is not a valid date.`);
      }

      if(req.body.dateReleased.length !== 10) {
        throw new Error(`${req.body.dateReleased} is not in mm/dd/yyyy format.`);
      }

      if(typeof req.body.discontinued !== "boolean") {
        throw new Error(`${req.body.discontinued} is not a boolean.`);
      }

      const product = await products.update(req.body.productName, req.body.productDescription, req.body.modelNumber, req.body.price, req.body.manufacturer, req.body.manufacturerWebsite, req.body.keywords, 
        req.body.categories, req.body.dateReleased, req.body.discontinued);

      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  });

export default router;