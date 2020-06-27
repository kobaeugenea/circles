import React, {Component} from 'react';
import './Queue.css';
import Circle from "./circle/Circle";

export default class MainCircle extends Component {

    constructor(props) {
        super(props);
        this.state = {height: window.innerHeight};
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({height: window.innerHeight}));
    }

    render() {
        const h = this.state.height * 0.4;
        const w = h * 4 / 3;

        const streamPosition = {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
        };

        const streamSize = {
            width: w,
            height: h,
        };

        return <Circle streamPosition={streamPosition} streamSize={streamSize} streamManager={this.props.streamManager}/>;
    }

}
