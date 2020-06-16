import React, {Component} from 'react';
import './Timer.css';

export default class Queue extends Component {

    render() {
        return <div className='timer'>
            {this.props.secLeftToSpeak}
        </div>;
    }

}
