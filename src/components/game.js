import React from "react";
import styled from "styled-components";
import GameLobby from "./game-lobby";
import GameConnection from "./game-connection";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import LoadingIMG from "../img/loading.gif";
import AccountCircleIcon from "material-ui-icons/AccountCircle";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            peer: {},
            status: "none",
            date: new Date(),
            points: 0,
            openNameDialog: false,
            openConfigDialog: false,
            totalWins: 0,
            usernameHash: "none"
        };
        this.ipfs = props.ipfs;
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.setState({
            usernameHash: "QmVWMufjtpwMz9zmdNhQrBSX8gssedcU9U24b7F1KdfRgg" //set default name: player
        });
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000); 
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    handleClickOpenName = () => {
        this.setState({ openNameDialog: true });
    };
    handleClickOpenConfig = () => {
        this.setState({ openConfigDialog: true });
    };

    handleClose = () => {
        this.setState({ openNameDialog: false }); 
        this.setState({ openConfigDialog: false });
    };

    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    setPoints(result) {
        if (result === "win") {
            this.setState({
                points: this.state.points + 3,
                totalWins: this.state.totalWins + 1
            });
        } else if (result === "tie") {
            this.setState({
                points: this.state.points + 1
            });
        }
    }

    setPeer(peer) {
        this.setState({ peer: peer });
    }

    setStatus(status) {
        this.setState({ status: status }); 
    }

    tick() {
        this.setState({ date: new Date() });
    }

    render() {
        return (
            <Div>
                <ConfigButton>
                    <div>
                        <Button
                            onClick={this.handleClickOpenName}
                            style={{ width: "100vw" }}
                        >
                            <AccountCircleIcon /> {(this.state.name==="")?"Change your Nickname":"Welcome "+this.state.name}
                        </Button>
                        <Dialog
                            open={this.state.openNameDialog}
                            onClose={this.handleClose}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">
                                NAME
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    You can enter how you wish to be called
                                    inside RPS.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="NAME/NICKNAME"
                                    fullWidth
                                    type="text"
                                    value={this.state.value}
                                    onChange={this.handleChangeName}
                                    onSubmit={this.handleSubmit}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={(this.handleClose)}
                                    color="primary"
                                    type="submit"
                                    value="Submit"
                                >
                                    Send
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </ConfigButton>
                {this.state.status !== "none" ? (
                    <GameLobby
                        session={this}
                        peer={this.state.peer}
                        status={this.state.status}
                        usernameHash={this.state.name}
                    />
                ) : (
                    <img
                        src={LoadingIMG}
                        alt="Loading"
                        title="Loading"
                        style={{ width: "100%" }}
                    />
                )}
                <Footer>
                    <GameConnection session={this} />
                </Footer>
            </Div>
        );
    }
}

const Footer = styled.div`
    margin-top: auto;
    background-color: Transparent;
`;

const Div = styled.div`
    margin: 0 auto;
    width: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    @media (max-width: 1024px) {
        width: 100%;
    }
`;

const ConfigButton = styled.div`
    justify-content: center;
`;
