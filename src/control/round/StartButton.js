import React, {Component} from 'react';
import {APPLICATION_MODE, ROUND_TIME, SIGNALS} from '../../enums/settings.js'
import {ButtonGroup, ToggleButton} from "react-bootstrap";
import './StartButton.css';
import App from "../../App";

const roundTimeButtons = [
    {name: '0.5m', value: ROUND_TIME.HALF_MINUTE},
    {name: '1m', value: ROUND_TIME.MINUTE},
    {name: '2m', value: ROUND_TIME.TWO_MINUTE},
    {name: '5m', value: ROUND_TIME.FIVE_MINUTE},
    {name: '∞', value: ROUND_TIME.ENDLESS},
];

const VIEW = {
    READY_TO_ABOUT: "ready_to_abort",
    REGULAR: "regular",
};

export const MODE_TO_BUTTON_CLASS = new Map([
    [APPLICATION_MODE.NORMAL, "normalMode"],
    [APPLICATION_MODE.ROUND, "roundMode"],
]);

export const MODE_TO_BUTTON_ICON = new Map([
    [APPLICATION_MODE.NORMAL, "⮞"],
    [APPLICATION_MODE.ROUND, "■"],
]);

export default class StartButton extends Component {

    constructor(props) {
        super(props);
        this.state = {roundTime: ROUND_TIME.HALF_MINUTE, view: VIEW.REGULAR};

        this.queueControlHandler = this.queueControlHandler.bind(this);
    }

    render() {
        return <div className='roundModePanel'>
            <div className={'roundModePanel-startButton-button ' + MODE_TO_BUTTON_CLASS.get(this.props.applicationMode)}
                 onClick={this.queueControlHandler}>
                {MODE_TO_BUTTON_ICON.get(this.props.applicationMode)}
            </div>

            {this.props.applicationMode === APPLICATION_MODE.NORMAL &&
            <div
                className={'roundModePanel-startButton-additionalPanel ' + MODE_TO_BUTTON_CLASS.get(this.props.applicationMode)}>
                <img alt='Round icon' src='/resources/images/round.svg'/>
                <ButtonGroup toggle>
                    {roundTimeButtons.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            type="radio"
                            variant="secondary"
                            name="radio"
                            disabled={this.props.applicationMode === APPLICATION_MODE.ROUND && this.state.roundTime !== radio.value}
                            value={radio.value}
                            checked={this.state.roundTime === radio.value}
                            onChange={(e) => this.setState({roundTime: e.currentTarget.value})}
                        >
                            {radio.name}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </div>
            }

            {this.state.view === VIEW.READY_TO_ABOUT && this.props.applicationMode === APPLICATION_MODE.ROUND &&
            <div
                className={'roundModePanel-startButton-additionalPanel ' + MODE_TO_BUTTON_CLASS.get(this.props.applicationMode)}>
                <img alt='Round icon' src='/resources/images/round.svg'/>
                <span className='abort'>Abort?</span>
                <span className='yes' onClick={() => this.props.userStream.stream.session.signal({
                    type: SIGNALS.UPDATE_ROUND,
                    data: JSON.stringify({queue: [], roundTime: this.state.roundTime}),
                })
                }>Yes</span>
                <span className='no' onClick={() => this.setState({view: VIEW.REGULAR})}>No</span>
            </div>
            }

        </div>;
    }

    queueControlHandler() {
        const applicationMode = this.props.applicationMode;
        let speakingQueue;
        switch (applicationMode) {
            case APPLICATION_MODE.NORMAL:
                speakingQueue = this.props.allUsers.map(userStream => App.getUserName(userStream));
                this.props.userStream.stream.session.signal({
                    type: SIGNALS.UPDATE_ROUND,
                    data: JSON.stringify({queue: speakingQueue, roundTime: this.state.roundTime}),
                });
                break;
            case APPLICATION_MODE.ROUND:
                this.setState({view: VIEW.READY_TO_ABOUT});
                break;
            default:
                break;
        }
    }

}
