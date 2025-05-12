import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./src/components/Header"
import FrontPage from "./src/components/FrontPage"
import Register from "./src/components/Register"
import Login from "./src/components/Login"
import "./src/styles/index.css"




function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
