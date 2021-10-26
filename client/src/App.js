import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';


const App = () => (
  <div className="App">
    <Router>
      <Navbar/>
      <Route exact path="/" component={Landing} />
      <section className='container'>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </section>
    </Router>
  </div>
)
export default App;
