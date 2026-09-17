import axios from "axios";

const getCredentials = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error("RAZORPAY_NOT_CONFIGURED");
    return { keyId, keySecret };
};

export const createRazorpayOrder = async ({ amount, receipt, notes }) => {
    const { keyId, keySecret } = getCredentials();
    const response = await axios.post("https://api.razorpay.com/v1/orders", {
        amount,
        currency: "INR",
        receipt,
        notes,
    }, { auth: { username: keyId, password: keySecret }, timeout: 15000 });
    return response.data;
};

export const getRazorpayKeyId = () => getCredentials().keyId;
