import React, { useState, useMemo, useEffect } from 'react'
import './Brick.css'
import { useAppSelector } from '../../redux/hooks';


const Brick: React.FC<{ offsetX: number}> = (props, ref) => {
  const { offsetX } = props 
  const { columnCoords, rowCoords } = useAppSelector((state) => state.coords);

  const [ x, setX ] = useState(offsetX);

  // const style = useMemo(
  //   () => ({
  //     transform: `translate3d(${offsetX}, 0, 0)`
  //   }), [ offsetX ]
  // )
  // const [ cord, setCoord ] = useState({ column: 0, row: 0 });
  
  // const [ cord, setCoord ] = useState({ x: 0, y: 0 });


  // const style = useMemo(
  //   () => {
  //     return {}
  //   }, [ columnCoords, rowCoords ]
  // )

  // console.log(offsetX);
  // const onMouseDown = (ev: any) => {
  //   console.log(123);

  //   const move = (ev: any) => {
  //     console.log(ev.clientX);
  //   };

  //   const up = () => {
  //     document.removeEventListener('mousemove', move);
  //     document.removeEventListener('mouseup', up);
      
  //   }

  //   document.addEventListener('mousemove', move);
  //   document.addEventListener('mouseup', up);
  // }


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
    // onMouseDown={ onMouseDown }
    // onDragStart={(e) => e.preventDefault() }
    ></div>
  );
};


// export default Brick;


export default React.forwardRef(
  Brick as React.ForwardRefRenderFunction<unknown, {}>
);