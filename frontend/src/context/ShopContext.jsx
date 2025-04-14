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
    const [token , setToken] = useState('');

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData){
            if(cartData[itemId]) cartData[itemId] += 1;
            else cartData[itemId] = 1;
        }
        else{
            cartData[itemId] = {};
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

        if(token) {
            try {
                await axios.post(backendUrl + '/api/cart/add' , {itemId} , {headers : {token}})
            } catch (error) {
                console.log(error.message);
                res.json({success: false, message: error.message});
            }
        }
    }

    const getCartCount = () => {
        let count = 0;
        for(let item in cartItems){
            count += cartItems[item];
        }
        return count;
    }

    const updateQuantity = async (itemId , quantity) => {
        let cartData = structuredClone(cartItems);
        if(cartData){
            if(quantity === 0) delete cartData[itemId];
            else cartData[itemId] = quantity;
        }
        setCartItems(cartData);

        if(token){
            try {
                await axios.post(backendUrl + '/api/cart/update' , {itemId , quantity} , {headers : {token}})
            } catch (error) {
                console.log(error.message);
                res.json({success: false, message: error.message});
            }
        }
    }

    const getUserCart = async (token) => {
        try {
            const res = await axios.post(backendUrl + '/api/cart/get' , {} , {headers : {token}});
            if(res.data.success){
                setCartItems(res.data.cartData);
            }
        } catch (error) {
            console.log(error.message);
            res.json({success: false, message: error.message});
        }
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

    useEffect(() => {
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'))
        }
    })

    const value = {
        navigate,
        backendUrl,
        currency,
        deliveryCharges,
        cartItems,
        products,
        token,
        setToken,
        addToCart,
        getCartCount,
        updateQuantity,
        setCartItems,
        getCartAmount,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>

    )
}

export default ShopContextProvider;