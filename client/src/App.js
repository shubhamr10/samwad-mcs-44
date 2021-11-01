import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { useEffect } from 'react';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { loadUser } from './actions/auth.action';
import setAuthToken from './utils/setAuthToken';
import Routes from './components/routing/Routes';



if (localStorage.token) {
  setAuthToken(localStorage.token);
}


const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Router>
      </div>
    </Provider>
  )
}
export default App;
