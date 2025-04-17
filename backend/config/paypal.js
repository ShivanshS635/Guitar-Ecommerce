import paypal from 'paypal-rest-sdk';
import 'dotenv/config.js';

const connectPaypal = () => {
    paypal.configure({
        "mode" : "sandbox",
        "client_id" : process.env.CLIENT_SECRET_ID,
        "client_secret" : process.env.CLIENT_SECRET_KEY
    })
    console.log("Paypal Connected Successfully")
}

export default connectPaypal;