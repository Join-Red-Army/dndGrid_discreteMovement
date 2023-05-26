import React, { useRef, useMemo, useEffect } from 'react'
import { useAppDispatch } from '../../redux/hooks';
import { useAppSelector } from '../../redux/hooks';
import './Grid.css'

// actions
import { writeCoords } from '../../redux/slices/coordsSlice';
import { setCoords } from '../../redux/slices/bricksSlice';

// components
import ColumnsWrapper from '../ColumnsWrapper';
import RowsWrapper from '../RowsWrapper';
import Brick from '../Brick';

// libs
import { getCorrespondingOffset } from '../../libs/getCorrespondingOffset';


const Grid = () => {
  const { columnCount, columnWidth } = useAppSelector(state => state.columns);
  const { rowCount, rowHeight } = useAppSelector(state => state.rows);
  const { columnCoords, rowCoords } = useAppSelector(state => state.coords);
  // const brickIds = useAppSelector((state) => state.bricks.map((el) => el.id as number));
  const brickIds = useAppSelector((state) => state.bricks.map((el) => el.id as number).join('_'));
  const dispatch = useAppDispatch();

  const columnsWrapperRef = useRef<HTMLElement>(null);
  const rowsWrapperRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const columnElements = useRef<HTMLElement[] | null>(null);

  // ссылка на перетягиваемый элемент и его копию
  const brickRef = useRef<HTMLDivElement | null>(null);
  const dndClone = useRef<HTMLDivElement | null>(null);

  // предыдущие координаты курсора
  const prevClientX = useRef<number | null>(null);
  const prevClientY = useRef<number | null>(null);

  // предыдущие координаты для позиционирования копии
  const prevColumnCoord = useRef(0);
  const prevRowCoord = useRef(0);
  
  // поправка на размеры перетягиваемого элемента
  const shiftX = useRef(0);
  const shiftY = useRef(0);

  // находится ли в таблице перетягиваемый элемент
  const isInGrid = useRef(false);


  const style = useMemo(
    () => ({
      width: columnCount * columnWidth + 1,  // +1 - это поправка на border
      height: rowCount * rowHeight + 1, 
    }), [ columnCount, rowCount, columnWidth, rowHeight ]
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


  const showOriginalBrick = (e: DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.visibility = 'visible';
    dndClone.current!.remove();
    dndClone.current = null;
    isInGrid.current = false;
  };

  const onDocumentDragOver = (e: DragEvent) => {
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

  
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // реагировать только на перетягивание элементов .Brick 
    const dragTarget = e.target as HTMLDivElement;
    if (!dragTarget.classList.contains('Brick')) return; 

    // сохранить ссылку на перетягиваемый .Brick
    brickRef.current = dragTarget;

    // Сделать копию, которая будет следовать за курсором
    dndClone.current = dragTarget.cloneNode(true) as HTMLDivElement;
    dndClone.current.style.pointerEvents = 'none';
    dndClone.current.draggable = false;

    // сделать поправку на точку клика по элементу .Brick
    const dragTargetRect = dragTarget.getBoundingClientRect();
    shiftX.current = e.clientX - dragTargetRect.left;
    shiftY.current = e.clientY - dragTargetRect.top;

    // скрыть дефолтную копию dnd
    const fakeImg = document.createElement('img');
    fakeImg.src = '';
    fakeImg.alt = '';
    fakeImg.style.opacity = '0'; 
    e.dataTransfer.setDragImage(fakeImg, 0, 0);

    // Скрыть оригинальный Brick
    setTimeout(() => dragTarget.style.visibility = 'hidden', 20);
  }


  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dndClone.current || !gridRef.current) return;
    
    // не давать Document перехватить событие
    e.stopPropagation();
    e.preventDefault();

    // если курсор зашёл в сетку
    if (!isInGrid.current) {
      gridRef.current.append(dndClone.current);
      isInGrid.current = true;
      dndClone.current.style.position = 'absolute';
      prevClientX.current = null;
      prevClientY.current = null;
    }

    // поправка на отступ .Grid относительно окна
    const gridRect = gridRef.current.getBoundingClientRect();
    const gridOffsetLeft = gridRect.left;
    const gridOffsetTop = gridRect.top;

    // получить координаты курсора внутри .Grid
    const gridX = e.clientX - gridOffsetLeft;
    const gridY = e.clientY - gridOffsetTop;

    // копия перетягиваемого объекта перемещается внутри таблицы дискретно:
    // шагами размером в ширину колонки или высоту ряда 
    const discreteX = gridX - (gridX % columnWidth);
    const discreteY = gridY - (gridY % rowHeight);

    // проверить, ушёл ли курсор из прошлого ряда или колонки
    const isCursorInSameColumn = prevClientX.current === discreteX;
    const isCursorInSameRow = prevClientY.current === discreteY;

    // если курсор стоит на месте - ничего не делать
    if (isCursorInSameColumn && isCursorInSameRow) return;

    // простой способ получения координат для позиционирования dnd-копии
    let columnCoord = discreteX - shiftX.current + (shiftX.current % columnWidth);
    if (columnCoord < 0) columnCoord = 0;
    let rowCoord = discreteY;

    if (!isCursorInSameColumn) prevColumnCoord.current = columnCoord;
    if (!isCursorInSameRow) prevRowCoord.current = discreteY;

    // спозиционировать копию по полученным координатам 
    dndClone.current.style.transform = `translate3d(${columnCoord}px, ${rowCoord}px, 0px)`;

    // Есть сложный способ: получить координаты с помощью функции getCorrespondingOffset.
    // Функция обойдёт массивы columnCoords rowCoords и найдёт координаты колонки и ряда, над которыми находится корсор.
    // См. предыдущий коммит.
  };


  const onDrop = () => {
    if (!brickRef.current) return;
    // было: brickRef.current.style.transform = `translate3d(${prevColumnCoord.current}px, ${prevRowCoord.current}px, 0px)`;
    dispatch(setCoords({
      id: Number(brickRef.current.dataset.id),
      coordX: prevColumnCoord.current,
      coordY: prevRowCoord.current
    }));
  }


  const brickElements = useMemo(
    () => brickIds.split('_').map((id) => <Brick id={ Number(id) } />), 
    [  ]
  );


  // const brickElements = useMemo(
  //   () => brickIds.map((id) => <Brick id={ id } />), 
  //   []
  // );


  return (
    <div 
      className='Grid' 
      ref={ gridRef } 
      style={ style }
      onDragOver={ onDragOver }
      onDragStart={ onDragStart }
      onDrop={ onDrop }
    >
      {/* <Brick ref={ brickRef } /> */}
      {/* <Brick /> */}
      { brickElements }
      <ColumnsWrapper ref={ columnsWrapperRef } />
      <RowsWrapper ref={ rowsWrapperRef }/>
    </div>
  );
};


export default Grid;