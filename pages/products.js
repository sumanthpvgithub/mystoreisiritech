import Link from 'next/link';
import baseUrl from '../helpers/baseUrl';
import { useState } from 'react'

const Home = (props) => {
  const [isPizzaBtnActive, setIsPizzaBtnActive] = useState(false);
  const [isSidesBtnActive, setIsSidesBtnActive] = useState(false);
  const [isDrinksBtnActive, setIsDrinksBtnActive] = useState(false);

  console.log(isPizzaBtnActive, isSidesBtnActive, isDrinksBtnActive);

  const { products } = props;
  console.log(products);

  const assignColor = (stateName) => {
    console.log(isPizzaBtnActive, isSidesBtnActive, isDrinksBtnActive);
    console.log(stateName)

    let newClass = "waves-effect waves-dark btn-large "
    if (stateName == 'Pizza') {
      if (isPizzaBtnActive) {
        newClass = newClass + 'white black-text'
      } else {
        newClass = newClass + 'grey white-text'
      }
    }
    if (stateName == 'Sides') {
      if (isSidesBtnActive) {
        newClass = newClass + 'white black-text'
      } else {
        newClass = newClass + 'grey white-text'
      }
    }
    if (stateName == 'Drinks') {
      if (isDrinksBtnActive) {
        newClass = newClass + 'white black-text'
      } else {
        newClass = newClass + 'grey white-text'
      }
    }
    return newClass;
  }

  const assignBorderColor = (stateName) => {
    console.log(isPizzaBtnActive, isSidesBtnActive, isDrinksBtnActive);
    console.log(stateName)
    let newBorderColor = '3px solid white';
    if (stateName == 'Pizza') {
      if (isPizzaBtnActive) {
        newBorderColor = '3px solid red'
      }
    }
    if (stateName == 'Sides') {
      if (isSidesBtnActive) {
        newBorderColor = '3px solid red'
      }
    }
    if (stateName == 'Drinks') {
      if (isDrinksBtnActive) {
        newBorderColor = '3px solid red'
      }
    }
    return newBorderColor;
  }

  const MyButton = (props) => {
    console.log(props)
    let newBorder = assignBorderColor(props.stateName)
    console.log(isPizzaBtnActive, isSidesBtnActive, isDrinksBtnActive);
    return (
      <a className={assignColor(props.stateName)}
        style={{ margin: '1px', border: newBorder, borderRadius: '5%' }}
        onClick={props.handleClick}
      >{props.buttonName}</a>
    )
  }

  const handleClick = (stateName) => {
    console.log(isPizzaBtnActive, isSidesBtnActive, isDrinksBtnActive);
    console.log('handleClick=', stateName);
    if (stateName == 'Pizza') {
      if (isPizzaBtnActive) {
        setIsPizzaBtnActive(false);
      }
      else {
        setIsPizzaBtnActive(true);
        setIsSidesBtnActive(false);
        setIsDrinksBtnActive(false);
      }
    }
    if (stateName == 'Sides') {
      if (isSidesBtnActive) {
        setIsSidesBtnActive(false);
      } else {
        setIsPizzaBtnActive(false);
        setIsSidesBtnActive(true);
        setIsDrinksBtnActive(false);
      }
    }
    if (stateName == 'Drinks') {
      if (isDrinksBtnActive) {
        setIsDrinksBtnActive(false);
      } else {
        setIsPizzaBtnActive(false);
        setIsSidesBtnActive(false);
        setIsDrinksBtnActive(true);
      }
    }
    console.log(stateName)
  }

  const productList = products.map(product => {
    return (
      <>

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
      </>
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
    <>
      <div className="container left" style={{ margin: '2px 2px', backgroundColor: "#494d52", border: '1px solid grey', padding: '5px' }} >
        <MyButton buttonName="Pizza"
          stateName="Pizza"
          btnColor="grey"
          textColor="white"
          margin="5px"
          btnBorderColor="white"
          handleClick={() => handleClick('Pizza')} />
        <MyButton buttonName="Sides"
          stateName="Sides"
          btnColor="white"
          textColor="black"
          margin="5px"
          btnBorderColor="red"
          handleClick={() => handleClick('Sides')} />
        <MyButton buttonName="Drinks"
          stateName="Drinks"
          btnColor="grey"
          textColor="white"
          margin="5px"
          btnBorderColor="red"
          handleClick={() => handleClick('Drinks')} />
      </div>
      <div className="container left" style={{ margin: '2px', border: '1px solid grey', padding: '5px' }} >
        <MyButton buttonName="Pizza"
          stateName="Pizza"
          btnColor="grey"
          textColor="white"
          margin="5px"
          btnBorderColor="white"
          handleClick={() => handleClick('Pizza')} />
        <MyButton buttonName="Sides"
          stateName="Sides"
          btnColor="white"
          textColor="black"
          margin="5px"
          btnBorderColor="red"
          handleClick={() => handleClick('Sides')} />
        <MyButton buttonName="Drinks"
          stateName="Drinks"
          btnColor="grey"
          textColor="white"
          margin="5px"
          btnBorderColor="red"
          handleClick={() => handleClick('Drinks')} />
      </div>
      {/* <div className="rootcard">
        {productList}
      </div> */}
    </>
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
