import './Card.scss';

export default function Card({ cardDetail }) {
    return (
        <div className="card-item">
            {   
                cardDetail.cover && 
                <span 
                    className="card-img"
                    style={{ backgroundImage: `url(${cardDetail.cover})` }}>
                </span>
            }
            <p className="card-title"> {cardDetail.title} </p>
        </div>
    )
}