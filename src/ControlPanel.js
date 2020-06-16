import React, { Component } from 'react';
import {SIGNALS, APPLICATION_MODE, USER_MODE} from './enums/settings.js'
import {QUEUE_CONTROL_STRINGS} from './enums/strings.js'
import {Button, ButtonGroup, ToggleButton} from "react-bootstrap";
import './ControlPanel.css';

export default class ControlPanel extends Component {


    constructor(props) {
        super(props);
        this.state = {applicationMode : APPLICATION_MODE.NORMAL, userMode: USER_MODE.NORMAL};

        this.queueControlHandler = this.queueControlHandler.bind(this);
    }

    render() {
        const queueControlButtonText
            = this.props.userStream === this.props.mainStream
            ? QUEUE_CONTROL_STRINGS.get(USER_MODE.SPEAKING)
            : QUEUE_CONTROL_STRINGS.get(this.state.userMode);
        return <div className='controlPanel'>
            <input
                className="btn btn-large btn-danger"
                type="button"
                id="buttonLeaveSession"
                onClick={this.props.leaveSession}
                value="Leave session"
            />

            <ButtonGroup toggle>
                <ToggleButton
                    key="0"
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={APPLICATION_MODE.NORMAL}
                    checked={this.state.mode === APPLICATION_MODE.NORMAL}
                    onChange={(e) => this.setState({mode : e.currentTarget.value})}
                >
                    Normal Mode
                </ToggleButton>
                <ToggleButton
                    key="1"
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={APPLICATION_MODE.ROUND}
                    checked={this.state.mode === APPLICATION_MODE.ROUND}
                    onChange={(e) => this.setState({mode : e.currentTarget.value})}
                >
                    Round Mode
                </ToggleButton>
            </ButtonGroup>

            <Button variant="success" onClick={this.queueControlHandler}>{queueControlButtonText}</Button>
        </div>;
    }

    queueControlHandler(){
        let speakingQueue = this.props.speakingQueue;
        switch (this.state.userMode) {
            case USER_MODE.NORMAL:
                speakingQueue.push(JSON.parse(this.props.userStream.stream.session.connection.data).clientData);
                this.setState({userMode: USER_MODE.IN_QUEUE});
                break;
            case USER_MODE.IN_QUEUE:
                let index = speakingQueue.indexOf(JSON.parse(this.props.userStream.stream.session.connection.data).clientData, 0);
                if (index > -1) {
                    speakingQueue.splice(index, 1);
                }
                this.setState({userMode: USER_MODE.NORMAL});
                break;
            default: break;
        }
        this.props.userStream.stream.session.signal({
            type: SIGNALS.UPDATE_QUEUE,
            data: JSON.stringify(speakingQueue),
        });
    };

}
