import React, {Component} from 'react';
import OpenViduVideoComponent from './OvVideo';

export default class Circle extends Component {

    constructor(props) {
        super(props);
        this.state = {width: window.innerWidth, height: window.innerHeight};
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({width: window.innerWidth, height: window.innerHeight}));
    }

    render() {
        return (<div>
            {
                this.props.streamManager !== undefined
                    ? (<div style={this.props.streamPosition} className='streamContainer'>
                            <div className='streamcomponent' style={this.props.streamSize}>
                                <OpenViduVideoComponent streamManager={this.props.streamManager}/>
                            </div>
                        </div>
                    ) : <img style={{...this.props.streamSize, ...this.props.streamPosition}}  className='streamContainer streamcomponent'
                             src='resources/images/empty_center.png' alt='Empty center'/>
            }
        </div>);
    }
}
