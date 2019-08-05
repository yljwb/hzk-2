import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import City from './pages/Cit/index'
import Home from './pages/Home/index'
import Map from './pages/Map/index'
import NotFound from './pages/404'
class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/city" component={City} />
            <Route path="/map" component={Map} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
