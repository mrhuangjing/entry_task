import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Suspense } from 'react';
const Login = React.lazy(() => import("./components/Login.js"));
const Home = React.lazy(() => import("./components/Home.js"));
const Detail = React.lazy(() => import("./components/Detail.js"));
const Me = React.lazy(() => import("./components/Me.js"));
import { Icon } from 'antd-mobile';

function App () {
    return (
        <Router basename="/entry_task">
            <Suspense fallback={<Icon type={'loading'} className="app_loading" />}>
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/home" component={Home}></Route>
                    <Route path="/detail" component={Detail}></Route>
                    <Route path="/me" component={Me}></Route>
                    <Route path="/" component={Login}></Route>
                </Switch>
            </Suspense>
        </Router>
    );
}

export default App;