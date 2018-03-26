
# RPS - Faircoin
### A Rock, Paper and Scissors multiplayer game!

Creating a Rock-Paper-Scissors's game shouldn't pose a *problem*, right? **WRONG**

Our team always searching for new code-toys, new skies to fly-bye, started to develop a game using the latest file system on the town, **IPFS**. With **IPFS** the goal is to use a decentralized high-tech network that surely will change the internet as we know it. Using the concepts learned from *bitcoin*, *blockchain*, *cryptocurrencies* world, with core concepts as *merkle-tree*, 
![Faircon](https://ucarecdn.com/ff33e551-2b88-49e3-b220-3149017cafa0/)

 If you want to jump and play:  [Demo](https://vertexstudio.github.io/FaircoinRPS/)
# Files
The files follows the usual react-create-app structure:
```
JanKenPon-construction
├── package.json
├── public
│   ├── bgimage.png
│   └── index.html
└── src
    ├── components
    │   ├── game-connection.js
    │   ├── game-lobby.js
    │   ├── game-match.js
    │   ├── game.js
    │   └── style.css
    ├── css
    │   ├── styles.css
    ├── index.js
    └── img
        ├── loading.gif
        ├── Mano 1.png
        ├── Mano 2.png
        ├── Mano 3.png
        ├── Mano 4.png
        ├── Mano 5.png
        ├── Mano 6.png
        ├── Mano 1R.png
        ├── Mano 2R.png
        ├── Mano 3R.png
        ├── match.png
        ├── Online-Peers.png
        ├── Papel.png
        ├── Piedra.png
        ├── search.gif
        ├── Tijera.png
        └── title.png
 
```
## How to run
~~You must know by now, but well...~~ Open a terminal in the parent folder of your choose and type (or ol'faithful copy & paste):
```
git clone https://github.com/VertexStudio/FaircoinRPS.git
cd FaircoinRPS/ && npm install && npm start
```
This runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.
## Supported Browsers
We Recommend **FIREFOX** for both desktop and mobile. Specially on mobile we have issues with *Chrome*, but if you find any other bug please post an issue [here](https://github.com/VertexStudio/FaircoinRPS/issues).
 

You can refer [to the React documentation](https://reactjs.org/docs/react-dom.html#browser-support) for more information about supported browsers.

## Game's Functional Specs.

### Introduction.

Games and coding are fun! At least until mistakes and errors arise. This is a classic aproach to Rock, Paper and Scissors game, but using IPFS to communicate moves. 



### Setting up game.
![Login](https://ucarecdn.com/98a91ff0-a960-4022-80bf-0eda2b1a4b38/)

First you will notice a jumpy monkey, and a prompt inviting you to enter your email. This  is important because in this email you will receive the prize code if you win ingame. So is important that you double check your input. To play is not required that you enter an email, but if you win some Faircoins and we can't contact you, that Faircoins will be lost forever, so be careful, ok? (*blink).

At the bottom of the screen is the **CONNECTION** section. This shows **OFFLINE** at first, so notice that reflect the status of our *ipfs-js* node, a Guaranty Trusty way to get safest connection because we are talking about *money* here. When it changes to **WAITING** that means that IPFS created a node, and subscribe to our lobby channel. 

### Lobby and waiting a game.
![Lobby](https://ucarecdn.com/4e76ba75-56eb-497a-9efe-bb852dfd44e9/)

At the bottom you will see a **PeerID** field, indicating your unique id inside the game. This ID is generated by IPFS and can't be shared by others players even inside your local network, even inside your own machine system! But if you change the machine your **PeerID** changes, take that into account. This **PeerId** is used as a sort of name, but if you feel like be even more unique, at the top of the viewport is a little icon whith the legend `Change your Nickname`. You can choose to put your name or nickname for others to see it.

Also you will see another status field, first at **CHILLING**, meaning you are relaxing on our lobby, just waiting a challenge. Other status is **Challenging**, that means your are connecting with other player and trying to have an old fashioned match. The last possible status is **Matching**, when, yeah you guess it, you are actually playing the game against an human player.

Next you will see a growing list of **ONLINE PEERS**, that catch from the lobby other players in Chilling status. You can select one of them, or press the orangy button to select randomly, and notice that your status switch to *Challenging*. When the other player or you get a *Challenging Call*, a button on the Online Peers list will change color, and the way to answer is selecting back the colored button. If the challenge was accepted, the status will change to Matching.
> **ProTip:** When nobody answer your challenge, the list will update after a minute of waiting

### Matching
![Match](https://ucarecdn.com/e05561c9-f6cd-4919-980c-ead047a3b552/)

You can see the opponent's name atop the **Match Window**, also a counter of the times you win, tie or lose. To select an option, click or tap one of the buttons, ~~that try to be self explanatory, but well...~~ the first button from your left is the **ROCK**, the middle one is **PAPER** and the last is the **SCISSORS**.

If you don't know the game, here is a fancy guide:

- You play against other human. So you have to wait for the other to send their choose, but you can choose your selection right from the beginning. 
> **ProTip**: If the opponent don't answer with a move after a while, the match is invalidated and you return to **LOBBY** screen. 
- The rules are explained in the next table:

| "Isn't this fun?" |against Rock  |against Paper|against Scissors   |
|-------------------|-------|-----|-----------|
|my Rock | Rock hits Rock. TIE| Rock is Wrapped by Paper. LOSE | Rock smash Scissors. WIN | 
|my Paper|Paper wraps Rock. Win |Paper rub Paper. TIE | Paper is cut by Scissors. LOSE|
|my Scissors  | Scissors is smashed by Rock. LOSE |Scissors cut Paper. WIN|Scissors sharpen Scissors. TIE|

- When both choose a move, an interesting algorithm about checking connection and deciding/validating is running to decide the result and distributing points. Please be patient if it hangs up, when the consensus is reached you can continue to play.
- When 3 rounds are played, the game will decide who win, and you will return to **LOBBY** screen.


# TODO

- Use A-Frame WebVR instead of images.
- Direct FairCoin connection.
- Make your device fly or/and transform into a robot.

## Team Development

- Rozgo (TEAM LEADER)
- Max (SENIOR PROGRAMMER)
- Javi
- Israel

## Confusing diagrams

Games's sequence diagram:

![SequenceDiagram](https://ucarecdn.com/acc6889e-5951-46c8-8653-9165d4c2d0db/)

To visualize the flow with a  flow chart:

![TreeDiagram](https://ucarecdn.com/ddc9c00d-603a-4a7f-8bd6-e6346e89145b/)
