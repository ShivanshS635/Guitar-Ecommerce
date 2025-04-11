import React, { use, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({category}) => {

    const {products} = useContext(ShopContext);
    const [related , setRelated] = useState([]);

    useEffect(() => {
        if(products.length > 0){
            let productCopy = products.slice();
            productCopy = productCopy.filter((item) => item.category === category);
            setRelated(productCopy.slice(0 , 5));
        }
    },[])
  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1={'Related '} text2={'Products'}/>
        </div>
        <div className='grid grid-col-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                related.map((item , index) => (
                    <ProductItem key={index} id={item._id} img={item.img} name={item.name} price={item.price}/>
                ))
            }
        </div>
    </div>
  )
}

export default RelatedProducts