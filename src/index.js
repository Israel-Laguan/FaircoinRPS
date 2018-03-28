import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './components/game';
import registerServiceWorker from './registerServiceWorker';
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";
const Ipfs = window.Ipfs;
const theme = createMuiTheme({   
  palette: {
    primary: {
      main: '#ffee03',
    },
    secondary: {
      main: '#ff6c4c', 
    },
    textColor: '#ffee03',
  },
  overrides: {
    MuiButton: {
      root: {
        background: "#000",
        color: '#fff',
        height: 28,
        padding: "0 10px",
        textTransform: 'none',
        fontFamily: "sans-serif",
      },
    },
  },
});

class GameWorld extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: true, email: "", email2: "" };
        this.handleChangeNameEmail = this.handleChangeNameEmail.bind(this);
        this.handleChangeNameEmail2 = this.handleChangeNameEmail2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.ipfs = new Ipfs({
            EXPERIMENTAL: { pubsub: true },
            online: true,
            config: {
                Addresses: {
                    API: "/ip4/127.0.0.1/tcp/5001",
                    Announce: [],
                    Gateway: "/ip4/127.0.0.1/tcp/8080",
                    NoAnnounce: [],
                    Swarm: [
                        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
                    ]
                },
                Bootstrap: [
                    "/ip4/192.168.0.27/tcp/4001/ipfs/QmWvsZ1ZxLMa5aB6MMtG8nJvFZ6HsiLgx5RpP9DX7qpjPo"
                ]
            }
        });
    }

    handleNameSubmit = () => {
        if (this.state.email === "") {
            alert(
                "Our ants in charge of check email said there is no email"
            );
        } else if (this.state.email !== this.state.email2) {
            alert(
                "Our ants in charge of check email said they don't match. \nCheck for any typo, please"
            );
        } else {
            this.ipfs.files.add(
                Buffer.from(this.state.email),
                (err, res) => {
                    if (err || !res) {
                        return console.error(
                            "ipfs add error",
                            err,
                            res
                        );
                    }

                    res.forEach(file => {
                        if (file && file.hash) {
                            this.ipfs.files.cat(
                                file.hash,
                                (err, data) => {
                                    if (err) {
                                        return console.error(
                                            "ipfs cat error",
                                            err
                                        );
                                    }
                                    this.setState({
                                        mailHash: file.hash
                                    });
                                    console.log(
                                        "successfully stored email:",
                                        data.toString()
                                    );
                                }
                            );
                        }
                    });
                }
            );
            this.setState({ open: false });
        }
    };

    handleChangeNameEmail(event) {
        this.setState({ email: event.target.value });
    }

    handleChangeNameEmail2(event) {
        this.setState({ email2: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return <MuiThemeProvider theme={theme}>
                <div>
                    <Game ipfs={this.ipfs}  email={this.state.email}/>
                    <div className="Center">
                        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" onSubmit={this.handleSubmit}>
                            <DialogTitle id="form-dialog-title">
                                Login
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Please enter your email
                                    address here. To claim prizes, we need your email.
                                    No chain mails. Promised.
                                </DialogContentText>
                                <TextField autoFocus margin="dense" id="name" label="Email Address" type="email" fullWidth value={this.state.email} onChange={this.handleChangeNameEmail} onSubmit={this.handleSubmit} />
                                <DialogContentText>
                                    Confirm your e-mail:
                                </DialogContentText>
                                <TextField autoFocus margin="dense" id="name" label="Email Address, yet again" type="email" fullWidth value={this.state.email2} onChange={this.handleChangeNameEmail2} onSubmit={this.handleSubmit} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    Play Whitout Login
                                </Button>
                                <Button onClick={(this.handleNameSubmit)} color="primary" type="submit" value="Submit">
                                    Subscribe
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </MuiThemeProvider>;
    }
}

ReactDOM.render(<GameWorld />, document.getElementById('root'));
registerServiceWorker();
