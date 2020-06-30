import React, {Component} from 'react';
import './UserVideo.css';
import Circle from "./Circle";

/*
    Draws the outer circles, positioned & sized correctly based on current screen size
 */
export default class UserVideoComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {width: window.innerWidth, height: window.innerHeight, microphoneEnabled: true};
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({width: window.innerWidth, height: window.innerHeight}));

        // TODO: Why is this muting in this case?
        this.props.streamManager.on('streamPropertyChanged', event => {
            if(event.changedProperty === 'audioActive'){
                this.setState({microphoneEnabled: event.newValue});
            }
        });
    }

    render() {
        const w = this.state.width;
        const h = this.state.height;

        //TODO: what is 0.35??
        const a = w * 0.35; // TODO: what is a?
        const b = h * 0.35; // TODO: what is b?

        // TODO: Explain formulat intention
        const streamPosition = {
            left: a * Math.cos(this.props.tPosition) + w * 0.5 - h * 0.1, // TODO: what are these magic numbers?
            bottom: b * Math.sin(this.props.tPosition) + h * 0.4, // TODO: what are these magic numbers?
        };


        // TODO: Explain formulat intention
        const streamSize = {
            width: h * 0.2,
            height: h * 0.2,
        };

        return (
            <Circle streamPosition={streamPosition}
                    streamSize={streamSize}
                    streamManager={this.props.streamManager}
                    nextInQueue={this.props.nextInQueue}
                    microphoneEnabled={this.state.microphoneEnabled}/>
        );
    }
}
