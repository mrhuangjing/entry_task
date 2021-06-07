import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import React, { Suspense } from 'react'
import { Icon } from 'antd-mobile'
const Login = React.lazy(() => import('./components/Login.js'))
const Home = React.lazy(() => import('./components/Home.js'))
const Detail = React.lazy(() => import('./components/Detail.js'))
const Me = React.lazy(() => import('./components/Me.js'))

function App () {
  return (
    <Router basename='/entry_task'>
      <Suspense fallback={<Icon type='loading' className='app_loading' />}>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/home' component={Home} />
          <Route path='/detail' component={Detail} />
          <Route path='/me' component={Me} />
          <Route path='/' component={Login} />
        </Switch>
      </Suspense>
    </Router>
  )
}

export default App
