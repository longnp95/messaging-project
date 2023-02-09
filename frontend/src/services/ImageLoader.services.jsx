import Blank_Avatar from '../public/Blank-Avatar.png'
import Image from 'react-bootstrap/Image';
import { useEffect, useState } from 'react';

const ImageLoader = (props) => {
  const [imgProps, setImgProps] = useState(props);
  const handleOnLoad = (currentTarget) => {
    //setImgProps({...imgProps, src:props.src});
  }
  const handleError = (currentTarget) => {
    setImgProps({...imgProps, src:Blank_Avatar});
  }
  return (
    <Image 
      {...imgProps}
      onError={handleError}
      onLoad={handleOnLoad}
    />
  )
}

export default ImageLoader