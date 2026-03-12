import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(
        localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
    );

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1) => {
        const itemExists = cartItems.find((x) => x._id === product._id);

        if (itemExists) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === product._id ? { ...itemExists, qty: itemExists.qty + qty } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, qty }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
    };

    const updateCartQty = (id, qty) => {
        setCartItems(
            cartItems.map((x) => (x._id === id ? { ...x, qty: Number(qty) } : x))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const cartTotalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateCartQty,
                clearCart,
                cartTotalItems,
                cartTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
