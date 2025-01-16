import './App.css';
import './components/Appbar';
import Appbar from './components/Appbar';
import AddCategory from './components/AddCategory';
//import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import CategoriesList from './components/CategoriesList';
import Home from './components/Home';


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Appbar />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/Categories" element={<CategoriesList/>}/>
          <Route path="/products/:categoryId" element={<ProductsList/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
