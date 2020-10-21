import Link from "next/link";
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';

const NavBar = () => {
    const router = useRouter();
    const cookies = parseCookies();
    const user = cookies.user ? JSON.parse(cookies.user) : '';
    console.log(user);
    const isActive = (route) => {
        if (route == router.pathname) {
            return "active"
        } else {
            return ""
        }
    }
    return (
        <nav>
            <div className="nav-wrapper #2196f3 blue" >
                <Link href="/" className="brand-logo left"><a>MyStore</a></Link>
                <ul id="nav-mobile" className="right">

                    {(user.role == 'Admin' || user.role == 'Root') &&
                        <li className={isActive('/create')}><Link href="/create"><a>Create</a></Link></li>
                    }
                    {user ?
                        <>
                            <li className={isActive('/products')}><Link href="/products"><a>Products</a></Link></li>
                            <li className={isActive('/cart')}><Link href="/cart"><a>Cart</a></Link></li>
                            <li className={isActive('/account')}><Link href="/account"><a>Account</a></Link></li>
                            <li><button className="btn red" onClick={(e) => {
                                cookie.remove('token')
                                cookie.remove('user')
                                router.push('/login')
                            }}>Logout</button></li>
                        </>
                        :
                        <>
                            <li className={isActive('/login')}><Link href="/login"><a>Login</a></Link></li>
                            <li className={isActive('/signup')}><Link href="/signup"><a>Signup</a></Link></li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;