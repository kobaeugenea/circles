import {USER_MODE} from './settings.js'

export const QUEUE_CONTROL_STRINGS = new Map([
    [USER_MODE.NORMAL, "Queue up"],
    [USER_MODE.IN_QUEUE, "Quit queue"],
    [USER_MODE.SPEAKING, "Done speaking"],
]);