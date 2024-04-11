import "./App.css";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import useAuth from "./store/useAuth";

function App() {
  const user = useAuth((state) => state.user);

  return <div className="App">{user ? <Chatpage /> : <Homepage />}</div>;
}

export default App;
