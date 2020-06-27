import React, {Component} from 'react';
import './Toolbar.css';
import IconButton from "@material-ui/core/IconButton";
import {Mic, MicOff, PowerSettingsNew} from "@material-ui/icons";

export default class Toolbar extends Component {

    constructor(props) {
        super(props);
        this.state = {mic: true};
    }

    render() {
        return <div className='toolbar'>
            <IconButton color='inherit' className="navButton" id="navMicButton" onClick={() => {
                this.setState({mic: !this.state.mic});
                this.props.userStream.publishAudio(this.state.mic);
            }}>
                {this.state.mic
                    ? <Mic color="primary" style={{color: 'red', fontSize: '3vh'}}/>
                    : <MicOff color="secondary" style={{color: 'white', fontSize: '3vh'}}/>}
            </IconButton>
            <IconButton color='inherit' className="navButton" onClick={this.props.leaveSession} id="navLeaveButton">
                <PowerSettingsNew color="secondary" style={{color: 'red', fontSize: '3vh'}}/>
            </IconButton>
        </div>;
    }

}
