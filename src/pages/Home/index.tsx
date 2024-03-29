import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  stock: [];
}

interface ProductFormatted extends Product {
  quantity: any;
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = Number(product.quantity)
    return sumAmount
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/products');
      console.log('res', response)
      const productsFormated = response.data.content.map(function(product: Product){
        return {...product, price: formatPrice(product.price)}
      })
      setProducts(productsFormated)

    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
        <img src={product.imageURL} alt={product.name} />
        <strong>{product.name}</strong>
        <strong>{product.description}</strong>
        <span>{product.price}</span>
        <span>{product.quantity} Unidades em estoque</span>
        <button
          type="button"
          data-testid="add-product-button"
          onClick={() => handleAddProduct(product.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {cartItemsAmount[product.id] || 0}
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
      ))}
    </ProductList>
  );
};

export default Home;
