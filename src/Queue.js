import React, {Component} from 'react';
import {ListGroup} from "react-bootstrap";
import './Queue.css';
import Circle from "./circle/Circle";

export default class Queue extends Component {

    render() {
        const streamPosition = {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            height: '40%',
        };

        const streamSize = {
            width: '100%',
            height: '100%',
        };

        return <div>
            <Circle streamPosition={streamPosition} streamSize={streamSize} streamManager={this.props.streamManager}/>
            <ListGroup className='queueList'>
                <ListGroup.Item>Speaking queue:</ListGroup.Item>
                {this.props.queue.map((item, idx) => (
                    <ListGroup.Item key={idx} variant={idx === 0 ? 'primary' : 'secondary'}>{item}</ListGroup.Item>
                ))}
            </ListGroup>
        </div>;
    }

}
