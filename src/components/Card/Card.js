import './Card.scss';

export default function Card({ cardDetail }) {
    return (
        <li className="card-item">
            {   
                cardDetail.cover && 
                <span 
                    className="card-img" 
                    style={{ background: `url(${cardDetail.cover})` }}>
                </span>
            }
            <p> {cardDetail.title} </p>
        </li>
    )
}