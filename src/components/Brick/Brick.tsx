import React, { useState, useMemo, useEffect } from 'react'
import './Brick.css'
// import { useAppSelector } from '../../redux/hooks';


const Brick: React.FC<{ offsetX: number}> = (props, ref) => {
  const { offsetX } = props 
  // const { columnCoords, rowCoords } = useAppSelector((state) => state.coords);

  const [ x, setX ] = useState(offsetX);

  useEffect(
    () => {
      setX(offsetX)
    }, [ offsetX ]
  )

  return (
    <div 
      className='Brick' 
      draggable
      style={{ transform: `translate3d(${x}px, 0px, 0px)` }
    }
    ref={ ref }
    ></div>
  );
};


export default React.forwardRef(
  Brick as React.ForwardRefRenderFunction<unknown, {}>
);