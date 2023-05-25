import React, { useMemo } from 'react';
import { useAppSelector } from '../../redux/hooks';
import './Column.css'


const Column: React.FC = () => {
  const { columnWidth } = useAppSelector((state) => state.columns);

  const style = useMemo(
    () => ({ width: columnWidth }), 
    [ columnWidth ]
  );

  return (
    <td className='Column' style={ style }>
      <div className='column__ballast'></div>
    </td>
  );
};


export default Column;