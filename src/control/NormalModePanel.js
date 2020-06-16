import React, {Component} from 'react';
import {SIGNALS, USER_MODE_NORMAL} from '../enums/settings.js'
import {QUEUE_CONTROL_STRINGS} from '../enums/strings.js'
import {Button} from "react-bootstrap";
import './NormalModePanel.css';
import App from "../App";

export default class NormalModePanel extends Component {

    constructor(props, context) {
        super(props, context);

        this.queueControlHandler = this.queueControlHandler.bind(this);
    }

    render() {
        return <div className='normalModePanel'>
            <Button variant="success"
                    onClick={this.queueControlHandler}>{QUEUE_CONTROL_STRINGS.get(this.getUserMode())}</Button>
        </div>;
    }

    queueControlHandler() {
        let speakingQueue = this.props.speakingQueue;
        const userMode = this.getUserMode();
        switch (userMode) {
            case USER_MODE_NORMAL.NORMAL:
                speakingQueue.push(App.getUserName(this.props.userStream));
                break;
            case USER_MODE_NORMAL.IN_QUEUE:
            case USER_MODE_NORMAL.SPEAKING:
                let index = speakingQueue.indexOf(App.getUserName(this.props.userStream), 0);
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
            return USER_MODE_NORMAL.SPEAKING;
        }
        return this.props.speakingQueue.indexOf(App.getUserName(this.props.userStream)) > -1
            ? USER_MODE_NORMAL.IN_QUEUE
            : USER_MODE_NORMAL.NORMAL;
    }

}
