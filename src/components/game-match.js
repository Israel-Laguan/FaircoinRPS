import React from "react";
import styled, { css } from "styled-components";
import Piedra from "../img/Piedra.png";
import Papel from "../img/Papel.png";
import Tijera from "../img/Tijera.png";
import rockImg from "../img/Mano 1.png";
import paperImg from "../img/Mano 2.png";
import scissorsImg from "../img/Mano 3.png";
import HisRock from "../img/Mano 4.png";
import HisPaper from "../img/Mano 5.png";
import HisScissors from "../img/Mano 6.png";
import rockImg2 from "../img/Manos1R.png";
import paperImg2 from "../img/Manos2R.png";
import scissorsImg2 from "../img/Manos3R.png";

const turnLimit = 3;
export default class GameMatch extends React.Component {
    constructor(props) {
        super(props);
        this.topic = "vertex.rps.match";
        this.state = {
            round: 0,
            mine: "",
            theirs: "",
            result: "",
            ack: 0,
            noResponse: 0
        };
        this.matchRecord = []; //set on lines 87, 94 & 101
        this.ipfs = this.props.ipfs;
        this.status = this.props.status;

        this.pong = function(msg) {
            //analize incoming msg.
            if (msg.from !== this.props.opponentId) {
                console.log("Wait Response...");
                if (this.state.mine !== "" && this.state.theirs === "") {
                    if (this.state.noResponse === 45 || this.state.noResponse > 60) {
                        this.props.session.reset("No Response",[]);
                    }
                    this.setState({
                        noResponse: this.state.noResponse + 1
                    });
                } else {
                    if (this.state.noResponse === 60) {
                        this.props.session.reset("No Response",[]);
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

            if (msg.data.round > this.state.round) {
                this.setState((prevState, props) => ({
                    round: msg.data.round,
                    mine: "",
                    theirs: "",
                    result: "",
                    ack: 0,
                    noResponse: 0
                }));
                return;
            } else if (
                //When enought info, end match
                (msg.data.ack >= 3 &&
                this.matchRecord.length === turnLimit) ||
                this.matchRecord.length > 10
            ) {
                if (
                    this.matchRecord.filter(x => x === "win").length >
                    this.matchRecord.filter(x => x === "lose").length
                ) {
                    this.props.session.setWin();
                    this.props.session.reset("win",this.matchRecord);
                    this.setState({ noResponse: 0 });
                } else if (
                    this.matchRecord.filter(x => x === "win").length ===
                    this.matchRecord.filter(x => x === "lose").length
                ) {
                    this.props.session.setTie();
                    this.props.session.reset("tie",this.matchRecord);
                    this.setState({ noResponse: 0 });
                } else if (
                    this.matchRecord.filter(x => x === "win").length <
                    this.matchRecord.filter(x => x === "lose").length
                ) {
                    this.props.session.setLose();
                    this.props.session.reset("lose", this.matchRecord);
                    this.setState({ noResponse: 0 });
                }
            }

            if (msg.data.round === this.state.round) {
                this.setState((prevState, props) => {
                    return { theirs: msg.data.theirs };
                });
            }

            if (
                //both have enought info to decide
                this.state.result === "" &&
                msg.data.theirs !== "" &&
                msg.data.mine !== "" &&
                msg.data.round === this.state.round
            ) {
                var state = { ack: 1 };
                if (this.state.mine === this.state.theirs) {
                    //this chunk judge the game
                    state.result = "tie";
                    this.matchRecord.push("tie");
                    state.noResponse = 0
                } else if (
                    (this.state.mine === "R" && this.state.theirs === "P") ||
                    (this.state.mine === "P" && this.state.theirs === "S") ||
                    (this.state.mine === "S" && this.state.theirs === "R")
                ) {
                    state.result = "lose";
                    this.matchRecord.push("lose");
                    state.noResponse = 0
                } else if (
                    (this.state.mine === "R" && this.state.theirs === "S") ||
                    (this.state.mine === "P" && this.state.theirs === "R") ||
                    (this.state.mine === "S" && this.state.theirs === "P")
                ) {
                    state.result = "win";
                    this.matchRecord.push("win");
                    state.noResponse = 0;
                }
                this.setState(state); //collects the info that changed.
            } else if (this.state.result !== "" && msg.data.result !== "") {
                //Ensure the info is gathered
                this.setState((prevState, props) => ({
                    ack: prevState.ack + (msg.data.ack > 0 ? 1 : 0)
                }));
                if (this.state.ack > 3) {
                    //deep of levels to be sure
                    this.setState((prevState, props) => ({
                        round: prevState.round + 1,
                        mine: "",
                        theirs: "",
                        result: "",
                        ack: 0,
                        noResponse: 0
                    }));
                }
            }
        }.bind(this);

        this.ping = function() {
            //set info to send as msg. Set at line 136
            var msg = new Buffer(
                JSON.stringify({
                    round: this.state.round,
                    mine: this.state.theirs,
                    theirs: this.state.mine,
                    result: this.state.result,
                    ack: this.state.ack
                })
            );
            this.ipfs.pubsub.publish(this.topic, msg);
            if (this.matchRecord.length === turnLimit && this.state.ack >= 3) {
                //When enought info, end match
                if (
                    this.matchRecord.filter(x => x === "win").length >
                    this.matchRecord.filter(x => x === "lose").length
                ) {
                    this.props.session.setWin();
                    this.props.session.reset("win", this.matchRecord);
                    this.setState({noResponse: 0});
                } else if (
                    this.matchRecord.filter(x => x === "win").length ===
                    this.matchRecord.filter(x => x === "lose").length
                ) {
                    this.props.session.setTie();
                    this.props.session.reset("tie", this.matchRecord);
                    this.setState({noResponse: 0});
                } else if (
                    this.matchRecord.filter(x => x === "win").length <
                    this.matchRecord.filter(x => x === "lose").length
                ) {
                    this.props.session.setLose();
                    this.props.session.reset("lose", this.matchRecord);
                    this.setState({ noResponse: 0 });
                }
            }
        }.bind(this);
    }

    componentWillMount() {
        this.ping = setInterval(this.ping, 500);
        this.ipfs.pubsub.subscribe(this.topic, this.pong);
        console.log("ipfs.pubsub.subscribe: ", this.topic);
    }

    componentWillUnmount() {
        console.log("ipfs.pubsub.ubsubscribe: " + this.topic);
        this.ipfs.pubsub.unsubscribe(this.topic, this.pong);
        clearInterval(this.ping);
    }

    play(selection) {
        this.setState((prevState, props) => {
            if (prevState.mine === "") {
                return { mine: selection };
            }
        });
    }

    render() {
        return (
            <Div>
                <DivScore>
                    <Score>
                        <Result>
                            <Span>Wins</Span>
                            <SpanPeer text>
                                {
                                    this.matchRecord.filter(x => x === "win")
                                        .length
                                }
                            </SpanPeer>
                        </Result>
                        <Result>
                            <Span>Ties</Span>
                            <SpanPeer text>
                                {
                                    this.matchRecord.filter(x => x === "tie")
                                        .length
                                }
                            </SpanPeer>
                        </Result>
                        <Result>
                            <Span>Wins</Span>
                            <SpanPeer text>
                                {
                                    this.matchRecord.filter(x => x === "lose")
                                        .length
                                }
                            </SpanPeer>
                        </Result>
                    </Score>
                </DivScore>
                <br />
                <Main>
                    <DivContainer>
                        <div>
                            <H1>YOU</H1>
                        </div>
                        <br />
                        <Container>
                            {this.state.mine === "" ||
                            this.state.theirs === "" ? (
                                <Animation
                                    src={rockImg}
                                    className="animation"
                                />
                            ) : this.state.mine === "R" ? (
                                <Animation2 src={rockImg} />
                            ) : this.state.mine === "P" ? (
                                <Animation2 src={paperImg} />
                            ) : (
                                <Animation2 src={scissorsImg} />
                            )}
                        </Container>
                        <br />
                    </DivContainer>
                    <DivContainer>
                        <div>
                            <H1>OPPONENT</H1>
                        </div>
                        <br />
                        <Container>
                            {this.state.mine === "" ||
                            this.state.theirs === "" ? (
                                <Animation
                                    src={HisRock}
                                    className="animationInvest"
                                />
                            ) : this.state.theirs === "R" ? (
                                <Animation2 src={HisRock} />
                            ) : this.state.theirs === "P" ? (
                                <Animation2 src={HisPaper} />
                            ) : (
                                <Animation2 src={HisScissors} />
                            )}
                        </Container>
                    </DivContainer>
                    <br />
                </Main>
                <Selection>
                    {this.state.mine === "" ? (
                        <div>
                            <MatchButton onClick={() => this.play("R")}>
                                <Img src={Piedra} alt="I play Rock!" />
                            </MatchButton>
                            <MatchButton onClick={() => this.play("P")}>
                                <Img src={Papel} alt="I play Paper!" />
                            </MatchButton>
                            <MatchButton onClick={() => this.play("S")}>
                                <Img src={Tijera} alt="I play Scissors!" />
                            </MatchButton>
                        </div>
                    ) : this.state.mine === "R" ? (
                        <div>
                            <ButtonSelection>
                                <Img src={rockImg2} alt="I play Rock!" />
                            </ButtonSelection>
                            <MatchButton disabled="true">
                                <Img src={Papel} alt="I play Paper!" />
                            </MatchButton>
                            <MatchButton disabled="true">
                                <Img src={Tijera} alt="I play Scissors!" />
                            </MatchButton>
                        </div>
                    ) : this.state.mine === "P" ? (
                        <div>
                            <MatchButton>
                                <Img src={Piedra} alt="I play Rock!" />
                            </MatchButton>
                            <ButtonSelection disabled="true">
                                <Img src={paperImg2} alt="I play Paper!" />
                            </ButtonSelection>
                            <MatchButton disabled="true">
                                <Img src={Tijera} alt="I play Scissors!" />
                            </MatchButton>
                        </div>
                    ) : (
                        <div>
                            <MatchButton>
                                <Img src={Piedra} alt="I play Rock!" />
                            </MatchButton>
                            <MatchButton disabled="true">
                                <Img src={Papel} alt="I play Paper!" />
                            </MatchButton>
                            <ButtonSelection disabled="true">
                                <Img
                                    src={scissorsImg2}
                                    alt="I play Scissors!"
                                />
                            </ButtonSelection>
                        </div>
                    )}
                </Selection>
            </Div>
        );
    }
}

const Div = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: Transparent;

    @media (max-width: 424px) {
        margin: 0;
        paddig: 0;
        justify-content: flex-start;
    }
`;

const Main = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const H1 = styled.h1`
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-family: sans-serif;
    color: #eff2e4;

    @media (max-width: 723px) {
        font-size: 15px;
    }

    @media (max-width: 424px) {
        font-size: 20px;
    }
`;

const DivScore = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;

    @media (max-width: 372px) {
        margin: 0;
    }
`;

const DivContainer = styled.div`
    margin: 1px;

    @media (max-width: 732px) {
        margin: 1px;
    }

    @media (max-width: 576px) {
        margin: 1px;
    }
`;

const Selection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Container = styled.div`
    width: 100%;
    height: 190px;

    @media (max-width: 723px) {
        width: 140px;
        height: 190px;
    }

    @media (max-width: 553px) {
        width: 130px;
        height: 190px;
    }
`;

const Img = styled.img`
    width: 200px;
    height: 200px;

    @media (max-width: 732px) {
        width: 110px;
        height: 110px;
    }

    @media (max-width: 576px) {
        width: 110px;
        height: 110px;
    }
`;

const Animation = styled.img`
    margin-top: 12px;
    -moz-width: 100%;
    -webkit-width: 100%;
    height: 75%;
    margin-left: -17px;

    @media (max-width: 732px) {
        height: 40%;
        margin-left: -6px;
    }

    @media (max-width: 576px) {
        height: 40%;
        margin-left: -6px;
    }

    ${props =>
        props.invest &&
        css`
            -moz-transform: scaleX(-1);
            -o-transform: scaleX(-1);
            -webkit-transform: scaleX(-1);
            transform: scaleX(-1);
            filter: FlipH;
        `};
`;

const Animation2 = styled.img`
    margin-top: 12px;
    -moz-width: 100%;
    -webkit-width: 100%;
    height: 90%;
    margin-left: -17px;

    -webkit-filter: brightness(200%);
    filter: brightness(200%);

    -webkit-filter: contrast(240%);
    filter: contrast(240%);

    @media (max-width: 732px) {
        height: 50%;
        margin-left: -6px;
    }

    @media (max-width: 576px) {
        height: 50%;
        margin-left: -6px;
    }

    ${props =>
        props.invest &&
        css`
            -moz-transform: scaleX(-1);
            -o-transform: scaleX(-1);
            -webkit-transform: scaleX(-1);
            transform: scaleX(-1);
            filter: FlipH;
        `};
`;

const Score = styled.div`
    font-family: "Geo", serif;
    font-size: 25px;
    color: #eff2e4;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Result = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;
    width: 70px;
    height: 64px;
    background-color: Transparent;

    @media (max-width: 723px) {
        width: 50px;
        height: 50px;
        margin-left: 10px;
    }

    @media (max-width: 576px) {
        width: 50px;
        height: 50px;
        margin-left: 10px;
    }
`;

const Span = styled.span`
    margin-top: 5px;
    font-family: "Arial Black", Gadget, sans-serif;
    text-align: center;
    font-size: 30px;
    padding-right: 50px;

    @media (max-width: 723px) {
        font-size: 20px;
    }

    @media (max-width: 576px) {
        font-size: 20px;
    }
    ${props =>
        props.text &&
        css`
            margin-left: 25px;
            font-size: 30px;

            @media (max-width: 364px) {
                margin-top: -13px;
                margin-left: 18px;
            }
        `};
`;

const SpanPeer = styled.span`
    margin-top: 5px;
    font-family: monospace, monospace;
    font-size: 30px;

    @media (max-width: 723px) {
        margin-top: 5px;
        font-size: 25px;
    }

    @media (max-width: 576px) {
        margin-top: 5px;
        font-size: 25px;
    }

    ${props =>
        props.text &&
        css`
            margin-left: 25px;
            font-size: 35px;

            @media (max-width: 364px) {
                margin-top: 3px;
                margin-left: 8px;
            }
        `};
`;

const MatchButton = styled.button`
    background-color: Transparent;
    position: relative;
`;

const ButtonSelection = styled.button`
    background-color: transparent;

    position: relative;
    font-size: 12px;
    text-decoration: none;
    color: #fff;
    background-image: linear-gradient(
        bottom,
        rgb(239, 241, 228) 0%,
        rgb(239, 241, 228) 100%
    );
`;

