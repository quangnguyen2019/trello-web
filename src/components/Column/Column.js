import Card from 'components/Card/Card';
import { mapOrder } from 'utilites/sorts';

import './Column.scss';

export default function Column({ columns }) {
    const cards = mapOrder(columns.cards, columns.cardOrder, 'id');

    return(
        <div className="column">
            <header>{ columns.title }</header>
            <ul className="card-list">
                { cards.map((card, index) => <Card cardDetail={card} key={index}/>) }
            </ul>
            <footer>Add another card</footer>
        </div>
    )
}