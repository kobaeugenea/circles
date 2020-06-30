import React, {Component} from 'react';
import {SIGNALS, USER_CONTROL_NORMAL} from '../enums/settings.js'
import './NormalModePanel.css';
import App from "../App";
import {QUEUE_CONTROL_CLASSES} from "../enums/classes";

/*
    Panel that contains all elements for controlling normal mode
 */
export default class NormalModePanel extends Component {

    constructor(props, context) {
        super(props, context);

        this.queueControlHandler = this.queueControlHandler.bind(this);
        this.keyDownListener = event => {
            if(event.keyCode === 32){
                this.queueControlHandler();
            }
        };
    }

    componentDidMount(){
        document.addEventListener("keydown", this.keyDownListener, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyDownListener, false);
    }

    render() {
        return <div className={'normalModePanel ' + QUEUE_CONTROL_CLASSES.get(this.getUserMode())}
                    onClick={this.queueControlHandler}/>;
    }

    queueControlHandler() {
        let speakingQueue = this.props.speakingQueue;
        const userMode = this.getUserMode();
        switch (userMode) {
            case USER_CONTROL_NORMAL.GET_IN:
            case USER_CONTROL_NORMAL.QUEUE_UP:
                speakingQueue.push(App.getUserId(this.props.userStream));
                break;
            case USER_CONTROL_NORMAL.LEAVE_QUEUE:
            case USER_CONTROL_NORMAL.STOP_SPEAKING:
            case USER_CONTROL_NORMAL.STOP_SPEAKING_SOMEONE_WAITING:
                let index = speakingQueue.indexOf(App.getUserId(this.props.userStream), 0);
                if (index > -1) {
                    speakingQueue.splice(index, 1);
                }
                break;
            default:
                break;
        }
        this.props.userStream.stream.session.signal({
            type: SIGNALS.UPDATE_QUEUE,
            data: JSON.stringify({queue: speakingQueue}),
        });
    }

    getUserMode() {
        if (this.props.userStream === this.props.mainStream) {
            return this.props.speakingQueue.length > 1
                ? USER_CONTROL_NORMAL.STOP_SPEAKING_SOMEONE_WAITING
                : USER_CONTROL_NORMAL.STOP_SPEAKING;
        }

        if (this.props.speakingQueue.indexOf(App.getUserId(this.props.userStream)) > -1) {
            return USER_CONTROL_NORMAL.LEAVE_QUEUE;
        } else {
            return this.props.speakingQueue.length > 0 ? USER_CONTROL_NORMAL.QUEUE_UP : USER_CONTROL_NORMAL.GET_IN;
        }
    }

}
