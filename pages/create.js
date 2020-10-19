import Link from 'next/link';
import { useState } from 'react';
import baseUrl from '../helpers/baseUrl';
import { parseCookies } from 'nookies';

const Create = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [media, setMedia] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()

    const mediaUrl = await imageUpload()

    console.log(name, price, description, media)
    const res = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, description, mediaUrl })
    })
    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: res2.error, classes: "red" })
    } else {
      M.toast({ html: 'Product saved ok', classes: "green" })
    }
  }

  const imageUpload = async () => {
    const data = new FormData()
    data.append('file', media)
    data.append('upload_preset', "mystore")
    data.append('cloud_name', "isiritech")
    const res = await fetch('https://api.cloudinary.com/v1_1/isiritech/image/upload', {
      method: "POST",
      body: data
    });
    const res2 = await res.json();
    return res2.url;
  }

  return (
    <form className="container" onSubmit={(e) => handleSubmit(e)} >
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #2196f3 blue">
          <span>File</span>
          <input type="file" name="media" accept="image/*" onChange={(e) => setMedia(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <div style={{ width: '30%', height: '30%' }} >
        <img className="responsive-img" src={media ? URL.createObjectURL(media) : ''} />
      </div>
      <div className="input-field col s12">
        <textarea id="textarea1"
          className="materialize-textarea"
          value={description} onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="textarea1">Description</label>
      </div>
      <button className="btn waves-effect waves-light #2196f3 blue" type="submit" >Submit
         <i className="material-icons right">send</i>
      </button>
    </form>
  );
};


export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  const user = cookies.user ? JSON.parse(cookies.user) : ""
  if (user.role != 'Admin') {
    const { res } = ctx;
    res.writeHead(302, { location: '/' });
    res.end();
  }
  return {
    props: {}
  }
}

export default Create;
