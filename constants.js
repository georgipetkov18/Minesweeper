import Beginner from "./classes/beginner.js";
import Intermediate from "./classes/intermediate.js"
import Advanced from "./classes/advanced.js"

const cellSize = 50;

const beginner = new Beginner(9, 10);
const intermediate = new Intermediate(16, 40);
const advanced = new Advanced(30, 16, 99);
const levels = {
    "beginner": beginner,
    "intermediate": intermediate,
    "advanced": advanced
}
export {cellSize, levels}