import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const deliveryCharges = 0;

  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem("selectedCurrency") || "INR"
  );
  const [currencyRates, setCurrencyRates] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  const fetchConversionRates = async () => {
    try {
      const res = await axios.get(
        'https://api.exchangerate.host/latest?base=INR',
        {
          timeout: 5000, // 5 second timeout
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (res.data.success) {
        setCurrencyRates(res.data.rates);
      } else {
        toast.error("Failed to fetch currency rates.");
        setCurrencyRates({
          INR: 1,
          USD: 0.012,
          EUR: 0.011,
          GBP: 0.0095
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching currency rates.");
      setCurrencyRates({
        INR: 1,
        USD: 0.012,
        EUR: 0.011,
        GBP: 0.0095
      });
    }
  };

  const formatPrice = (priceInINR) => {
    const exchangeRate = currencyRates[selectedCurrency] || 1;
    const convertedPrice = priceInINR * exchangeRate;
    
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/product/list");
      console.log(res.data.products)
      if (res.data.success) {
        const productsWithOriginalPrices = res.data.products.map(product => ({
          ...product,
          priceInINR: product.price
        }));
        setProducts(productsWithOriginalPrices);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error fetching products");
      console.error(error);
    }
  };

  const handleCurrencyChange = (newCurrency) => {
    setSelectedCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
  };

  useEffect(() => {
    fetchConversionRates();
    const interval = setInterval(fetchConversionRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, [token]);
  
  useEffect(() => {
    fetchConversionRates();
  }, []);
  
  useEffect(() => {
    if (Object.keys(currencyRates).length > 0) {
      getProducts();
    }
  }, [currencyRates, selectedCurrency]);
  
  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, [token]);
  
  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData) {
      if (cartData[itemId]) cartData[itemId] += 1;
      else cartData[itemId] = 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
  
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error(error.message);
        toast.error("Failed to add item to cart.");
      }
    }
  };
  
  const getCartCount = () => {
    let count = 0;
    for (let item in cartItems) {
      count += cartItems[item];
    }
    return count;
  };
  
  const updateQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (cartData) {
      if (quantity === 0) delete cartData[itemId];
      else cartData[itemId] = quantity;
    }
    setCartItems(cartData);
  
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error(error.message);
        toast.error("Failed to update item quantity.");
      }
    }
  };
  
  const getCartAmount = () => {
    let total = 0;
    for (let item in cartItems) {
      const product = products.find((product) => product._id === item);
      if (product) {
        total += product.price * cartItems[item];
      }
    }
    return total;
  };
  
  const getUserCart = async (token) => {
    try {
      const resp = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resp.data.success) {
        setCartItems(resp.data.cartData);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to fetch cart.");
    }
  };


  const value = {
    navigate,
    backendUrl,
    selectedCurrency,
    currencyRates,
    cartItems,
    products,
    token,
    deliveryCharges,
    setToken,
    addToCart,
    getCartCount,
    updateQuantity,
    setCartItems,
    getCartAmount,
    handleCurrencyChange,
    formatPrice,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;