import React, {Component} from 'react';
import {Form} from "react-bootstrap";

/*
    Selector for devices
 */
export default class Devices extends Component {

    render() {
        return <div>
            {this.props.devices !== undefined
                ? (<div>
                    <p>
                        <Form.Label>Select camera:</Form.Label>
                        <Form.Control onChange={e => this.props.changeCamera(e)} as="select" size="lg">
                            {this.props.devices.filter(device => device.kind === 'videoinput').map((device, idx) => (
                                <option key={idx}
                                        selected={localStorage.getItem('camera') === device.deviceId}
                                        value={device.deviceId}>{device.label}</option>
                            ))}
                        </Form.Control>
                    </p>
                    <p>
                        <Form.Label>Select microphone:</Form.Label>
                        <Form.Control onChange={e => this.props.changeMicrophone(e)} as="select" size="lg">
                            {this.props.devices.filter(device => device.kind === 'audioinput').map((device, idx) => (
                                <option key={idx}
                                        selected={localStorage.getItem('microphone') === device.deviceId}
                                        value={device.deviceId}>{device.label}</option>
                            ))}
                        </Form.Control>
                    </p>
                </div>)
                : null}
        </div>;
    }

}
