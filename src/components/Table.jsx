import React from 'react';
import './scss/Table.scss';

const Table = ({ hNames, children }) => {
    return (
        <table className='Table'>
            <thead>
                <tr>
                    <th className='TableHeader w-10'>
                        {hNames[0]}
                    </th>
                    <th className='TableHeader w-40'>
                        {hNames[1]}
                    </th>
                    <th className='TableHeader w-20'>
                        {hNames[2]}
                    </th>
                    <th className='TableHeader w-30'>
                        {hNames[3]}
                    </th>
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    );
};

export default Table;