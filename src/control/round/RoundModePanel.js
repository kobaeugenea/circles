import React, {Component} from 'react';
import {APPLICATION_MODE, ROUND_TIME, USER_CONTROL_ROUND} from '../../enums/settings.js'
import './RoundModePanel.css';
import StartButton from "./StartButton";
import App from "../../App";
import RoundModeControl from "./RoundModeControl";

export default class RoundModePanel extends Component {

    constructor(props) {
        super(props);
        this.state = {roundTime: ROUND_TIME.HALF_MINUTE};
    }

    render() {
        return <div className='roundModePanel'>
            <StartButton applicationMode={this.props.applicationMode}
                         userStream={this.props.userStream}
                         allUsers={this.props.allUsers}/>
            <RoundModeControl roundControlMode={this.getUserMode()}
                              msecLeftToSpeak={this.props.msecLeftToSpeak}
                              roundTime={this.props.roundTime}
                              speakingQueue={this.props.speakingQueue}
                              userStream={this.props.userStream}/>
        </div>;
    }

    getUserMode() {
        if (this.props.applicationMode !== APPLICATION_MODE.ROUND) {
            return USER_CONTROL_ROUND.START_ROUND;
        } else if (this.props.speakingQueue[0] === App.getUserName(this.props.userStream)) {
            return USER_CONTROL_ROUND.SPEAKING;
        }
        return this.props.speakingQueue.indexOf(App.getUserName(this.props.userStream)) > -1
            ? USER_CONTROL_ROUND.IN_QUEUE
            : USER_CONTROL_ROUND.HAVE_SPOKEN;
    }

}
