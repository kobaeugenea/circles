import React, {Component} from 'react';
import {USER_CONTROL_ROUND} from '../../enums/settings.js'
import './RoundModeControl.css';
import Timer from "./Timer";
import App from "../../App";
import {SIGNALS} from "../../enums/settings";

/**
 * Center button of round mode
 */
export default class RoundModeControl extends Component {

    constructor(props, context) {
        super(props, context);

        this.stopSpeaking = this.stopSpeaking.bind(this);
        this.keyDownListener = event => {
            if (event.keyCode === 32 && this.props.roundControlMode === USER_CONTROL_ROUND.SPEAKING) {
                this.stopSpeaking();
            }
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyDownListener, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDownListener, false);
    }

    render() {
        switch (this.props.roundControlMode) {
            case USER_CONTROL_ROUND.IN_QUEUE:
                return <div className='roundModeControl-inQueue'>
                    {this.props.speakingQueue.indexOf(App.getUserId(this.props.userStream), 0)}
                </div>;
            case USER_CONTROL_ROUND.HAVE_SPOKEN:
                return <div className='roundModeControl-haveSpoken'/>;
            case USER_CONTROL_ROUND.SPEAKING:
                return <Timer className='roundModeControl-speaking'
                              value={this.props.msecLeftToSpeak}
                              maxValue={this.props.roundTime}
                              onClick={this.stopSpeaking}/>;
            default:
                return <div/>;
        }
    }

    stopSpeaking() {
        let speakingQueue = this.props.speakingQueue;
        let index = speakingQueue.indexOf(App.getUserId(this.props.userStream), 0);
        if (index > -1) {
            speakingQueue.splice(index, 1);
        }
        this.props.userStream.stream.session.signal({
            type: SIGNALS.UPDATE_ROUND,
            data: JSON.stringify({queue: speakingQueue, roundTime: this.props.roundTime}),
        });
    }
}
