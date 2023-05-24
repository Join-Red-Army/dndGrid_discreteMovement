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
  const { columnCoords, rowCoords } = useAppSelector(state => state.coords);
  const dispatch = useAppDispatch();

  const columnsWrapperRef = useRef<HTMLElement>(null);
  const rowsWrapperRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const brickRef = useRef<HTMLDivElement>(null);
  const dndClone = useRef<HTMLDivElement | null>(null);
  const columnElements = useRef<HTMLElement[] | null>(null);

  const previousGridCoordX = useRef(0);
  const previousGridCoordY = useRef(0);

  const previousColumnCoordinate = useRef(0);
  const previousRowCoordinate = useRef(0);

  const cloneStatus = useRef({
    inGrid: false 
  });

  const isInGrid = useRef(false);


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

      columnElements.current = Array.from(columns) as HTMLElement[];

      const columnCoords = columnElements.current;
      const rowCoords = Array.from(rows) as HTMLElement[];

      dispatch(
        writeCoords({
          columnCoords: columnCoords.map((col) => col.offsetLeft),
          rowCoords: rowCoords.map((row) => row.offsetTop)
        })
      );
    }, [ columnsWrapperRef, rowsWrapperRef ]
  );


  const showOriginalBrick = (e: any) => {
    e.target.style.visibility = 'visible';
    dndClone.current!.remove();
    dndClone.current = null;
    isInGrid.current = false;
  };

  const onDocumentDragOver = (e: any) => {
    // реагировать только на копию элемента .Brick
    if (!dndClone.current) return;

    // если клон только что перешёл из сетки .Grid
    if (isInGrid.current) {
      dndClone.current.style.position = 'fixed';
      isInGrid.current = false;
    }
    dndClone.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0px)`;
  }

  useEffect(
    () => {
      console.log('Document listeners added');
      document.addEventListener('dragend', showOriginalBrick);
      document.addEventListener('dragover', onDocumentDragOver);
      return () => {
        console.log('Document listeners removed');
        document.removeEventListener('dragend', showOriginalBrick);
        document.removeEventListener('dragover', onDocumentDragOver);
      }
    }, []
  );

  const onDragStart = (e: any) => {
    if (!gridRef.current) return;

    // реагировать только на перетягивание элементов .Brick 
    const dragTarget = e.target;
    if (!dragTarget.classList.contains('Brick')) return; 

    // Сделать копию, которая будет следовать за курсором
    dndClone.current = dragTarget.cloneNode(true) as HTMLDivElement;
    dndClone.current.style.pointerEvents = 'none';

    // Скрыть оригинальный Brick
    setTimeout(() => dragTarget.style.visibility = 'hidden', 0);
  }


  const getCoordPoint = (point: number, coords: number[]) => {
    const result = coords.find((num, i) => {
      // это первый колонка/ряд
      if (i === 0 && point < num ) return true;

      // это последняя колонка/ряд
      const nextNum = coords[i + 1] ?? null;
      if (nextNum === null) return true;

      // курсор находится в какой-то колонке
      return (num <= point && point < nextNum);
    });

    return result ?? 0;
  };


  const onDragOver = (e: React.DragEvent) => {
    if (!dndClone.current || !gridRef.current) return;
    
    // не давать Document перехватить событие
    e.stopPropagation();

    // в сетке?
    if (!isInGrid.current) {
      gridRef.current.append(dndClone.current);
      isInGrid.current = true;
      dndClone.current.style.position = 'absolute';
    }

    // поправка на отступ таблицы
    const gridRect = gridRef.current.getBoundingClientRect();
    const gridOffsetLeft = gridRect.left;
    const gridOffsetTop = gridRect.top;

    // получить коордитнату курсора относительно таблицы
    const gridCoordX = e.clientX - gridOffsetLeft;
    const gridCoordY = e.clientY - gridOffsetTop;
    
    // найти координаты колонки и ряда, в котором сейчас курсор
    // если курсор никуда не двигается - не высчитывать новые координаты
    let columnCoord;
    if (previousGridCoordX.current === gridCoordX) {
      columnCoord = previousColumnCoordinate.current;
    } else {
      console.log('calculate X');
      columnCoord = getCoordPoint(gridCoordX, columnCoords);
      previousGridCoordX.current = gridCoordX;
      previousColumnCoordinate.current = columnCoord;
    }
    let rowCoord;
    if (previousGridCoordY.current === gridCoordY) {
      rowCoord = previousRowCoordinate.current;
    } else {
      console.log('calculate Y');
      rowCoord = getCoordPoint(gridCoordY, rowCoords);
      previousGridCoordY.current = gridCoordY;
      previousRowCoordinate.current = rowCoord;
    }
    
    dndClone.current.style.transform = `translate3d(${columnCoord}px, ${rowCoord}px, 0px)`;
  }

  return (
    <div 
      className='Grid' 
      ref={ gridRef } 
      style={ style }
      onDragOver={ onDragOver }
      onDragStart={ onDragStart }
    >
      <Brick ref={ brickRef } />
      <ColumnsWrapper ref={ columnsWrapperRef } />
      <RowsWrapper ref={ rowsWrapperRef }/>
    </div>
  );
};


export default Grid;