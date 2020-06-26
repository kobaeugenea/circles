import React, {Component} from 'react';
import {APPLICATION_MODE} from '../enums/settings.js'
import './ControlPanel.css';
import NormalModePanel from "./NormalModePanel";
import RoundModePanel from "./RoundModePanel";

export default class ControlPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {view: APPLICATION_MODE.NORMAL};
    }

    render() {
        if (this.props.applicationMode === APPLICATION_MODE.ROUND) {
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

            {this.props.applicationMode === APPLICATION_MODE.NORMAL &&
            <div className={this.state.view === APPLICATION_MODE.NORMAL ? 'changeToRound' : 'changeToNormal'}
                 onClick={() => {
                     this.state.view === APPLICATION_MODE.NORMAL
                         ? this.setState({view: APPLICATION_MODE.ROUND})
                         : this.setState({view: APPLICATION_MODE.NORMAL});
                 }}/>
            }

            {this.state.view === APPLICATION_MODE.NORMAL
                ? <NormalModePanel userStream={this.props.userStream}
                                   mainStream={this.props.mainStream}
                                   speakingQueue={this.props.speakingQueue}/>
                : <RoundModePanel applicationMode={this.props.applicationMode}
                                  allUsers={this.props.allUsers}
                                  speakingQueue={this.props.speakingQueue}
                                  userStream={this.props.userStream}
                                  roundTime={this.props.roundTime}/>}

            <footer className="footer"/>
        </div>;
    }

}
