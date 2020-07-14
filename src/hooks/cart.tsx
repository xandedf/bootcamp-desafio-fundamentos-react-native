import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

export interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const cartProducts = await AsyncStorage.getItem(
        '@GoMarketplace:cart:products',
      );

      if (cartProducts) {
        setProducts(JSON.parse(cartProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const addProduct = {
        id: product.id,
        title: product.title,
        image_url: product.image_url,
        price: product.price,
        quantity: 1,
      };

      const indexProduct = products.findIndex(
        productCart => productCart.id === product.id,
      );

      if (indexProduct >= 0) {
        addProduct.quantity = products[indexProduct].quantity + 1;
        products.splice(indexProduct, 1);
      }

      setProducts([...products, addProduct]);

      await AsyncStorage.setItem(
        '@GoMarketplace:cart:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const indexProduct = products.findIndex(product => product.id === id);

      products[indexProduct].quantity += 1;

      setProducts([...products]);

      await AsyncStorage.setItem(
        '@GoMarketplace:cart:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const indexProduct = products.findIndex(product => product.id === id);

      products[indexProduct].quantity -= 1;
      if (products[indexProduct].quantity === 0) {
        products.splice(indexProduct, 1);
      }

      setProducts([...products]);

      await AsyncStorage.setItem(
        '@GoMarketplace:cart:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
