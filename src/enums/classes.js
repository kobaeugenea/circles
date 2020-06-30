import {USER_CONTROL_NORMAL} from "./settings";

/*
    Contains matching between normal mode states and classes that should be used for central button
 */
export const QUEUE_CONTROL_CLASSES = new Map([
    [USER_CONTROL_NORMAL.GET_IN, "normalGetIn"],
    [USER_CONTROL_NORMAL.QUEUE_UP, "normalQueueUp"],
    [USER_CONTROL_NORMAL.LEAVE_QUEUE, "normalLeaveQueue"],
    [USER_CONTROL_NORMAL.STOP_SPEAKING, "normalStopSpeaking"],
    [USER_CONTROL_NORMAL.STOP_SPEAKING_SOMEONE_WAITING, "normalStopSpeakingSomeoneWaiting"],
]);