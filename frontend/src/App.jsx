import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Authentification from './component/authentification/authentification.jsx';
import Mainpage from './component/mainpage/mainpage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/authen" element={<Authentification />} />
        <Route path="/" element={<Mainpage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
