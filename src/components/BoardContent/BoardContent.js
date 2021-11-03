import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Container, Draggable } from 'react-smooth-dnd';

import Column from 'components/Column/Column';
import { initialData } from 'actions/initialData';
import { mapOrder } from 'utilities/sorts';

import './BoardContent.scss';

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

    const onColumnDrop = (dropResult) => {
        console.log(dropResult);
    }

    if (isEmpty(board)) {
        return <div className="not-found">Board not found</div>
    }

    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                dragHandleSelector=".column-drag-handle"
                getChildPayload={index => columns[index]}
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                }}
            >
                { columns.map((col, index) => 
                    <Draggable key={index}>
                        <Column columns={col}/>
                    </Draggable>
                )}
            </Container>
        </div>
    )
}