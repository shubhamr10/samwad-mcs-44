import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { useEffect} from 'react';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth.action';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

if(localStorage.token){
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
          <Navbar/>
          <Route exact path="/" component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </section>
        </Router>
      </div>
  </Provider>
)}
export default App;
