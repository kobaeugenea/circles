import {USER_MODE_NORMAL, USER_MODE_ROUND} from "./settings";

export const QUEUE_CONTROL_STRINGS = new Map([
    [USER_MODE_NORMAL.NORMAL, "Queue up"],
    [USER_MODE_NORMAL.IN_QUEUE, "Quit queue"],
    [USER_MODE_NORMAL.SPEAKING, "Done speaking"],
    [USER_MODE_ROUND.NORMAL, "Stop round"],
    [USER_MODE_ROUND.BEFORE_ROUND, "Start round"],
    [USER_MODE_ROUND.SPEAKING, "Done speaking"],
]);