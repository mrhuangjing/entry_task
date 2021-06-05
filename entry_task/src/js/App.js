import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login.js';
import Home from './components/Home.js';
import Detail from './components/Detail.js';
import Me from './components/Me.js';

function App () {
    return (
        <Router basename="/entry_task">
            <Switch>
                <Route path="/login" component={Login}></Route>
                <Route path="/home" component={Home}></Route>
                <Route path="/detail" component={Detail}></Route>
                <Route path="/me" component={Me}></Route>
                <Route path="/" component={Login}></Route>
            </Switch>
        </Router>
    );
}

export default App;