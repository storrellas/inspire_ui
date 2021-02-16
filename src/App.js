import logo from './logo.svg';
import './App.scss';
import { Switch, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard"

function App() {
  return (
    <div>
      <Switch>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
