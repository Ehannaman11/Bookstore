import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import CartPage from './components/CartPage';
import AdminBooksPage from './components/AdminBooksPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;