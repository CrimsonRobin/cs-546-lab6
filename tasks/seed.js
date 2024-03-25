import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as products from '../data/products.js';
import * as reviews from '../data/reviews.js';

const db = await dbConnection();
await db.dropDatabase();

const gpu = await products.create("RTX 3070", "The graphics card for gamers", "GPU885403", 499.99, "Nvidia", "http://www.nvidia.com", ["Gaming", "Graphics Card", "RTX"], ["Computer Parts", "Electronics"], "09/17/2020", false);
const gid = gpu._id.toString();

const cpu = await products.create("    i7-10700k    ", "Intel CPU", "12345678", 411, "Intel", 
"http://www.intel.com", ["CPU", "Intel", "i7", "10700k", "central processing unit", "pc"], 
["Electronics", "CPU", "Processors", "Intel Core"], "04/10/2020", false);
const cid = cpu._id.toString();

await reviews.createReview(gid, "An Amazing GPU", "Bob Bob", "This is an amazing GPU for the price. I recommend it!", 5);
await reviews.createReview(gid, "A Decent Mid-Range GPU", "AMD Lover #7", "This GPU is an okay GPU for the price, AMD better.", 3.5);
await reviews.createReview(gid, "An abysmall GPU", "The Hater", "This GPU sucks!!! The 5090 is the best!!", 1);
await reviews.createReview(gid, "One of the Best GPU's I've ever seen!", "Nvidia Lover #2", "This GPU blows the water out of the AMD gpus, buy buy buy!", 5);

await reviews.createReview(cid, "A Great CPU", "Bob Bob", "This is an amazing CPU for the price, definitely recommend it!", 4.5);
await reviews.createReview(cid, "A Decent Intel CPU", "AMD Lover #7", "This is a decent cpu for the price, AMD better though.", 2.5);
await reviews.createReview(cid, "An awful CPU!", "The Hater", "This CPU sucks!!! Not an i9 so 1 star.", 1);
await reviews.createReview(cid, "One of the Best CPU's I've ever seen!", "Intel Lover #2", "This CPU blows the water out of the AMD cpus, buy buy buy!", 5);

console.log('Done seeding database');

await closeConnection();
