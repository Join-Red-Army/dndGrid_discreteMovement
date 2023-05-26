import React, { useState, useMemo, useEffect } from 'react'
import './Brick.css'
import { useAppSelector } from '../../redux/hooks';
// import { useAppSelector } from '../../redux/hooks';


const Brick: React.FC<{ id: number}> = (props, ref) => {
  const { id } = props;
  
  const { coordX, coordY } = useAppSelector((state) => {
    const targetData = state.bricks.find(el => el.id === id);
    return targetData ?? { coordX: 0, coordY: 0 };
  });
  
  const style = useMemo(
    () => ({ transform: `translate3d(${coordX}px, ${coordY}px, 0px)` }),
    [ coordX, coordY ]
  );


  return (
    <div 
      className='Brick' 
      draggable
      style={ style }
      data-id={ id }
    ></div>
  );
};


// export default React.forwardRef(
//   Brick as React.ForwardRefRenderFunction<unknown, {}>
// );

export default Brick;