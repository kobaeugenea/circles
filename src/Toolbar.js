import React, {Component} from 'react';
import './Toolbar.css';
import IconButton from "@material-ui/core/IconButton";
import {Mic, MicOff, Settings} from "@material-ui/icons";

export default class Toolbar extends Component {

    render() {
        return <div className='toolbar'>
            <IconButton color='inherit' className="navButton" id="navMicButton" onClick={this.props.changeMicrophoneStatus}>
                {this.props.microphoneEnabled
                    ? <Mic style={{color: 'green', fontSize: '3vh'}}/>
                    : <MicOff style={{color: 'red', fontSize: '3vh'}}/>}
            </IconButton>
            <IconButton color='inherit' className="navButton" onClick={this.props.leaveSession} id="navLeaveButton">
                <Settings color="secondary" style={{color: 'white', fontSize: '3vh'}}/>
            </IconButton>
        </div>;
    }

}
