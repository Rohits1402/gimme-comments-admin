import { HashRouter } from 'react-router-dom';
import Routing from './Routes/Routing';
import { StoreProvider } from './Contexts/StoreContext';
import './App.css';

function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routing />
      </HashRouter>
    </StoreProvider>
  );
}

export default App;
