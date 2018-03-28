import React from "react";
import styled, { css } from "styled-components";
import GameMatch from "./game-match";
import SearchIMG from "../img/search.gif";
import MeetingIMG from "../img/match.png";
import TitleIMG from "../img/title.png";
import "../css/styles.css";

import OnlinePeers from "../img/Online-Peers.png";

export default class GameLobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "CHILLING",
            opponent: "none",
            opponentName: "none",
            peers: {},
            win: 0,
            lose: 0, 
            tie: 0, 
            key: 0,
            random: false,
            noResponse: 0
        };
        this.topicLobby = "vertex.rps.lobby.dev"; 
        this.ipfs = this.props.session.ipfs;
        this.session = this.props.session;
        this.opponentsPreName = {};
        this.opponentsName = {};

        this.handleRead = function(peerId, hash) {
                this.opponentsName[peerId] = hash;
        }.bind(this);

        this.pong = function(msg) {
            if (msg.from === this.props.peer.id) {
                if (this.state.opponent !== "none" && this.state.status === "CHALLENGING") {
                    if (this.state.noResponse === 25 || this.state.noResponse > 30) {
                        this.softReset("No Response");
                        console.log("soft reset")
                    }
                    this.setState({
                        noResponse: this.state.noResponse + 1
                    });
                } 
                return;
            }

            try {
                msg.data = JSON.parse(msg.data.toString());
            } catch (e) {
                return;
            }

            this.opponentsPreName[msg.from] = msg.data.usernameHash;
            this.handleRead(msg.from, msg.data.usernameHash);
            this.setState((prevState, props) => {
                prevState.peers[msg.from] = msg.data;

                if (
                    msg.data.status === "MATCHING" &&
                    prevState.status === "CHALLENGING" &&
                    prevState.opponent === msg.from &&
                    msg.data.opponent === this.props.peer.id
                ) {
                    console.log("Start matching", msg.from);
                    this.props.session.setStatus("PLAYING"); //change props of father
                    return {
                        key: 1,
                        opponent: msg.from,
                        status: "MATCHING",
                        peers: prevState.peers,
                        opponentName: this.opponentsName[msg.from]
                    };
                } else if (
                    msg.data.status === "CHALLENGING" &&
                    prevState.status === "CHALLENGING" &&
                    prevState.opponent === msg.from &&
                    msg.data.opponent === this.props.peer.id
                ) {
                    console.log("Start matching", msg.from);
                    this.props.session.setStatus("PLAYING"); //change props of father
                    return {
                        key: 1,
                        opponent: msg.from,
                        status: "MATCHING",
                        peers: prevState.peers,
                        opponentName: this.opponentsName[msg.from]
                    };
                } else if (
                    msg.data.status === "MATCHING" &&
                    prevState.status === "CHALLENGING" &&
                    prevState.opponent === msg.from &&
                    msg.data.opponent !== this.props.peer.id
                ) {
                    console.log("waiting for matching ", msg.from);
                    return {
                        key: 1,
                        opponent: msg.from,
                        status: "CHILLING",
                        peers: prevState.peers,
                        opponentName: this.opponentsName[msg.from]
                    };
                }
                return { peers: prevState.peers, key: 1 };
            });
        }.bind(this);

        this.ping = function() {
            var msg = new Buffer(JSON.stringify({
                        status: this.state.status,
                        usernameHash: this.props.usernameHash,
                        win: this.state.win,
                        lose: this.state.lose,
                        tie: this.state.tie,
                        opponent: this.state.opponent,
                        opponentName: this.state.opponentName,
                        lastMatch: this.state.lastMatch,
			email: this.props.session.props.mail
                    }));
            this.ipfs.pubsub.publish(this.topicLobby, msg)
        }.bind(this);
    }

    componentWillMount() {
        setInterval(this.ping, 1000);
        console.log("ipfs.pubsub.subscribe: " + this.topicLobby);
        this.ipfs.pubsub.subscribe(this.topicLobby, this.pong);
    }

    componentWillUnmount() {
        console.log("ipfs.pubsub.ubsubscribe: " + this.topicLobby);
        this.ipfs.pubsub.unsubscribe(this.topicLobby, this.pong);
        clearInterval(this.ping);
    }

    challengePeer(peerId) {
        this.setState({
            opponent: peerId,
            status: "CHALLENGING"
        });
    }

    handleRandom() {
        for (var peerId in this.state.peers) {
            if (this.state.peers[peerId].status === "CHILLING") {
                this.challengePeer(peerId);
                this.setState({ random: true, status: "CHALLENGING"});
            }
            else if(this.state.peers[peerId].status ==="CHALLENGING" && 
                this.state.peers[peerId].opponent === this.props.peer.id){
                var element = document.getElementById(peerId);
                element.scrollIntoView();
                console.log("Start matching", peerId);
                this.props.session.setStatus("PLAYING"); 
                this.setState({
                    key: 1,
                    opponent: peerId,
                    status: "MATCHING",
                    peers: this.state.peers,
                    opponentName: this.opponentsName[peerId]
                });
            }
        }
    }

    peer(peerId, index) {
        if (this.state.status === "CHALLENGING" && this.state.opponent === peerId){
            return <div key={"peer" + (index + 1)} className="clickable" id={peerId}>
                    <br />
                    <TextBar>
                        {peerId in this.opponentsName &&
                        this.opponentsName[peerId] !== undefined &&
                        this.opponentsName[peerId] !== ""
                            ? this.opponentsName[peerId]
                            : peerId}
                    </TextBar>
                    <PeerButton>CHALLENGING</PeerButton>
                    <br />
                    <Timer>
                        Wait {26 - this.state.noResponse} seconds
                    </Timer>
                </div>;
        }
        else if (this.state.status === "CHALLENGING" && this.state.opponent !== peerId){
            return ;
        }
        else {
        return (
            <div key={"peer" + (index + 1)} className="clickable" id={peerId}>
                <br />
                <TextBar>
                    {peerId in this.opponentsName &&
                    this.opponentsName[peerId] !== undefined &&
                    this.opponentsName[peerId] !== ""
                        ? this.opponentsName[peerId]
                        : peerId}
                </TextBar>
                <PeerButton 
                    challenged={
                        this.state.peers[peerId].status === "CHALLENGING" && 
                        this.state.peers[peerId].opponent === this.props.peer.id
                    } 
                    disabled={
                        !(this.state.peers[peerId].status === "CHALLENGING" && 
                        this.state.peers[peerId].opponent === this.props.peer.id) &&
                        this.state.peers[peerId].status !== "CHILLING"
                    }
                    onClick={() => this.challengePeer(peerId)
                    }>
                        {this.state.peers[peerId].status === "CHILLING" && this.state.opponent === peerId? 
                        "CHALLENGING" : 
                        (this.state.peers[peerId].status === "CHALLENGING" && 
                        this.state.peers[peerId].opponent === this.props.peer.id?
                        "PLAY NOW": this.state.peers[peerId].status)
                        }
                </PeerButton>
            </div>
        )}
    }

    reset(result,matchResult) {
        this.session.setPoints(result); //change props of father
        this.session.setStatus("WAITING"); //change props of father
        this.setState((prevState, props) => ({
            status: "CHILLING",
            opponent: "none",
            opponentName: "none",
            key: 0,
            peers: {},
            random: false,
            noResponse: 0,
            lastMatch: matchResult
        }));
    }

    setWin() {
        this.setState((prevState, props) => ({ win: prevState.win + 1 }));
    }

    setLose() {
        this.setState((prevState, props) => ({ lose: prevState.lose + 1 }));
    }

    setTie() {
        this.setState((prevState, props) => ({ tie: prevState.tie + 1 }));
    }

    softReset() {
        this.session.setStatus("WAITING"); //change props of father
        this.setState((prevState, props) => ({
            status: "CHILLING",
            opponent: "none",
            opponentName: "none",
            key: 0,
            peers: {},
            random: false,
            noResponse: 0
        }));
    }

    render() {
        return (
            <Div>
                {this.state.status === "MATCHING" ? (
                    <Main>
                        <br />
                            <Span5>
                                Opponent:
                                <Span5Inte>
                                    {this.state.opponentName === "none" || this.state.opponentName === undefined
                                        ? this.state.opponent
                                        : this.state.opponentName}
                                </Span5Inte>
                            </Span5>
                        <GameMatch
                            ipfs={this.ipfs}
                            peerId={this.props.peer.id}
                            opponentId={this.state.opponent}
                            session={this}
                        />
                    </Main>
                ) : (
                    <Aside>
                        {this.state.key === 0 ? (
                            <img
                                src={SearchIMG}
                                alt="Searching"
                                title="Searching"
                                style={{ width: "100%" }}
                            />
                        ) : (
                            <DivE>
                                <img
                                    src={TitleIMG}
                                    className="imgD"
                                    alt="Our AWESOME GAME!!"
                                />

                                <ButtonSelection
                                    onClick={() => this.handleRandom()}
                                >
                                    {this.state.random ? (
                                        <TextContent>
                                            Opponent Picked, please wait...{" "}
                                        </TextContent>
                                    ) : (
                                        <TextContent2>
                                            LET OUR MONKEYS CHOOSE A MATCH FOR
                                            YOU{" "}
                                        </TextContent2>
                                    )}
                                </ButtonSelection>
                                <FondoEm>
                                    <div className="scrollbar" id="style7">
                                        <div className="force-overflow">
                                            {Object.keys(this.state.peers).map(
                                                (peerId, index) =>
                                                    this.peer(peerId, index)
                                            )}
                                        </div>
                                    </div>
                                    <br />
                                    <br />
                                </FondoEm>
                                <DivB>
                                    <TextContent3>
                                        <Span4>
                                            My Lobby Status:
                                            <Span4Inte>
                                                {this.state.status}
                                            </Span4Inte>
                                        </Span4>
                                        <br />
                                        <br />
                                    </TextContent3>
                                    <TextContent>
                                        <Span>Wins: {this.state.win} </Span>
                                        <Span>Loses: {this.state.lose} </Span>
                                        <Span>Ties: {this.state.tie} </Span>
                                        <Span2>
                                            Points:{" "}
                                            {this.props.session.state.points}{" "}
                                        </Span2>
                                    </TextContent>
                                    <br />
                                </DivB>
                            </DivE>
                        )}
                    </Aside>
                )}
            </Div>
        );
    }
}

const Div = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: Transparent;
    align-content: center;
    text-align: center;
`;

const Span = styled.span`
    font-family: monospace, monospace;
    padding-left: 50px;
    padding-right: 20px;
    font-family: "Arial Black", Gadget, sans-serif;
    text-align: center;

    @media (max-width: 732px) {
        padding-left: 20px;
        padding-right: 5px;
    }

    @media (max-width: 576px) {
        padding-left: 20px;
        padding-right: 5px;
    }
`;

const Span2 = Span.extend`
    color: red;
    padding-left: 20px;
    padding-right: 50px;
    font-family: "Arial Black", Gadget, sans-serif;
    text-align: center;

    @media (max-width: 732px) {
        padding-left: 20px;
        padding-right: 5px;
    }

    @media (max-width: 576px) {
        padding-left: 20px;
        padding-right: 5px;
    }
`;

const Span4 = styled.span`
    padding-left: 16px;
    padding-right: 8px;
    font-family: "Arial Black", Gadget, sans-serif;
    text-align: center;
    font-size: 15px;

    @media (max-width: 732px) {
        font-size: 10px;
        padding-left: 20px;
        padding-right: 5px;
    }

    @media (max-width: 576px) {
        font-size: 10px;
        padding-left: 10px;
        padding-right: 8px;
    }
`;

const Span4Inte = styled.span`
    padding-left: 5px;
    text-align: center;
    font-family: monospace, monospace;
    font-size: 14px;

    @media (max-width: 732px) {
        font-size: 9px;
        padding-left: 2px;
    }

    @media (max-width: 576px) {
        font-size: 9px;
        padding-left: 3px;
        overflow-wrap: break-word;
    }
`;

const Span5 = styled.span`
    padding-left: 16px;
    padding-right: 8px;
    font-family: "Arial Black", Gadget, sans-serif;
    text-align: center;
    font-size: 25px;
    color: #fff;
    padding-bottom: 15px;
    font-weight: 600;

    @media (max-width: 732px) {
        font-size: 15px;
        padding-left: 20px;
        padding-right: 5px;
        font-weight: 600;
    }

    @media (max-width: 576px) {
        font-size: 15px;
        padding-left: 10px;
        padding-right: 8px;
        font-weight: 600;
    }
`;

const Span5Inte = styled.span`
    padding-left: 5px;
    text-align: center;
    font-family: monospace, monospace;
    font-size: 25px;
    color: red;

    @media (max-width: 732px) {
        font-size: 15px;
        padding-left: 2px;

    }

    @media (max-width: 576px) {
        font-size: 15px;
        padding-left: 3px;
        overflow-wrap: break-word;

    }
`;

const Main = styled.div`
    padding: 3px;
    width: 100%;
    padding-top: 10px;
    background-image: url(${MeetingIMG});
    background-size: cover;
`;

const Aside = styled.div`
    background-color: Transparent;
    display: flex;
    flex-direction: column;
    align-items: center;

    align-content: center;
    text-align: center;
`;

const TextBar = styled.button`
    font-family: monospace, monospace;
    border: none;
    padding: 6px 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;    
    background-color: black;
    color: white;
    font-size: 16px;
    text-align: center;
    @media (max-width: 723px) {
        font-size: 10px;
    }
`;

const TextContent = styled.h3`
    font-size: 18px;
    color: #eff2e4;
    font-weight: 400;
    font-family: "Arial Black", Gadget, sans-serif;
    text-align: center;

    @media (max-width: 732px) {
        font-size: 12px;
    }

    @media (max-width: 576px) {
        font-size: 12px;
    }
`;

const TextContent2 = styled.h3`
    font-size: 18px;
    color: #fff;
    font-weight: 600;
    font-family: "Arial Black", Gadget, sans-serif;
    text-align: center;

    @media (max-width: 732px) {
        font-size: 12px;
    }

    @media (max-width: 576px) {
        font-size: 12px;
    }
`;

const TextContent3 = styled.h3`
    color: #eff2e4;
    font-weight: 400;
    font-family: sans-serif;
    text-align: center;
`;

const PeerButton = styled.button`
    font-family: monospace, monospace;
    font-size: 10px;
    text-decoration: none;
    padding: 7px;
    font-weight: 400;
    color: #000000;
    background-color: #ffee03;
    margin-right: auto;
    cursor:pointer;
    cursor:hand;
    
    @media (max-width: 732px) {
        height:35px;
      }

    @media (max-width: 576px) {
        height:35px;
      }
    ${props =>
        props.challenged &&
        css`
            background: palevioletred;
            color: white;
        `};
`;

const DivB = styled.div`
    width: auto;
    background-color: #000;
    border-radius: 2px;
    align-content: center;
    text-align: center;
`;

const ButtonSelection = styled.button`
    background-color: #e43135;
    padding: 20px;
    position: relative;
    width: 100%;
    text-decoration: none;
    color: #fff;
    background-image: linear-gradient(
        bottom,
        rgb(239, 241, 228) 0%,
        rgb(239, 241, 228) 100%
    );
`;

const DivE = styled.div`
    width: 100vh;
    align-content:center;
        text-align: center;
    
    @media (max-width: 732px) {
        width: 100%;
      }
    
    @media (max-width: 576px) {
        width: 100%;
      }
`;

const FondoEm = styled.div`
    background-image: url(${OnlinePeers});
    height:355px;
    width:100vh;
    background-size:cover;
    
    @media (max-width: 732px) {
        height:auto;
        width:auto;
        background-size:cover;
      }
    
    @media (min-width: 577px) {
        min-height:200px;
        width:auto;
        background-size:cover;
    }

    @media (max-width: 576px) {
        min-height:200px;
        width:auto;
        background-size:cover;
      }
`;

const Timer = styled.span`
    background-color: #f44336;
    padding: 10px 14px;
    font-size: 24px;
`;
