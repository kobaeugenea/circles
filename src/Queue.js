import React, {Component} from 'react';
import {ListGroup} from "react-bootstrap";
import './Queue.css';
import OpenViduVideoComponent from "./OvVideo";

export default class Queue extends Component {

    render() {
        return <div>
            {
                this.props.streamManager !== undefined
                    ? (<div className='mainVideoContainer videoContainer'>
                            <p>{JSON.parse(this.props.streamManager.stream.connection.data).clientData}</p>
                            <div className='mainVideo'>
                                <OpenViduVideoComponent streamManager={this.props.streamManager}/>
                            </div>
                        </div>
                    )
                    : (
                        <img className='emptyCenter' src='resources/images/empty_center.png' alt='Empty center'/>
                    )
            }
            <ListGroup className='queueList'>
                <ListGroup.Item>Speaking queue:</ListGroup.Item>
                {this.props.queue.map((item, idx) => (
                    <ListGroup.Item variant={idx === 0 ? 'primary' : 'secondary'}>{item}</ListGroup.Item>
                ))}
            </ListGroup>
        </div>;
    }

}
