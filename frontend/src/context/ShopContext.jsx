import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const deliveryCharges = 0;

  // State management
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem("selectedCurrency") || "INR"
  );
  const [currencyRates, setCurrencyRates] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(false);

  // Memoized currency conversion function
  const formatPrice = useCallback(
    (priceInINR) => {
      if (!priceInINR) return "";
      const exchangeRate = currencyRates[selectedCurrency] || 1;
      const convertedPrice = priceInINR * exchangeRate;

      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: selectedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedPrice);
    },
    [selectedCurrency, currencyRates]
  );

  // Fetch currency rates with error handling
  const fetchConversionRates = useCallback(async () => {
      setCurrencyRates({
        INR: 1,
        USD: 0.012,
        EUR: 0.011,
        GBP: 0.0095,
      });
  }, []);

  // Fetch products with loading state
  const getProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data?.success) {
        setProducts(
          res.data.products.map((product) => ({
            ...product,
            priceInINR: product.price, // Store original price
          }))
        );
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      toast.error("Error fetching products");
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  // Handle currency change
  const handleCurrencyChange = useCallback((newCurrency) => {
    setSelectedCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
  }, []);

  // Cart operations
  const addToCart = useCallback(
    async (itemId) => {
      const newCartItems = { ...cartItems };
      newCartItems[itemId] = (newCartItems[itemId] || 0) + 1;
      setCartItems(newCartItems);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/cart/add`,
            { itemId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error("Add to cart error:", error);
          toast.error("Failed to add item to cart.");
          // Revert on error
          setCartItems(cartItems);
        }
      }
    },
    [cartItems, token, backendUrl]
  );

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      const newCartItems = { ...cartItems };
      if (quantity <= 0) {
        delete newCartItems[itemId];
      } else {
        newCartItems[itemId] = quantity;
      }
      setCartItems(newCartItems);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/cart/update`,
            { itemId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error("Update cart error:", error);
          toast.error("Failed to update item quantity.");
          setCartItems(cartItems);
        }
      }
    },
    [cartItems, token, backendUrl]
  );

  const getCartCount = useCallback(() => {
    return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  }, [cartItems]);

  const getCartAmount = useCallback(() => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const product = products.find((p) => p._id === itemId);
      return total + (product?.price || 0) * quantity;
    }, 0);
  }, [cartItems, products]);

  // Fetch user cart
  const getUserCart = useCallback(
    async (userToken) => {
      try {
        const resp = await axios.post(
          `${backendUrl}/api/cart/get`,
          {},
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        if (resp.data?.success) {
          setCartItems(resp.data.cartData || {});
        }
      } catch (error) {
        console.error("Get cart error:", error);
        toast.error("Failed to fetch cart.");
      }
    },
    [backendUrl]
  );

  // Effects
  useEffect(() => {
    fetchConversionRates();
    const interval = setInterval(fetchConversionRates, 3600000); // Refresh hourly
    return () => clearInterval(interval);
  }, [fetchConversionRates]);

  useEffect(() => {
    if (token) {
      getUserCart(token);
      getProducts();
    }
  }, [token, getUserCart, getProducts]);

  // Context value
  const value = {
    navigate,
    backendUrl,
    selectedCurrency,
    currencyRates,
    cartItems,
    products,
    token,
    deliveryCharges,
    isLoading,
    setToken: (newToken) => {
      setToken(newToken);
      localStorage.setItem("token", newToken);
    },
    addToCart,
    getCartCount,
    updateQuantity,
    setCartItems,
    getCartAmount,
    handleCurrencyChange,
    formatPrice,
    clearCart: () => setCartItems({}),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;