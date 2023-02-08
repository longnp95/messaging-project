import Blank_Avatar from '../public/Blank-Avatar.png'
import Image from 'react-bootstrap/Image';
import { useState } from 'react';

const ImageLoader = (props) => {
  const [imgProps, setImgProps] = useState(props);
  const handleError = (currentTarget) => {
    setImgProps({...imgProps, src:Blank_Avatar})
  }
  return (
    <Image 
      {...imgProps}
      onError={handleError}
    />
  )
}

export default ImageLoader