export default class Timer{
    constructor(element){
        this.element = element;
    }

    setTimer(){
        let secondsPassed = 0;
        this.timeOut = setInterval(() => {
            secondsPassed++;
            this.element.textContent = secondsPassed;
        } ,1000)
    }

    stopTimer(){
        clearInterval(this.timeOut);
    }
}