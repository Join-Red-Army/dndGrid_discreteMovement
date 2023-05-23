import React, { useMemo } from 'react'
import './RowsWrapper.css'
import Row from '../Row'
import { useAppSelector } from '../../redux/hooks';

const RowsWrapper: React.FC = (_, ref) => {
  const { rowCount } = useAppSelector(state => state.rows);

  const rows: JSX.Element[] = useMemo (
    () => Array(rowCount).fill(<Row />),
    [ rowCount ]
  );

  return (
    <table className='rowsWrapper' ref={ ref }>
      <tbody>
        { rows }
      </tbody>
    </table>
  );
};


export default React.forwardRef(
  RowsWrapper as React.ForwardRefRenderFunction<unknown, {}>
);