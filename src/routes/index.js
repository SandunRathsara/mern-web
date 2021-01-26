import React from 'react';
// noinspection ES6CheckImport
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Main from '../pages/Main';
import LoginPage from '../pages/login/login.page';
import ResetPassword from '../pages/reset-password/resetPassword';
import { getAuthStateFromToken } from '../store/auth_reducer';
import UserPage from '../pages/user/User';
import HomePage from '../pages/home/Home';

const PublicRoute = props => <Route {...props} />;

const PrivateRoute = ({ path, component: Component }) => {
  const loggedIn = getAuthStateFromToken();
  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <Route
      path={path}
      render={props => {
        return (
          <Main>
            <Component {...props} />
          </Main>
        );
      }}
    />
  );
};

const customHistory = createBrowserHistory({ basename: '/admin' });

class Routes extends React.Component {
  render() {
    return (
      <Router basename={'/admin'} history={customHistory}>
        <Switch>
          <PublicRoute path="/login" component={LoginPage} />
          <PublicRoute path="/reset-password" component={ResetPassword} />
          <Redirect exact from="/" to="/login" />
          <PublicRoute path="/home" component={HomePage} />
          <PrivateRoute path="/user" component={UserPage} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
