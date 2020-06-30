import axios from 'axios';
import {OpenVidu} from 'openvidu-browser';
import React, {Component} from 'react';
import UserVideo from './circle/UserVideo';
import {SIGNALS, APPLICATION_MODE} from './enums/settings.js'
import ControlPanel from './control/ControlPanel.js'
import MainCircle from './circle/MainCircle.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Devices from "./Devices";
import Toolbar from "./Toolbar";

const OPENVIDU_SERVER_URL = 'https://' + window.location.hostname + ':4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

const TIMER_STEPS = 300;


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mySessionId: App.getSessionName(),
            session: undefined,
            mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [],
            speakingQueue: [],
            applicationMode: APPLICATION_MODE.NORMAL,
            roundTime: undefined,
            msecLeftToSpeak: 0,
            devices: undefined,
            camera: undefined,
            microphone: undefined,
            microphoneEnabled: true,
        };

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.changeMicrophoneStatus = this.changeMicrophoneStatus.bind(this);
        this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
        this.handleChangeCamera = this.handleChangeCamera.bind(this);
        this.handleChangeMicrophone = this.handleChangeMicrophone.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);

        this.askCameraAndMicrophonePermission();
    }

    async askCameraAndMicrophonePermission(){
        await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        this.OV = new OpenVidu();
        this.OV.getDevices().then(devices => {
            this.setState({devices: devices})
        });
    }

    static getSessionName() {
        return App.isNewSession() ? 'SessionA' : window.location.pathname.slice(1);
    }

    static isNewSession() {
        return window.location.pathname === '/';
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onbeforeunload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    onbeforeunload(event) {
        this.leaveSession();
    }

    handleChangeSessionId(e) {
        this.setState({
            mySessionId: e.target.value,
        });
    }


    handleChangeCamera(e) {
        localStorage.setItem('camera', e.target.value);
        this.setState({
            camera: e.target.value,
        });
    }

    handleChangeMicrophone(e) {
        localStorage.setItem('microphone', e.target.value);
        this.setState({
            microphone: e.target.value,
        });
    }

    changeMicrophoneStatus() {
        this.state.publisher.publishAudio(!this.state.publisher?.stream?.audioActive);
        this.setState({microphoneEnabled: this.state.publisher?.stream?.audioActive});
    }

    deleteSubscriber(streamManager) {
        let subscribers = this.state.subscribers;
        let index = subscribers.indexOf(streamManager, 0);
        if (index > -1) {
            subscribers.splice(index, 1);
            this.setState({
                subscribers: subscribers,
            });
        }
    }

    joinSession() {
        this.userId = Date.now();
        window.history.pushState("", "", '/' + this.state.mySessionId);

        // --- 2) Init a session ---

        this.setState(
            {
                session: this.OV.initSession(),
            },
            () => {
                var mySession = this.state.session;

                // --- 3) Specify the actions when events take place in the session ---

                // On every new Stream received...
                mySession.on('streamCreated', (event) => {
                    //send speaking queue if we are host
                    if (this.isHost()) {
                        this.state.publisher.stream.session.signal({
                            type: this.state.applicationMode === APPLICATION_MODE.NORMAL ? SIGNALS.UPDATE_QUEUE : SIGNALS.UPDATE_ROUND,
                            data: JSON.stringify({queue: this.state.speakingQueue, roundTime: this.state.roundTime}),
                        });
                    }

                    // Subscribe to the Stream to receive it. Second parameter is undefined
                    // so OpenVidu doesn't create an HTML video by its own
                    var subscriber = mySession.subscribe(event.stream, undefined);
                    var subscribers = this.state.subscribers;
                    subscribers.push(subscriber);

                    // Update the state with the new subscribers
                    this.setState({
                        subscribers: subscribers,
                    });
                });

                // On every Stream destroyed...
                mySession.on('streamDestroyed', (event) => {
                    // Remove the stream from 'subscribers' array
                    this.deleteSubscriber(event.stream.streamManager);

                    const userNames = this.getAllUsers().map(subscriber => JSON.parse(subscriber.stream.connection.data).clientData);
                    let speakingQueue = [];
                    this.state.speakingQueue.forEach(item => {
                        let index = userNames.indexOf(item);
                        if (index > -1) {
                            speakingQueue.push(item);
                        }
                    });
                    this.setState({
                        speakingQueue: speakingQueue,
                    });
                });

                // Process all signals from OpenVidu
                mySession.on('signal', (event) => {
                    const data = JSON.parse(event.data); 
                    let mainStreamManager; // the stream of the person in the center
                    let applicationMode; // whether we are in round or normal mode
                    let msecLeftToSpeak = 0; // how long current speaker has left

                    let speaksNow;
                    if (data.queue.length !== 0) {
                        speaksNow = data.queue[0]; // ID of currently speaking person who is always first in queue

                        // look up the stream of the current speaker by their Id
                        mainStreamManager = this.getAllUsers().filter(el => App.getUserId(el) === speaksNow)[0];
                    }

                    // if we are the center then unmute ourselves
                    if (this.userId === speaksNow) {
                        this.state.publisher.publishAudio(true);
                    } else {
                        this.state.publisher.publishAudio(this.state.microphoneEnabled);
                    }

                    if (event.type === 'signal:' + SIGNALS.UPDATE_QUEUE || data.queue.length === 0) {
                        // If round is finished then switch back to normal mode
                        applicationMode = APPLICATION_MODE.NORMAL;
                    } else {
                        applicationMode = APPLICATION_MODE.ROUND;
                        //this user isn't speaker
                        if (data.queue[0] !== App.getUserId(this.state.publisher)) {
                            clearInterval(this.timerId);
                            msecLeftToSpeak = 0;
                            //this user just starts to speak
                        } else if (data.roundTime > -1 && this.state.speakingQueue.toString() !== data.queue.toString()) {
                            msecLeftToSpeak = data.roundTime;
                            const step = msecLeftToSpeak / TIMER_STEPS;
                            clearInterval(this.timerId);
                            this.timerId = setInterval(() => {
                                let secLeftToSpeak = this.state.msecLeftToSpeak - step;
                                this.setState({
                                    msecLeftToSpeak: secLeftToSpeak,
                                });
                                if (secLeftToSpeak < 1) {
                                    const speakingQueue = this.state.speakingQueue;
                                    speakingQueue.shift();
                                    clearInterval(this.timerId);
                                    this.state.publisher.stream.session.signal({
                                        type: SIGNALS.UPDATE_ROUND,
                                        data: JSON.stringify({queue: speakingQueue, roundTime: data.roundTime}),
                                    });
                                }
                            }, step);
                            //this user continue speak
                        } else {
                            msecLeftToSpeak = this.state.msecLeftToSpeak;
                        }
                    }

                    this.setState({
                        speakingQueue: data.queue,
                        mainStreamManager: mainStreamManager,
                        applicationMode: applicationMode,
                        roundTime: data.roundTime,
                        msecLeftToSpeak: msecLeftToSpeak,
                    });
                });

                // --- 4) Connect to the session with a valid user token ---

                // 'getToken' method is simulating what your server-side should do.
                // 'token' parameter should be retrieved and returned by your own backend
                this.getToken().then((token) => {
                    // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
                    // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
                    mySession
                        .connect(token, {clientData: this.userId},)
                        .then(() => {

                            // --- 5) Get your own camera stream ---

                            // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
                            // element: we will manage it on our own) and with the desired properties
                            let publisher = this.OV.initPublisher(undefined, {
                                audioSource: this.state.microphone, // The source of audio. If undefined default microphone
                                videoSource: this.state.camera, // The source of video. If undefined default webcam
                                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                                resolution: '640x480', // The resolution of your video
                                frameRate: 30, // The frame rate of your video
                                insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                                mirror: false, // Whether to mirror your local video or not
                            });

                            // --- 6) Publish your stream ---

                            mySession.publish(publisher);

                            // Set the main video in the page to display our webcam and store our Publisher
                            this.setState({
                                publisher: publisher,
                            });
                        })
                        .catch((error) => {
                            console.log('There was an error connecting to the session:', error.code, error.message);
                        });
                });
            },
        );
    }

    isHost() {
        const publisher = this.state.publisher;
        return publisher !== undefined
            && App.getUserId(publisher) === this.getAllUsers().map(subscriber => App.getUserId(subscriber)).sort()[0];
    }

    static getUserId(streamManager) {
        return JSON.parse(streamManager.stream.connection.data).clientData;
    }

    getAllUsers() {
        return [this.state.publisher].concat(this.state.subscribers).sort((a, b) => {
            return App.getUserId(a) - App.getUserId(b);
        });
    }

    leaveSession() {

        // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

        const mySession = this.state.session;

        if (mySession) {
            mySession.disconnect();
        }

        this.OV = new OpenVidu();
        this.OV.getDevices().then(devices => {
            this.setState({devices: devices})
        });
        this.setState({
            session: undefined,
            subscribers: [],
            mySessionId: App.getSessionName(),
            mainStreamManager: undefined,
            publisher: undefined
        });
    }

    renderStartSession() {
         return <div className="container">
                    <div id="join">
                        <div id="join-dialog" className="jumbotron vertical-center">
                            <h1> Start circle </h1>
                            <form className="form-group" onSubmit={this.joinSession}>
                                <p>
                                    <label> Name: </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="sessionId"
                                        value={this.state.mySessionId}
                                        onChange={this.handleChangeSessionId}
                                        required
                                    />
                                </p>
                                <Devices devices={this.state.devices}
                                         changeCamera={(e) => this.handleChangeCamera(e)}
                                         changeMicrophone={(e) => this.handleChangeMicrophone(e)}/>
                                <p className="text-center">
                                    <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN"/>
                                </p>
                            </form>
                        </div>
                    </div> 
                </div>;
    }

    renderJoinSession() {
         return <div className="container">
                    <div id="join">
                        <div id="join-dialog" className="jumbotron vertical-center">
                            <h1> Join circle {this.state.mySessionId}</h1>
                            <form className="form-group" onSubmit={this.joinSession}>                           
                                <Devices devices={this.state.devices}
                                         changeCamera={(e) => this.handleChangeCamera(e)}
                                         changeMicrophone={(e) => this.handleChangeMicrophone(e)}/>
                                <p className="text-center">
                                    <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN"/>
                                </p>
                            </form>
                        </div>
                    </div> 
                </div>;
          
    }

    renderApp(){
        return <div className="container">
                    <div id="session">
                        <ControlPanel userStream={this.state.publisher}
                                      mainStream={this.state.mainStreamManager}
                                      speakingQueue={this.state.speakingQueue}
                                      applicationMode={this.state.applicationMode}
                                      allUsers={this.getAllUsers()}
                                      roundTime={this.state.roundTime}
                                      msecLeftToSpeak={this.state.msecLeftToSpeak}
                                      resetRoundTimerFunction={() => this.resetRoundTimer()}/>
                        <MainCircle streamManager={this.state.mainStreamManager}/>
                        <div id="session-header">
                            <h1 id="session-title">{this.state.mySessionId}</h1>
                        </div>

                        <div id="video-container" className="videoContainer">
                            {this.getAllUsers().map((sub, i) => (
                                <UserVideo key={App.getUserId(sub)}
                                           nextInQueue={this.state.speakingQueue.length > 1 && this.state.speakingQueue[1] === App.getUserId(sub)}
                                           streamManager={this.state.mainStreamManager !== sub ? sub : undefined}
                                           tPosition={this.calculatePosition(i)}/>
                            ))}
                        </div>
                    </div>
                <Toolbar leaveSession={this.leaveSession}
                         changeMicrophoneStatus={this.changeMicrophoneStatus}
                         microphoneEnabled={this.state.microphoneEnabled}
                         microphoneIconEnabled={this.state.mainStreamManager !== this.state.publisher}/>
            </div>;
    }

    render() {
        if(this.state.session === undefined) {
            if(App.isNewSession()) {
                return this.renderStartSession();
            } else {
                return this.renderJoinSession();
            }
        } 
        if(this.state.publisher !== undefined && this.state.publisher.stream !== undefined ){
                return this.renderApp();
        } 

        return <div className="loading">LOADING...</div>;
    }

    calculatePosition(streamNum) {
        return (Math.PI * 2) - (Math.PI * 2 / (this.state.subscribers.length + 1) * streamNum) + (Math.PI / 4);
    }

    /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * These methods retrieve the mandatory user token from OpenVidu Server.
     * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
     * the API REST, openvidu-java-client or openvidu-node-client):
     *   1) Initialize a session in OpenVidu Server    (POST /api/sessions)
     *   2) Generate a token in OpenVidu Server        (POST /api/tokens)
     *   3) The token must be consumed in Session.connect() method
     */

    getToken() {
        const circlesSessionsPrefix = "c_r_les1972-"; // so that other clients doesn't randomly connect to our sessions.
        return this.createSession(circlesSessionsPrefix+this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
    }

    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({customSessionId: sessionId});
            axios
                .post(OPENVIDU_SERVER_URL + '/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error.response.status === 409) {
                        resolve(sessionId);
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' +
                            OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                OPENVIDU_SERVER_URL +
                                '"',
                            )
                        ) {
                            window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
                });
        });
    }

    createToken(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({session: sessionId});
            axios
                .post(OPENVIDU_SERVER_URL + '/api/tokens', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });
    }
}

export default App;
