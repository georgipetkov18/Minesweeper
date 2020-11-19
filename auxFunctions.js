function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;   //return a random number in interval: [min;max)
}

export {getRandomInteger}