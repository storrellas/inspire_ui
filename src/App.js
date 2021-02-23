import logo from './logo.svg';
import './App.scss';
import { Switch, Route } from "react-router-dom";
import Base from "./pages/base"

function App() {
  return (
    <div>
      <Switch>
        <Route path="/">
          <Base />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
