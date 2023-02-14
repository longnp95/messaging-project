import Blank_Avatar from '../public/Blank-Avatar.png'
import Image from 'react-bootstrap/Image';
import { useEffect, useState } from 'react';

const ImageLoader = ({src, ...props}) => {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(()=>{
    setImgSrc(src);
  },[src])
  const handleError = (currentTarget) => {
    setImgSrc(Blank_Avatar);
  }
  return (
    <Image 
      src={imgSrc||Blank_Avatar}
      {...props}
      onError={handleError}
    />
  )
}

export default ImageLoader