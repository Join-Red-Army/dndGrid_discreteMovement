import React, { useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react'
import ColumnsWrapper from '../ColumnsWrapper';
import RowsWrapper from '../RowsWrapper';
import Brick from '../Brick';
import './Grid.css'
import { useAppSelector } from '../../redux/hooks';



const Grid = () => {
  const { columnCount } = useAppSelector(state => state.columns);
  const { rowCount } = useAppSelector(state => state.rows);

  const style = useMemo(
    () => ({
      width: columnCount * 50,
      height: rowCount * 50, 
    }), [ columnCount, rowCount ]
  );

  return (
    <div className='Grid' style={ style }>
      <Brick />
      <ColumnsWrapper />
      <RowsWrapper />
    </div>
  );
};


export default Grid;