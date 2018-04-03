import React from 'react';
import styled from "styled-components";
import Obfuscate from "react-obfuscate";

export default class GameConnection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            peer: "none", 
        };
        this.ipfs = props.session.ipfs;
    }

    componentWillMount() {
        this.ipfs.on('ready', () => {
            console.log("IPFS.on: ready");
            this.ipfs.id((err, peer) => {
                if (err) {
                    console.log("IPFS.id error: ", err);
                    return;
                };
                this.setState({peer: peer,});
                this.props.session.setPeer(peer);                                                  //change props of father
                this.props.session.setStatus("WAITING");                                           //change props of father
            })
        });
    }

    render() {
        return <div>
                <TextConnection>
                    Provable fair gaming on the blockchain, powered by
                    FairCoin
                </TextConnection>
                <br />
                <TextConnection>CONNECTION </TextConnection>
                <br />
                <TextConnection>MyPeerId:</TextConnection>
                <TextPeers>{this.state.peer.id}</TextPeers>

                <TextConnection>Player Status:</TextConnection>
                <TextPeer>{this.props.session.state.status}</TextPeer>
                <br />
                <br />
                <TextConnection>Email:</TextConnection>
                <Center1>
                    <Obfuscate email="info@vertexstudio.co" headers={{ subject: "Question from the website", cc: "israel@vertexstudio.co" }} />
                </Center1>
            </div>;
    }
};


const TextConnection = styled.h2`
    font-size: 18px;
    font-family: sans-serif;
    font-weight: 100;
    text-align: center;
    color : #fff;
`;

const TextPeer = TextConnection.extend`
    font-family: monospace, monospace;
`;

const TextPeers = TextConnection.extend`
    font-family: monospace, monospace;
    font-size: 16px;
    
    @media (max-width: 723px) {
        font-size: 13px;
        font-family: monospace, monospace;
    }

    @media (max-width: 576px) {
        font-size: 13px;
        font-family: monospace, monospace;
      }
`;

const Center1 = styled.div`
  align-content: center;
  text-align: center;
 `;