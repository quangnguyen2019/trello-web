import Column from 'components/Column/Column';

import './BoardContent.scss';

export default function BoardContent() {
    return(
        <div className="board-content">
            <Column />            
            <Column />            
        </div>
    )
}