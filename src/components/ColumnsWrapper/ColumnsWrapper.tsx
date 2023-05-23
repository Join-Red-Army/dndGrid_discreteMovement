import React, { useMemo } from 'react'
import Column from '../Column'
import './ColumnsWrapper.css'
import { useAppSelector } from '../../redux/hooks';


const ColumnsWrapper: React.FC = (_, ref) => {
  const { columnCount } = useAppSelector((state) => state.columns);

  const columns: JSX.Element[] = useMemo (
    () => Array(columnCount).fill(<Column/>),
    [ columnCount ]
  );

  return (
    <table className='columnsWrapper' ref={ref}>
      <tbody>
        <tr>
          { columns }
        </tr>
      </tbody>
    </table>
  );
};


export default React.forwardRef(
  ColumnsWrapper as React.ForwardRefRenderFunction<unknown, {}>
);