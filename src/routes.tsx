import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Products from "./pages/Products";

const Routes = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/carrinho" component={Cart} />
      <Route path="/admin" component={Products} />
    </Switch>
  );
};

export default Routes;
