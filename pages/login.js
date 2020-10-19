import Link from 'next/link';
import { useState } from 'react';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';

import baserUrl from '../helpers/baseUrl';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baserUrl}/api/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: res2.error, classes: 'red' })
    } else {
      console.log(res2)
      cookie.set('token', res2.token);
      cookie.set('user', res2.user);
      router.push('/account')
    }
  }

  return (
    <div className="card authcard" style={{ width: '80%' }}>
      <div className="container center-align">
        <h3>Login</h3>
        <form onSubmit={(e) => handleLogin(e)}>
          <div className="input-field col s12">
            <input id="email" type="email" className="validate"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-field col s12">
            <input id="password" type="password" className="validate"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn waves-effect waves-light #2196f3 blue" type="submit" >Login
         <i className="material-icons right">forward</i>
          </button>
          <Link href='/signup'><a><h6>Don't have an account? SignUp</h6></a></Link>
        </form>
      </div>
    </div>
  );
};
export default Login;