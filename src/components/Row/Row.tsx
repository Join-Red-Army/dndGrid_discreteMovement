import React from 'react'
import  './Row.css'

// row__ballast - чтобы для row работал min-height

const Row: React.FC = () => {
  return (
    <tr className="Row">
      <td>
        <div className='row__ballast' />
      </td>
    </tr>
  );
};


export default Row;