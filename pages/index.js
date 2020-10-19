import Link from 'next/link';
import baseUrl from '../helpers/baseUrl';

const Home = (props) => {
  const { products } = props;
  console.log(products);

  const productList = products.map(product => {
    return (
      <div className="card pcard" key={product._id}>
        <div className="card-image">
          <img src={product.mediaUrl} />
          <span className="card-title">{product.name}</span>
        </div>
        <div className="card-content">
          <p>{product.description}</p>
        </div>
        <div className="card-content">
          <p>${product.price}</p>
        </div>
        <div className="card-action">
          <Link href={'/product/[pid]'} as={`/product/${product._id}`} ><a>View Product</a></Link>
        </div>
      </div>
    )
  })


  // const [text, setText] = useState('loading');

  // useEffect(() => {
  //   fetch('http://localhost:3000/api/test')
  //     .then(res => res.json())
  //     .then(data => {
  //       setText(data.message);
  //     })
  //     .catch(err => console.log(err));
  // }, []);
  return (
    <div className="rootcard">
      {productList}
    </div>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch(`${baseUrl}/api/products`)
  const data = await res.json();
  //console.log(data);
  return {
    props: { products: data }
  }
};

export default Home;
