import { useEffect, useState, useRef } from 'react';
import { isEmpty } from 'lodash';
import { Container, Draggable } from 'react-smooth-dnd';
import { 
    Container as BootstrapContainer, Form, 
    Row, Col, Button
} from 'react-bootstrap';

import Column from 'components/Column/Column';
import { initialData } from 'actions/initialData';
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/drag_drop';

import './BoardContent.scss';

export default function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [isOpenNewColumnForm, setIsOpenNewColumnForm] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");

    const inputEl = useRef(null);

    useEffect(() => {
        const boardsFromDB = initialData.boards.find(boardItem => boardItem.id === 'board-1');
        if (boardsFromDB) {
            setBoard(boardsFromDB);
            setColumns(
                mapOrder(boardsFromDB.columns, boardsFromDB.columnOrder, 'id')
            );
        }
    }, [])

    useEffect(() => {
        if (inputEl.current) {
            inputEl.current.focus()
            inputEl.current.select()
        }   
    }, [isOpenNewColumnForm]);

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

    const toggleOpenNewColumnForm = () => {
        setIsOpenNewColumnForm(!isOpenNewColumnForm);
    }

    const changeNewColumnTitle = (e) => {
        setNewColumnTitle(e.target.value);
    }

    const addNewColumn = () => {
        if (!newColumnTitle) {
            inputEl.current.focus();
            return;
        }

        const newColumn = {
            id: Math.random().toString(36).substr(2,5),
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: []
        }

        const newColumns = [...columns, newColumn];

        let newBoard = {...board};
        newBoard.columnOrder = newColumns.map(col => col.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
        setNewColumnTitle("");
        setIsOpenNewColumnForm(false);
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
            <BootstrapContainer className="container-add-column">
                {
                    isOpenNewColumnForm === false ?
                    <Row>
                        <Col className="add-column" onClick={toggleOpenNewColumnForm}>
                            <i className="fa fa-plus icon-plus" /> 
                            <span> Add another column </span>
                        </Col>
                    </Row> :
                    <Row>
                        <Col className="form-add-column">
                            <Form.Control 
                                ref={inputEl} 
                                type="text" 
                                placeholder="Enter column title..." 
                                value={newColumnTitle}
                                onChange={changeNewColumnTitle}
                                onKeyPress={e => (e.key === 'Enter') && addNewColumn()}
                            />
                            <div className="actions">
                                <Button size="sm" onClick={addNewColumn}> Add Column </Button>
                                <i 
                                    className="fa fa-times icon-remove" 
                                    onClick={toggleOpenNewColumnForm} 
                                />
                            </div>
                        </Col>
                    </Row>
                }
            </BootstrapContainer>
        </div>
    )
}