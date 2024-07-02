//import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Body from './components/body';
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Body />
      <Toaster />
    </div>
  );
}

export default App;
