// This data file should export all functions using the ES6 standard as shown in the lecture code
import { products } from "../config/mongoCollections.js";
import * as helper from "../helpers.js";
import {isValid, isMatch} from "date-fns";
import {ObjectId} from "mongodb";
import {isHttpUri} from "valid-url";

const create = async (
  productName,
  productDescription,
  modelNumber,
  price,
  manufacturer,
  manufacturerWebsite,
  keywords,
  categories,
  dateReleased,
  discontinued
) => {
  productName = helper.checkIfString(productName);
  productDescription = helper.checkIfString(productDescription);
  modelNumber = helper.checkIfString(modelNumber);
  price = helper.checkIfPriceValid(price);
  manufacturer = helper.checkIfString(manufacturer);
  manufacturerWebsite = helper.checkIfString(manufacturerWebsite);
  dateReleased = helper.checkIfString(dateReleased);

  if(manufacturerWebsite.toLowerCase().startsWith("http://www.") === false || manufacturerWebsite.toLowerCase().endsWith(".com") === false) {
    throw new Error(`${manufacturerWebsite} does not start with http://www. or ends in .com`);
  }
  if(manufacturerWebsite.length < 20) {
    throw new Error(`${manufacturerWebsite} is not at least 20 characters long.`);
  }

  if(!isHttpUri(manufacturerWebsite)) {
    throw new Error(`${manufacturerWebsite} is formatted incorrectly.`);
  }

  helper.checkIfValidArray(keywords);
  helper.checkIfValidArray(categories);
  

  if(isValid(new Date(dateReleased)) === false || isMatch(dateReleased, "MM/dd/yyyy") === false) {
    throw new Error(`${dateReleased} is not a valid date.`);
  }

  if(new Date(dateReleased) > Date.now()) {
    throw new Error(`${dateReleased} is not a valid date.`);
  }

  if(dateReleased.length !== 10) {
    throw new Error(`${dateReleased} is not in mm/dd/yyyy format.`);
  }


  if(typeof discontinued !== "boolean") {
    throw new Error(`${discontinued} is not a boolean.`);
  }

  let newProduct = {
    productName: productName,
    productDescription: productDescription,
    modelNumber: modelNumber,
    price: price,
    manufacturer: manufacturer,
    manufacturerWebsite: manufacturerWebsite,
    keywords: keywords,
    categories: categories,
    dateReleased: dateReleased,
    discontinued: discontinued,
    reviews: [],
    averageRating: 0
  };

  const productCollection = await products();
  const insertInfo = await productCollection.insertOne(newProduct);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error("could not add product.");
    }

    const newId = insertInfo.insertedId.toString();

    const product = await get(newId);
    return product;
};

const getAll = async () => {
  //For getAll:  You will have to modify this function so it just returns the _id and name of the products as shown below
  //in the GET /products route example. (Hint: use a projection!) 
  const productCollection = await products();
    let productList = await productCollection.find({})
    .project({
      productDescription: 0,
      modelNumber: 0,
      price: 0,
      manufacturer: 0,
      manufacturerWebsite: 0,
      keywords: 0,
      categories: 0,
      dateReleased: 0,
      discontinued: 0,
      reviews: 0,
      averageRating: 0
    })
    .toArray();

    if (!productList){
      throw new Error("could not get all the products.");
    }

    productList = productList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return productList;
};

const get = async (productId) => {
  productId = helper.checkIfString(productId);
  if(ObjectId.isValid(productId) === false) {
    throw new Error(`invalid object ID: ${productId}.`);
  }

  const productCollection = await products();
  const product = await productCollection.findOne({_id: ObjectId.createFromHexString(productId)});

  if (product === null) {
    throw new Error(`No product with ID: ${productId}.`);
  }

  product._id = product._id.toString();
  return product;
};

const remove = async (productId) => {
  productId = helper.checkIfString(productId);

  if(ObjectId.isValid(productId) === false) {
    throw new Error(`invalid object ID: ${productId}.`);
  }

  const productCollection = await products();
  const deletionInfo = await productCollection.findOneAndDelete({_id: ObjectId.createFromHexString(productId)});

  if (!deletionInfo) {
    throw new Error(`Could not delete product with id of ${productId}`);
  }

  return `${deletionInfo.productName} has been successfully deleted!`;
};

const update = async (
  productId,
  productName,
  productDescription,
  modelNumber,
  price,
  manufacturer,
  manufacturerWebsite,
  keywords,
  categories,
  dateReleased,
  discontinued
) => {
  productId = helper.checkIfString(productId);
  productName = helper.checkIfString(productName);
  productDescription = helper.checkIfString(productDescription);
  modelNumber = helper.checkIfString(modelNumber);
  price = helper.checkIfPriceValid(price);
  manufacturer = helper.checkIfString(manufacturer);
  manufacturerWebsite = helper.checkIfString(manufacturerWebsite);
  dateReleased = helper.checkIfString(dateReleased);

  if(manufacturerWebsite.toLowerCase().startsWith("http://www.") === false || manufacturerWebsite.toLowerCase().endsWith(".com") === false) {
    throw new Error(`${manufacturerWebsite} does not start with http://www. or ends in .com`);
  }
  if(manufacturerWebsite.length < 20) {
    throw new Error(`${manufacturerWebsite} is not at least 20 characters long.`);
  }

  if(!isHttpUri(manufacturerWebsite)) {
    throw new Error(`${manufacturerWebsite} is formatted incorrectly.`);
  }

  helper.checkIfValidArray(keywords);
  helper.checkIfValidArray(categories);
  

  if(isValid(new Date(dateReleased)) === false || isMatch(dateReleased, "MM/dd/yyyy") === false) {
    throw new Error(`${dateReleased} is not a valid date.`);
  }

  if(new Date(dateReleased) > Date.now()) {
    throw new Error(`${dateReleased} is not a valid date.`);
  }

  if(dateReleased.length !== 10) {
    throw new Error(`${dateReleased} is not in mm/dd/yyyy format.`);
  }


  if(typeof discontinued !== "boolean") {
    throw new Error(`${discontinued} is not a boolean.`);
  }

  const productCollection = await products();
  const updateInfo = await productCollection.findOneAndUpdate(
    {_id: ObjectId.createFromHexString(productId)}, 
    {$set: 
      {
        productName: productName,
        productDescription: productDescription,
        modelNumber: modelNumber,
        price: price,
        manufacturer: manufacturer,
        manufacturerWebsite: manufacturerWebsite,
        keywords: keywords,
        categories: categories,
        dateReleased: dateReleased,
        discontinued: discontinued
      }
    },
    {returnDocument: "after"}
  );

  if (!updateInfo) {
    throw new Error("the product could not be updated successfully.");
  }

  updateInfo._id = updateInfo._id.toString();
  return updateInfo;
};

export {create, getAll, get, remove, update};