import { useEffect, useRef } from 'react'
import { parseCookies } from 'nookies';
import baseUrl from '../helpers/baseUrl';
import UserRoles from '../components/UserRoles';

const Account = (props) => {
    const orderCard = useRef(null);

    const cookies = parseCookies();
    const user = cookies.user ? JSON.parse(cookies.user) : '';
    const { orders } = props;

    useEffect(() => {
        M.Collapsible.init(orderCard.current)
    }, [])

    const OrdersHistory = () => {
        return (
            <ul className="collapsible" ref={orderCard}>
                {orders.map(item => {
                    return (
                        <li key={item._id}>
                            <div className="collapsible-header"><i className="material-icons">folder</i>{item.createdAt}</div>
                            <div className="collapsible-body">
                                <h5>Total ${item.total}</h5>
                                {
                                    item.products.map(pitem => {
                                        return <h5 key={pitem._id}>{pitem.product.name} x {pitem.quantity}</h5>
                                    })
                                }
                            </div>
                        </li>
                    )
                })}

            </ul>
        )
    }

    return (
        <div className="container">
            <div className="center-align white-text" style={{ backgroundColor: "#1565c0", padding: '5px', marginTop: '10px' }}>
                <h4>{user.name}</h4>
                <h4>{user.email}</h4>
            </div>
            <h3>Order History</h3>
            {orders.length == 0
                ? <div className="container center-align">
                    <h4>You have no order history !!!</h4>
                </div>
                : <OrdersHistory />
            }
            {
                user.role == 'Root' &&
                <UserRoles />
            }

        </div>
    )
}

export async function getServerSideProps(ctx) {
    const { token } = parseCookies(ctx);
    if (!token) {
        const { res } = ctx;
        res.writeHead(302, { location: '/login' });
        res.end();
    }

    const res = await fetch(`${baseUrl}/api/orders`, {
        headers: {
            "Authorization": token
        }
    })

    const res2 = await res.json();
    console.log('pages/account', res2);

    return {
        props: { orders: res2 }
    }
}

export default Account;