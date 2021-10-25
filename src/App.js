import './App.scss';
import AppBar from 'components/AppBar/AppBar.js';
import BoardBar from 'components/BoardBar/BoardBar.js';
import BoardContent from 'components/BoardContent/BoardContent';

function App() {
  return (
    <div className="trello-app">
      <AppBar />
      <BoardBar />
      <BoardContent />
    </div>
  );
}

export default App;