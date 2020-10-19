import baseUrl from '../helpers/baseUrl';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';

import StripeCheckout from 'react-stripe-checkout';

const Cart = (props) => {
    const { error, products } = props;
    const router = useRouter();
    console.log('error=', error);

    const cookies = parseCookies();
    const { token } = cookies;

    const [cartProducts, setCartProducts] = useState(products);
    let totalPrice = 0;

    if (!token) {
        return (
            <div className="center-align">
                <h3>Please login to view your cart</h3>
                <button className="btn waves-effect waves-light #2196f3 blue"
                    onClick={() => router.push('/login')}
                >Login
                    <i className="material-icons right">forward</i>
                </button>
            </div>
        )
    }

    if (error) {
        M.toast({ html: error, classes: 'red' })
        cookie.remove("user");
        cookie.remove("token");
        router.push('/login');
    }
    console.log(cartProducts);

    const handleRemove = async (pid) => {
        try {
            const res = await fetch(`${baseUrl}/api/cart`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    productId: pid
                })
            })
            const res2 = await res.json();
            console.log(res2);
            setCartProducts(res2);
        } catch (err) {
            console.log(err);
        }
    }

    const CartItems = () => {

        return (
            <>
                {
                    cartProducts.map(item => {
                        totalPrice = totalPrice + item.quantity * item.product.price
                        return (
                            <div className="card" style={{ display: "flex", minWidth: '350px', width: '50%', margin: '10px auto' }} key={item._id} >
                                <div style={{ width: '80px', height: '80px', padding: '5px' }}>
                                    <img src={item.product.mediaUrl}
                                        style={{ width: '100%', height: '100%' }} />
                                </div>
                                <div style={{ margin: '10px' }}>
                                    <h6>{item.product.name}</h6>
                                    <h6>{item.quantity} x ${item.product.price}</h6>
                                </div>
                                <div style={{ margin: '10px', marginTop: '30px' }}>
                                    <button className="btn waves-effect waves-light #ff1744 red accent-3"
                                        onClick={() => handleRemove(item.product._id)}
                                    >Remove
                                         <i className="material-icons left">delete</i>
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </>
        )
    }


    const handleCheckout = async (paymentInfo) => {
        console.log(paymentInfo);
        const res = await fetch(`${baseUrl}/api/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                paymentInfo
            })
        })
        const res2 = await res.json();
        console.log(res2);
        setCartProducts([]);
    }


    const TotalPrice = () => {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'space-around', margin: '20px' }}>
                <h5>Total $ {totalPrice}</h5>
                {cartProducts.length > 0 &&
                    <StripeCheckout
                        name='MyStore'
                        amount={totalPrice * 100}
                        image={cartProducts.length > 0 ? cartProducts[0].product.mediaUrl : ''}
                        currency="AUD"
                        shippingAddress={true}
                        billingAddress={true}
                        zipCode={true}
                        stripeKey='pk_test_51HdqBoFPCr6Ht1huXynkpeD0q74UacvEdtKII5amtEjtf1oEQq7QxHPWpraqvpJ5lGePBC5IlyTRtztOGqawdgrE000fZ2C7Q8'
                        token={(paymentInfo) => handleCheckout(paymentInfo)}
                    >
                        <button className="btn waves-effect waves-light #ff1744 blue accent-3"
                        >CheckOut
                            <i className="material-icons right">forward</i>
                        </button>
                    </StripeCheckout>
                }

            </div>
        )
    }

    return (
        <div className="container">
            <CartItems />
            <TotalPrice />
        </div>
    )
}

export async function getServerSideProps(context) {
    const { token } = parseCookies(context);
    if (!token) {
        const { res } = context;
        res.writeHead(302, { location: '/login' });
        res.end();
    }
    try {
        console.log('token', token);
        const res = await fetch(`${baseUrl}/api/cart`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        })
        const cartProducts = await res.json();
        if (cartProducts.error) {
            return {
                props: { error: cartProducts.error }
            }
        }
        console.log(cartProducts);
        return {
            props: { products: cartProducts }
        }
    } catch (err) {
        console.log(err);
        return { props: { error: err } }
    }

};

export default Cart;