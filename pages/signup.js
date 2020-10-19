import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router'
import baseUrl from '../helpers/baseUrl';

const Signup = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });
    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: res2.error, classes: 'red' })
    } else {
      M.toast({ html: res2.message, classes: 'green' })
      router.push('/login');
    }
  }

  return (
    <div className="card authcard" style={{ width: '80%' }}>
      <div className="container center-align">
        <h3>SignUp</h3>
        <form onSubmit={(e) => handleSignUp(e)}>
          <div className="input-field col s12">
            <input id="name" type="text" className="validate"
              value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="name">Name</label>
          </div>
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
          <button className="btn waves-effect waves-light #2196f3 blue" type="submit" >Signup
         <i className="material-icons right">forward</i>
          </button>
          <Link href='/login'><a><h6>Already have an account? SignIn</h6></a></Link>
        </form>
      </div>
    </div>
  );
};
export default Signup;