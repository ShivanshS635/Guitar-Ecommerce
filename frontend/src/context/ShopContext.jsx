import { createContext, useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const navigate = useNavigate();

    const currency = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const deliveryCharges = 50;
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);

    const addToCart = (id) => {
        let cartData = structuredClone(cartItems);
        if(cartData){
            if(cartData[id]) cartData[id] += 1;
            else cartData[id] = 1;
        }
        else{
            cartData[id] = {};
            cartData[id] = 1;
        }
        setCartItems(cartData);
    }

    const getCartCount = () => {
        let count = 0;
        for(let item in cartItems){
            count += cartItems[item];
        }
        return count;
    }

    const updateQuantity = (id , quantity) => {
        let cartData = structuredClone(cartItems);
        if(cartData){
            if(quantity === 0) delete cartData[id];
            else cartData[id] = quantity;
        }
        setCartItems(cartData);
    }

    const getCartAmount = () => {
        let total = 0;
        for(let item in cartItems){
            const product = products.find((product) => product._id === item);
            if(product){
                total += product.price * cartItems[item];
            }
        }
        return total;
    }

    const getProducts = async () => {
        
        const res = await axios.get(backendUrl + '/api/product/list')
        if(res.data.success){
            setProducts(res.data.products);
        }
        else{
            toast.error(res.data.message);
        }
    }

    useEffect(() => {
        getProducts();
    }, [])

    useEffect(() => {
    } , [cartItems])

    const value = {
        navigate,
        backendUrl,
        currency,
        deliveryCharges,
        cartItems,
        products,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>

    )
}

export default ShopContextProvider;