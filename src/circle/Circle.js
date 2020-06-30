import React, {Component} from 'react';
import OpenViduVideoComponent from './OvVideo';
import {MicOff} from "@material-ui/icons";
import App from "../App";

export default class Circle extends Component {

    render() {
        return (<div>
            {
                this.props.streamManager !== undefined
                    ? (<div style={this.props.streamPosition} className='streamContainer'>
                            {!this.props.microphoneEnabled && <MicOff style={{color: 'red', fontSize: '3vh'}}/>}
                            <div className={'streamcomponent' + (this.props.nextInQueue ? ' nextInQueue' : '')}
                                 style={this.props.streamSize}>
                                <OpenViduVideoComponent key={App.getUserId(this.props.streamManager)}
                                                        streamManager={this.props.streamManager}/>
                            </div>
                        </div>
                    ) : <img style={{...this.props.streamSize, ...this.props.streamPosition}}
                             className='streamContainer streamcomponent'
                             src='resources/images/empty_center.png' alt='Empty center'/>
            }
        </div>);
    }
}
