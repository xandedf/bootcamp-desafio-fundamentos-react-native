import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart, Product } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

interface CartTotals {
  total: number;
  items: number;
}

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const calcTotalCart = (productsCart: Product[]): CartTotals => {
    return productsCart.reduce(
      (acc: CartTotals, product: Product): CartTotals => {
        acc.total += product.quantity * product.price;
        acc.items += product.quantity;
        return acc;
      },
      { total: 0, items: 0 },
    );
  };

  const cartTotal = useMemo(() => {
    const { total } = calcTotalCart(products);

    return formatValue(total);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const { items } = calcTotalCart(products);

    return items;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
