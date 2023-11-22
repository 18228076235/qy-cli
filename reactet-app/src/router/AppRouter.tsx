import React from 'react';
import Loadable from 'react-loadable';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import NGLayout from 'containers/Layout';
const Login = Loadable({
  loader: () => import('pages/Login'),
  loading: () => null
});
function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route
          exact={true}
          path="/"
          render={() => <Redirect to="/app/ModelLibrary" push={true} />}
        />
        <Route path="/app" component={NGLayout} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}
export default AppRouter;
