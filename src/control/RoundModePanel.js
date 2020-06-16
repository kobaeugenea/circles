import React, {Component} from 'react';
import {SIGNALS, APPLICATION_MODE, USER_MODE_ROUND, ROUND_TIME} from '../enums/settings.js'
import {QUEUE_CONTROL_STRINGS} from '../enums/strings.js'
import {Button, ButtonGroup, ToggleButton} from "react-bootstrap";
import './RoundModePanel.css';
import App from "../App";

const roundTimeButtons = [
    {name: '0.5m', value: ROUND_TIME.HALF_MINUTE},
    {name: '1m', value: ROUND_TIME.MINUTE},
    {name: '2m', value: ROUND_TIME.TWO_MINUTE},
    {name: '5m', value: ROUND_TIME.FIVE_MINUTE},
    {name: '∞', value: ROUND_TIME.ENDLESS},
];

export default class RoundModePanel extends Component {

    constructor(props) {
        super(props);
        this.state = {roundTime: ROUND_TIME.HALF_MINUTE};

        this.queueControlHandler = this.queueControlHandler.bind(this);
    }

    render() {
        if (this.props.applicationMode === APPLICATION_MODE.ROUND) {
            this.state.roundTime = this.props.roundTime;
        }
        return <div className='roundModePanel'>
            <Button variant="success"
                    onClick={this.queueControlHandler}>{QUEUE_CONTROL_STRINGS.get(this.getUserMode())}</Button>


            <ButtonGroup toggle>
                {roundTimeButtons.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        type="radio"
                        variant="secondary"
                        name="radio"
                        disabled={this.props.applicationMode === APPLICATION_MODE.ROUND && this.state.roundTime !== radio.value}
                        value={radio.value}
                        checked={this.state.roundTime === radio.value}
                        onChange={(e) => this.setState({roundTime: e.currentTarget.value})}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>

        </div>;
    }

    queueControlHandler() {
        const userMode = this.getUserMode();
        let speakingQueue;
        switch (userMode) {
            case USER_MODE_ROUND.BEFORE_ROUND:
                speakingQueue = this.props.allUsers.map(userStream => App.getUserName(userStream));
                break;
            case USER_MODE_ROUND.NORMAL:
                speakingQueue = [];
                break;
            case USER_MODE_ROUND.SPEAKING:
                speakingQueue = this.props.speakingQueue;
                let index = speakingQueue.indexOf(App.getUserName(this.props.userStream), 0);
                if (index > -1) {
                    speakingQueue.splice(index, 1);
                }
                break;
            default:
                break;
        }
        this.props.userStream.stream.session.signal({
            type: SIGNALS.UPDATE_ROUND,
            data: JSON.stringify({queue: speakingQueue, roundTime: this.state.roundTime}),
        });
    }

    getUserMode() {
        if (this.props.applicationMode === APPLICATION_MODE.ROUND) {
            return this.props.speakingQueue[0] === App.getUserName(this.props.userStream)
                ? USER_MODE_ROUND.SPEAKING
                : USER_MODE_ROUND.NORMAL;
        }
        return USER_MODE_ROUND.BEFORE_ROUND;
    }

}
