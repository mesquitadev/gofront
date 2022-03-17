import { Link } from 'react-router-dom';
import { MdShoppingBasket } from 'react-icons/md';

import { Container, Cart } from './styles';
import { useCart } from '../../hooks/useCart';

const Header = (): JSX.Element => {
    const { cart } = useCart();
    const cartSize = cart.length;

    return (
        <Container>
            <Link to="/">
                <p>
                    <img width={100}
                    src="data:image/png;base64,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" alt=""/></p>
            </Link>

            <Cart to="/carrinho">
                <div>
                    <strong>Meu carrinho</strong>
                    <span data-testid="cart-size">
            {cartSize === 1 ? `${cartSize} item` : `${cartSize} itens`}
          </span>
                </div>
                <MdShoppingBasket size={36} color="#FFF" />
            </Cart>
        </Container>
    );
};

export default Header;
