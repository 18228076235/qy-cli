import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import RouterConfig, { IRouterItem } from './RouterConfig';
export default function Routes() {
  return (
    <Router>
      <Switch>
        {RouterConfig.map((item: IRouterItem) => {
          const route = [
            <Route
              key={item.path}
              exact={true}
              path={item.path}
              component={item.component}
            />
          ];
          if (item.childs) {
            return [
              ...route,
              ...item.childs.map(child => (
                <Route
                  key={child.path}
                  exact={true}
                  path={child.path}
                  component={child.component}
                />
              ))
            ];
          }

          return route;
        })}
      </Switch>
    </Router>
  );
}
