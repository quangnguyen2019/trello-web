import Card from 'components/Card/Card';
import { Container, Draggable } from 'react-smooth-dnd';

import { mapOrder } from 'utilities/sorts';
import './Column.scss';

export default function Column({ columns }) {
    const cards = mapOrder(columns.cards, columns.cardOrder, 'id');

    const onCardDrop = (dropRelsult) => {
        console.log("🚀 onCardDrop ~ dropRelsult", dropRelsult)
    }

    return(
        <div className="column">
            <header className="column-drag-handle">
                { columns.title }
            </header>
            <div className="card-list">
                <Container
                    groupName="col"
                    onDrop={onCardDrop}
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
            <footer>Add another card</footer>
        </div>
    )
}