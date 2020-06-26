import {USER_CONTROL_NORMAL, USER_MODE_ROUND} from "./settings";

export const QUEUE_CONTROL_CLASSES = new Map([
    [USER_CONTROL_NORMAL.GET_IN, "normalGetIn"],
    [USER_CONTROL_NORMAL.QUEUE_UP, "normalQueueUp"],
    [USER_CONTROL_NORMAL.LEAVE_QUEUE, "normalLeaveQueue"],
    [USER_CONTROL_NORMAL.STOP_SPEAKING, "normalStopSpeaking"],
    [USER_CONTROL_NORMAL.STOP_SPEAKING_SOMEONE_WAITING, "normalStopSpeakingSomeoneWaiting"],
    [USER_MODE_ROUND.NORMAL, "Stop round"],
    [USER_MODE_ROUND.BEFORE_ROUND, "Start round"],
    [USER_MODE_ROUND.SPEAKING, "Done speaking"],
]);