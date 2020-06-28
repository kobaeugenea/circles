export const SIGNALS = {
    UPDATE_QUEUE: "update_queue",
    UPDATE_ROUND: "update_round",
};

export const APPLICATION_MODE = {
    NORMAL: "normal",
    ROUND: "round"
};

export const USER_CONTROL_NORMAL = {
    GET_IN: "get_in",
    QUEUE_UP: "queue_up",
    LEAVE_QUEUE: "leave_queue",
    STOP_SPEAKING: "stop_speaking",
    STOP_SPEAKING_SOMEONE_WAITING: "stop_speaking_someone_waiting",
};

export const USER_CONTROL_ROUND = {
    START_ROUND: "start_round",
    IN_QUEUE: "in_queue",
    SPEAKING: "speaking",
    HAVE_SPOKEN: "have_spoken",
};

export const ROUND_TIME = {
    HALF_MINUTE: "30000",
    MINUTE: "60000",
    TWO_MINUTE: "120000",
    FIVE_MINUTE: "300000",
    ENDLESS: "-1",
};