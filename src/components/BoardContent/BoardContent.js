import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Container, Draggable } from 'react-smooth-dnd';

import Column from 'components/Column/Column';
import { initialData } from 'actions/initialData';
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/drag_drop';

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
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = {...board};
        newBoard.columnOrder = newColumns.map(col => col.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
    }

    const onCardDrop = (columnId, dropResult) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = [...columns]
            let currentColumn = newColumns.find(col => col.id === columnId)
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map(card => card.id)

            setColumns(newColumns);
        }
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
                        <Column column={col} onCardDrop={onCardDrop} />
                    </Draggable>
                )}
            </Container>
            <div className="add-list">
                <i class="fa fa-plus icon" /> 
                <span> Add another list </span>
            </div>
        </div>
    )
}