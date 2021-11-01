import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

import Column from 'components/Column/Column';
import { initialData } from 'actions/initialData';

import './BoardContent.scss';
import { mapOrder } from 'utilites/sorts';

export default function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const boardsFromDB = initialData.boards.find(boardItem => boardItem.id === 'board-1');
        if (boardsFromDB) {
            setBoard(boardsFromDB);
            setColumns(
                mapOrder(boardsFromDB.columns, boardsFromDB.columnOrder, 'id')
            );
        }
    }, [])

    if (isEmpty(board)) {
        return <div className="not-found">Board not found</div>
    }

    return (
        <div className="board-content">
            { columns.map((col, index) => <Column key={index} columns={col}/>)}
        </div>
    )
}