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

export const USER_MODE_ROUND = {
    BEFORE_ROUND: "before_round",
    NORMAL: "round",
    SPEAKING: "speaking_round",
};

export const ROUND_TIME = {
    HALF_MINUTE: "0.5",
    MINUTE: "1",
    TWO_MINUTE: "2",
    FIVE_MINUTE: "5",
    ENDLESS: "-1",
};