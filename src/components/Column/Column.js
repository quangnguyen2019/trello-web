import { useState, useEffect, useRef } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form, Button } from 'react-bootstrap';
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
    const [isOpenNewCardForm, setIsOpenNewCardForm] = useState(false);
    const [contentTextarea, setContentTextarea] = useState('');

    // store prev title column.
    // restore column title when input value is empty and user clicks outside input field
    const prevTitleRef = useRef(column.title);
    const textareaRef = useRef(null);

    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [isOpenNewCardForm]);

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

    const toggleOpenNewCardForm = () => {
        setIsOpenNewCardForm(!isOpenNewCardForm);
    }

    const addNewCard = (e) => {
        if (!contentTextarea) {
            textareaRef.current.focus();
            return;
        }

        const newCard = {
            id:  Math.random().toString(36).substr(2,5),
            boardId: column.boardId,
            columnId: column.id,
            title: contentTextarea.trim(),
            cover: null
        }

        const newColumn = {
            ...column,
            cardOrder: [...column.cardOrder, newCard.id],
            cards: [...column.cards, newCard]
        };
        
        onUpdateColumn(newColumn);
        toggleOpenNewCardForm();
        setContentTextarea('')
    }

    const pressEnterTextarea = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // prevent line breaks
            addNewCard();
        }
    }

    const onBlurNewCardForm = (e) => {
        if(!e.currentTarget.contains(e.relatedTarget)) {
            toggleOpenNewCardForm();
            addNewCard();
        }
    }
    
    const closeNewCardForm = () => {
        setContentTextarea('');
        toggleOpenNewCardForm();
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
                            <Dropdown.Item onClick={toggleOpenNewCardForm}>
                                Add card...
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setShowModal(true)}>
                                Remove column...
                            </Dropdown.Item>
                            <Dropdown.Item>Move all cards in this list...</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>

            <div className={classNames('card-list',{
                'card-list-extend': isOpenNewCardForm
            })}>
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

                {
                    isOpenNewCardForm &&
                    <div 
                        className="form-add-new-card" 
                        onBlur={onBlurNewCardForm}
                    >
                        <Form.Control 
                            as="textarea" 
                            placeholder="Enter a title for this card..."
                            className="textarea"
                            ref={textareaRef}
                            value={contentTextarea}
                            onChange={e => setContentTextarea(e.target.value)}
                            onKeyPress={pressEnterTextarea}
                        />
                        <div className="actions">
                            <Button size="sm" onClick={addNewCard}> Add Card </Button>
                            <button className="btn-close-form" onClick={closeNewCardForm}>
                                <i className="fa fa-times icon-remove" /> 
                            </button>
                        </div>
                    </div>
                }
            </div>

            <footer className={classNames({ "footer-hidden": isOpenNewCardForm })}>
                {
                    !isOpenNewCardForm &&                    
                    <div className="footer-actions" onClick={toggleOpenNewCardForm}>
                        <i className="fa fa-plus icon" />
                        <span> Add another card </span>
                    </div>
                }
            </footer>

            <ConfirmModal
                show={showModal}
                onAction={onConfirmModalAction}
                content={`Are you sure you want to remove "${column.title}" column?`}
            />
        </div>
    )
}