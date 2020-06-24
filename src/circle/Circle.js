import React, {Component} from 'react';
import OpenViduVideoComponent from './OvVideo';

export default class Circle extends Component {

    getNicknameTag() {
        if (this.props.streamManager.stream === undefined) {
            return null;
        }
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
        return (<div>
            {
                this.props.streamManager !== undefined
                    ? (<div style={this.props.streamPosition} className='streamContainer'>
                            <p>{this.getNicknameTag()}</p>
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
