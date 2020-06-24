import React, {Component} from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default class UserVideoComponent extends Component {

    getNicknameTag() {
        // Gets the nickName of the user
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
    }

    constructor(props) {
        super(props);
        this.state = {width: window.innerWidth, height: window.innerHeight};
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({width: window.innerWidth, height: window.innerHeight}));
    }

    render() {
        const w = this.state.width;
        const h = this.state.height;
        const a = w * 0.35;
        const b = h * 0.35;

        const streamPosition = this.props.tPosition !== undefined
            ? {
                left: a * Math.cos(this.props.tPosition) + w * 0.5 - h * 0.1,
                bottom: b * Math.sin(this.props.tPosition) + h * 0.4,
            }
            : {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'auto',
                height: '40%',
            };

        const streamSize = this.props.tPosition !== undefined
            ? {
                width: h * 0.2,
                height: h * 0.2,
            }
            : {
                width: '100%',
                height: '100%',
            };

        return (
            <div style={streamPosition} className='streamContainer'>
                <p>{this.getNicknameTag()}</p>
                {this.props.streamManager !== undefined ? (
                    <div className={'streamcomponent' + (this.props.tPosition === undefined ? ' main' : '')} style={streamSize}>
                        <OpenViduVideoComponent streamManager={this.props.streamManager}/>
                    </div>
                ) : null}
            </div>
        );
    }
}
