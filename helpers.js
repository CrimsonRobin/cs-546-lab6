// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is

function checkIfString(str) {
    if(!str) {
        throw new Error(`${str} is not a string.`);
    }
    if(typeof str !== "string") {
        throw new Error(`${str} is not a string.`);
    }
    str = str.trim();
    if(str.length === 0) {
        throw new Error(`${str} is empty.`);
    }

    return str;
}

function checkIfPriceValid(price) {
    if(typeof price !== "number") {
        throw new Error(`${price} is not a number.`);
    }
    if(Number.isFinite(price) === false) {
        throw new Error(`${price} is not a valid number.`);
    }
    if(price <= 0) {
        throw new Error(`${price} is not greater than 0.`);
    }

    if(Number.isInteger(price) === false) {
        const arrayCheck = price.toString().split(".");
        if(arrayCheck.at(1).length > 2) {
            throw new Error(`${price} has more than two decimal points.`);
        }
    }
    
    return price;
}

function checkIfRatingValid(rating) {
    if(typeof rating !== "number") {
        throw new Error(`${rating} is not provided.`);
    }

    if(Number.isFinite(rating) === false) {
        throw new Error(`${rating} is not a valid number.`);
    }

    if(rating < 1 || rating > 5) {
        throw new Error(`${rating} is not in the range of 1 to 5.`);
    }

    if(Number.isInteger(rating) === false) {
        const arrayCheck = rating.toString().split(".");
        if(arrayCheck.at(1).length > 1) {
            throw new Error(`${rating} has more than one decimal place.`);
        }
    }

    return rating;
}

function checkIfValidArray(arr) {
    if(Array.isArray(arr) === false) {
        throw new Error(`${arr} is not an array.`);
    }
    if(arr.length < 1) {
        throw new Error(`${arr} does not have at least one element.`);
    }
    for(let x of arr) {
        checkIfString(x);
    }
}

export {checkIfString, checkIfPriceValid, checkIfValidArray, checkIfRatingValid}