import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import {Provider} from "react-redux"


import './App.css';
import Navbar from './components/Layout/Navbar';
import Landing from './components/Layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import store from "./store/store"
import Alert from "./components/Alert/Alert"


const App = () => {
  return (
   <Provider store = {store}>
      <Router>
        <React.Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <section className="container">
              <Alert />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </section>
          </Switch>
        </React.Fragment>
      </Router>
   </Provider>
  )
}




export default App;
