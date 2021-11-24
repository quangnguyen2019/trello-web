import { useState, useEffect, useRef } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form } from 'react-bootstrap';
import classNames from 'classnames';

import Card from 'components/Card/Card';
import ConfirmModal from 'components/Common/ConfirmModal';

import { mapOrder } from 'utilities/sorts';
import './Column.scss';

export default function Column({ column, onCardDrop, onUpdateColumn }) {
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    const [showModal, setShowModal] = useState(false);
    const [columnTitle, setColumnTitle] = useState('');
    const [isFocus, setIsFocus] = useState(false);

    // store prev title column.
    // restore column title when input value is empty and user clicks outside input field
    const prevTitleRef = useRef(column.title);

    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title]);

    const pressEnter = (e) => {
        const inputValue = e.target.value.trim();

        if (e.key === 'Enter') {
            if (!inputValue) return;
            e.target.blur(); // => call onBlur()
        }
    }

    const onChangeTitle = (e) => {
        prevTitleRef.current = columnTitle;
        setColumnTitle(e.target.value);
    }

    const onClickTitle = (e) => {
        if (!isFocus) {
            e.target.select();
            setIsFocus(true);
        }
    }

    const onBlur = () => {
        setIsFocus(false);

        if (!columnTitle) {
            setColumnTitle(prevTitleRef.current);
            return;
        }

        const newCol = {
            ...column,
            title: columnTitle
        }
        onUpdateColumn(newCol);
    }

    const onConfirmModalAction = (type) => {
        if (type === 'remove') {
            const newCol = {
                ...column,
                _destroy: true
            }
            onUpdateColumn(newCol);
        }
        setShowModal(false);
    }

    return(
        <div className="column">
            <header className={classNames({
                "column-drag-handle": !isFocus
            })}>
                <div className="column-title"> 
                    <Form.Control 
                        type="text"
                        className="content-editable"
                        value={columnTitle}
                        onChange={onChangeTitle}
                        onClick={onClickTitle}
                        // avoid flickering when holding down mouse (onMouseDown)
                        onMouseDown={e => !isFocus && e.preventDefault()}
                        onKeyPress={pressEnter}
                        onBlur={onBlur}
                    />
                </div>
                <div className="column-dropdown-actions">
                    <Dropdown>
                        <Dropdown.Toggle className="dropdown-btn" id="dropdown-basic" size="sm" />
                        <Dropdown.Menu>
                            <Dropdown.Item>Add card...</Dropdown.Item>
                            <Dropdown.Item onClick={() => setShowModal(true)}>
                                Remove column...
                            </Dropdown.Item>
                            <Dropdown.Item>Move all cards in this list...</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            <div className="card-list">
                <Container
                    groupName="col"
                    onDrop={dropResult => onCardDrop(column.id, dropResult)}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview' 
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    { cards.map((card, index) => 
                        <Draggable key={index}>
                            <Card cardDetail={card} />
                        </Draggable>
                    )}
                </Container>
            </div>
            <footer>
                <div className="footer-actions">
                    <i className="fa fa-plus icon" /> 
                    <span> Add another card </span>
                </div>
            </footer>

            <ConfirmModal
                show={showModal}
                onAction={onConfirmModalAction}
                content={`Are you sure you want to remove "${column.title}" column?`}
            />
        </div>
    )
}