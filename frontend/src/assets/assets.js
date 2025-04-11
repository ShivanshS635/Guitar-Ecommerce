import logo from './logo.png';
import hero from './img2.jpg';
import profilelogo from './profile-logo.png';
import cartlogo from './shopping-cart.png';
import menu from './menu.png';
import dropdown from './dropdown.png';
import Body1 from './1Body1.jpg';
import Body11 from './1Body2.jpg';
import Body12 from './1Body3.jpg';
import Body2 from './2Body2.jpg';
import Inlay1 from './1Inlay1.jpg';
import Inlay2 from './2Inlay1.jpg';
import Neck1 from './1Neck1.jpg';
import Neck2 from './2Neck1.jpg';
import Star from './starLogo.png';
import halfStar from './halfStarLogo.png';
import emptyStar from './emptyStarLogo.png';
import bin from './bin.png';
import paypal from './paypal_logo.png';
import stripe from './stripe_logo.png';
import razorpay from './razorpay-icon.png';
import about from './img1.jpg';
import contact from './contact.png'
import empty_cart from './empty_cart.png'
import checkIcon from './checkIcon.png'

export const assets = {
    hero: hero,
    logo: logo,
    profileLogo: profilelogo,
    cartLogo: cartlogo,
    menu: menu,
    dropdown: dropdown,
    star: Star,
    halfStar: halfStar,
    emptyStar: emptyStar,
    bin: bin,
    paypal: paypal,
    stripe: stripe,
    razorpay: razorpay,
    about: about,
    contact: contact,
    empty_cart: empty_cart,
    checkIcon: checkIcon
};

export const products = [
    {
        _id : "1",
        img : [Body1 , Body11 , Body12],
        name : "Body1",
        category : "Body",
        price : 139,
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
        _id : "2",
        img : [Body2],
        name : "Body2",
        category : "Body",
        price : 100,
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },{
        _id : "3",
        img : [Inlay1],
        name : "Inlay1",
        category : "Inlay",
        price : 49,
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },{
        _id : "4",
        img : [Inlay2],
        name : "Inlay2",
        category : "Inlay",
        price : 39,
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },{
        _id : "5",
        img : [Neck1],
        name : "Neck1",
        category : "Neck",
        price : 100,
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },{
        _id : "6",
        img : [Neck2],
        name : "Neck2",
        category : "Neck",
        price : 129,
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
]