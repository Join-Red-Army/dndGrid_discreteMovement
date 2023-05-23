import React, { useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react'
import { useAppDispatch } from '../../redux/hooks';
import { writeCoords } from '../../redux/slices/coordsSlice';
import ColumnsWrapper from '../ColumnsWrapper';
import RowsWrapper from '../RowsWrapper';
import Brick from '../Brick';
import './Grid.css'
import { useAppSelector } from '../../redux/hooks';



const Grid = () => {
  const { columnCount } = useAppSelector(state => state.columns);
  const { rowCount } = useAppSelector(state => state.rows);
  const dispatch = useAppDispatch();

  const columnsWrapperRef = useRef<HTMLElement>(null);
  const rowsWrapperRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);;

  const style = useMemo(
    () => ({
      width: columnCount * 50,
      height: rowCount * 50, 
    }), [ columnCount, rowCount ]
  );

  useEffect(
    () => {
      const columns = gridRef.current?.querySelectorAll('.Column');
      const rows = gridRef.current?.querySelectorAll('.Row');
      if (!columns?.length || !rows?.length) return;

      const columnCoords = Array.from(columns) as HTMLElement[];
      const rowCoords = Array.from(rows) as HTMLElement[];

      dispatch(
        writeCoords({
          columnCoords: columnCoords.map((col) => col.offsetLeft),
          rowCoords: rowCoords.map((row) => row.offsetTop)
        })
      );
    }, [ columnsWrapperRef, rowsWrapperRef ]
  );

  return (
    <div className='Grid' ref={ gridRef } style={ style }>
      <Brick />
      <ColumnsWrapper ref={ columnsWrapperRef } />
      <RowsWrapper ref={ rowsWrapperRef }/>
    </div>
  );
};


export default Grid;