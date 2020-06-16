import React, {Component} from 'react';
import {APPLICATION_MODE} from '../enums/settings.js'
import {ButtonGroup, ToggleButton} from "react-bootstrap";
import './ControlPanel.css';
import NormalModePanel from "./NormalModePanel";
import RoundModePanel from "./RoundModePanel";

const modeButtons = [
    {name: 'Normal Mode', value: APPLICATION_MODE.NORMAL},
    {name: 'Round Mode', value: APPLICATION_MODE.ROUND},
];

export default class ControlPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {view: APPLICATION_MODE.NORMAL};
    }

    render() {
        if(this.props.applicationMode === APPLICATION_MODE.ROUND) {
            this.state.view = APPLICATION_MODE.ROUND;
        }
        return <div className='controlPanel'>
            <input
                className="btn btn-large btn-danger"
                type="button"
                id="buttonLeaveSession"
                onClick={this.props.leaveSession}
                value="Leave session"
            />

            <ButtonGroup toggle>
                {modeButtons.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        type="radio"
                        variant="secondary"
                        name="radio"
                        disabled={this.props.applicationMode === APPLICATION_MODE.ROUND && radio.value === APPLICATION_MODE.NORMAL}
                        value={radio.value}
                        checked={this.state.view === radio.value}
                        onChange={(e) => this.setState({view: e.currentTarget.value})}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>

            {this.state.view === APPLICATION_MODE.NORMAL
                ? <NormalModePanel userStream={this.props.userStream}
                                   mainStream={this.props.mainStream}
                                   speakingQueue={this.props.speakingQueue}/>
                : <RoundModePanel applicationMode={this.props.applicationMode}
                                  allUsers={this.props.allUsers}
                                  speakingQueue={this.props.speakingQueue}
                                  userStream={this.props.userStream}/>}
        </div>;
    }

}
