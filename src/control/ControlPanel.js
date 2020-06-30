import React, {Component} from 'react';
import {APPLICATION_MODE} from '../enums/settings.js'
import './ControlPanel.css';
import NormalModePanel from "./NormalModePanel";
import RoundModePanel from "./round/RoundModePanel";

/*
    Switcher between controls for round mode and normal mode
 */
export default class ControlPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {view: APPLICATION_MODE.NORMAL};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.applicationMode !== this.props.applicationMode) {
            this.setState({view: this.props.applicationMode});
        }
    }

    render() {
        return <div className='controlPanel'>
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
                                  roundTime={this.props.roundTime}
                                  msecLeftToSpeak={this.props.msecLeftToSpeak}/>}

            <footer className="footer"/>
        </div>;
    }

}
