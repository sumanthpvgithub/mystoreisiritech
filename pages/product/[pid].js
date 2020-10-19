import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import baseUrl from '../../helpers/baseUrl';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';

const Product = (props) => {
    const { product } = props;
    const modalRef = useRef(null);
    const router = useRouter();
    const cookies = parseCookies()
    const user = cookies.user ? JSON.parse(cookies.user) : '';

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        M.Modal.init(modalRef.current)
    }, [])

    const getModal = () => {
        return (
            <div id="modal1" className="modal" style={{
                width: '300px',
            }} ref={modalRef}>
                <div className="modal-content">
                    <h4>{product.name}</h4>
                    <p>Are you sure you want to delete?</p>
                    <div className="modal-footer">
                        <button className="btn waves-effect waves-light #2196f3 blue"
                            onClick={() => {
                                const instance = M.Modal.getInstance(modalRef.current)
                                instance.close();
                                return;
                            }}
                        >Cancel
                        <i className="material-icons right">cancel</i>
                        </button>
                        <button className="btn waves-effect waves-light #ff1744 red"
                            onClick={(() => deleteProduct())}
                        >Delete
                        <i className="material-icons left">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const addToCart = async () => {
        try {
            const res = await fetch(`${baseUrl}/api/cart`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": cookies.token
                },
                body: JSON.stringify({
                    quantity,
                    productId: product._id
                })
            })
            const res2 = await res.json()
            console.log(res2);
            if (res2.error) {
                M.toast({ html: error, classes: 'red' })
                cookie.remove("user");
                cookie.remove("token");
                router.push('/login');
            } else {
                M.toast({ html: res2.message, classes: 'green' })
            }
        } catch (err) {
            // res.status(500).json({error: "internal server error - getProduct"})
            console.log(err);
            console.log('error in pages/product/addToCart')
        }
    }

    const deleteProduct = async () => {
        try {
            const res = await fetch(`${baseUrl}/api/product/${product._id}`, {
                method: 'DELETE'
            })
            const res2 = await res.json()
            router.push('/')
        } catch (err) {
            // res.status(500).json({error: "internal server error - getProduct"})
            console.log(err);
            console.log('error in pages/product/deleteProduct')
        }

    }

    return (
        <div className="container center-align">
            <h3>{product.name}</h3>
            <img src={product.mediaUrl} style={{ width: '30%' }} />
            <h5>${product.price}</h5>
            <input
                type="number"
                style={{ width: "400px", margin: "10px" }}
                min={1}
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />
            {
                user
                    ?
                    <button className="btn waves-effect waves-light #2196f3 blue"
                        onClick={() => addToCart()}
                    >Add
                <i className="material-icons right">add</i>
                    </button>
                    :
                    <button className="btn waves-effect waves-light #2196f3 blue"
                        onClick={() => router.push('/login')}
                    >Login to Add
                <i className="material-icons right">add</i>
                    </button>
            }
            <p className="left-align">{product.description}</p>
            { (user.role == 'Admin' || user.role == 'Root') &&
                <button data-target="modal1" className="btn waves-effect waves-light #ff1744 red accent-3 modal-trigger" >Delete
                <i className="material-icons left">delete</i>
                </button>
            }
            {getModal()}
        </div>
    )
}

export async function getServerSideProps({ params: { pid } }) {
    try {
        const res = await fetch(`${baseUrl}/api/product/${pid}`)
        const data = await res.json()
        return {
            props: {
                product: data
            } // will be passed to the page component as props
        }
    } catch (err) {
        console.log(err, 'getServerSideProps');
    }
}

export default Product;