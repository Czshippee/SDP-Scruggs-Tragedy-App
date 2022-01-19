import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import { v4 } from "uuid";

import { AppData } from "./context/context.jsx";
import GameJoin from "./components/gameJoin.jsx";
import Host from "./components/host.jsx";
import Player from "./components/player.jsx";

import LoadingPage from "./pages/loadingPage/loadingPage.jsx";
import NoMatch from "./pages/noMatch";
  // kellys page
import DummyGame from "./pages/playerGame/playerGameDummy.jsx"  // zahins test
import PlayerGameOver from "./pages/gameOver/playerGameOver.jsx";
import GameOver from "./pages/gameOver/gameOver.jsx";


const App = () => {
  const stateIDKey = "id";
  if (!sessionStorage.getItem(stateIDKey)) {
    sessionStorage.setItem(stateIDKey, v4());
  }
  const uuid = sessionStorage.getItem(stateIDKey);

  const [init, setInit] = useState(false);
  const [socket, setSocket] = useState({});

  useEffect(() => {
    setInit(false)
    //const ENDPOINT = "http://50.28.145.63:3000";
    const ENDPOINT = "http://localhost:3000"
    const sock = io(ENDPOINT, { transport: ["websocket"] });

    // need to wait for the socket to connect before loading root page
    sock.on("connect", () => {
      setSocket(sock);
      setInit(true);
    });
  }, []);

  if (!init) return <LoadingPage />
  return (
    <AppData>
      <Router >
        <Switch>
          <Route exact path="/">
            <GameJoin uuid={uuid} socket={socket}/>
          </Route>
          <Route path="/host">
            <Host uuid={uuid} socket={socket}/>
          </Route>
          <Route path="/player">
            <Player uuid={uuid} socket={socket}/>
          </Route>
          <Route path="/playergameover">
            <PlayerGameOver uuid={uuid} socket={socket}/>
          </Route>
          <Route path="/gameover">
            <GameOver uuid={uuid} socket={socket}/>
          </Route>
          <Route path="/loading">
            <LoadingPage/>
          </Route>
          <Route>
            <NoMatch />
          </Route>
          
        </Switch>
      </Router>
    </AppData>
  );
};

export default App;
