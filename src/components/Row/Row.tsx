import React, { useMemo } from 'react'
import  './Row.css'
import { useAppSelector } from '../../redux/hooks';

// row__ballast - чтобы для row работал min-height

const Row: React.FC = () => {
  const { rowHeight } = useAppSelector((state) => state.rows);

  const style = useMemo(
    () => ({ height: rowHeight }), 
    [ rowHeight ] 
  );

  return (
    <tr className="Row" style={ style }>
      <td>
        <div className='row__ballast' />
      </td>
    </tr>
  );
};


export default Row;