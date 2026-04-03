import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';


function BookList() {
  // ---------- Router hooks (must come before useState that uses location) ----------
  const navigate = useNavigate();
  const location = useLocation();

  // ---------- State ----------
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(location.state?.page ?? 1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(location.state?.category ?? '');
  const [categories, setCategories] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // ---------- Cart ----------
  const { addToCart, cartCount } = useCart();

  // ---------- Data fetching ----------
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      const url = `https://bookstore-elijah-aedehwfza8e0fsem.francecentral-01.azurewebsites.net/api/books?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}&searchQuery=${encodeURIComponent(searchQuery)}&bookCategory=${encodeURIComponent(selectedCategory)}`;
      const response = await fetch(url);
      const data = await response.json();

      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      setIsLoading(false);
    };

    fetchBooks();
  }, [pageSize, pageNum, sortOrder, searchQuery, totalItems, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('https://bookstore-elijah-aedehwfza8e0fsem.francecentral-01.azurewebsites.net/api/books/categories');
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  // ---------- Handlers ----------
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNum(1); // Reset to page 1 when page size changes (bug fix from video notes)
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPageNum(1); // Reset to page 1 on new search
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPageNum(1);
  };

  const showToast = (title: string) => {
    setToastMessage(`"${title}" added to cart!`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // ---------- Render ----------
  return (
    <div className="container mt-4 text-center">
      {/* Top bar */}
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-dark"
          onClick={() => navigate('/adminbooks')}
        >
          ⚙️ Admin
        </button>
        <button
          className="btn btn-success"
          onClick={() => navigate('/cart', { state: { page: pageNum, category: selectedCategory } })}
        >
          🛒 Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </button>
      </div>
      <h1 className="mb-4">📚 Online Bookstore</h1>

      {/* Search bar */}
      <div className="mb-3 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Sort button */}
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={toggleSort}>
          Sort by Title {sortOrder === 'asc' ? '▲ A → Z' : '▼ Z → A'}
        </button>
      </div>

      <div className="mb-3 d-flex flex-wrap justify-content-center gap-2">
        <button
          className={`btn ${selectedCategory === '' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => { setSelectedCategory(''); setPageNum(1); }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn ${selectedCategory === cat ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => { setSelectedCategory(cat); setPageNum(1); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Book cards */}
      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
          {books.map((book) => (
            <div className="col" key={book.bookId}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <ul className="list-unstyled mb-0">
                    <li>
                      <strong>Author:</strong> {book.author}
                    </li>
                    <li>
                      <strong>Publisher:</strong> {book.publisher}
                    </li>
                    <li>
                      <strong>ISBN:</strong> {book.isbn}
                    </li>
                    <li>
                      <strong>Classification:</strong> {book.classification}
                    </li>
                    <li>
                      <strong>Category:</strong> {book.category}
                    </li>
                    <li>
                      <strong>Pages:</strong> {book.pageCount}
                    </li>
                    <li>
                      <strong>Price:</strong> ${book.price.toFixed(2)}
                    </li>
                  </ul>
                  <div className="mt-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => { addToCart(book); showToast(book.title); }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination buttons */}
      <nav aria-label="Book pagination">
        <ul className="pagination justify-content-center flex-wrap">
          {/* Previous button */}
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPageNum((prev) => prev - 1)}
              disabled={pageNum === 1}
            >
              &laquo; Previous
            </button>
          </li>

          {/* Numbered page buttons */}
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index + 1}
              className={`page-item ${pageNum === index + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setPageNum(index + 1)}
                disabled={pageNum === index + 1}
              >
                {index + 1}
              </button>
            </li>
          ))}

          {/* Next button */}
          <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPageNum((prev) => prev + 1)}
              disabled={pageNum === totalPages}
            >
              Next &raquo;
            </button>
          </li>
        </ul>
      </nav>

      {/* Results per page dropdown */}
      <div className="d-flex align-items-center justify-content-center gap-2 mt-2 mb-4">
        <label htmlFor="pageSizeSelect" className="form-label mb-0">
          Results per page:
        </label>
        <select
          id="pageSizeSelect"
          className="form-select w-auto"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <span className="text-muted small">
          Showing {books.length} of {totalItems} books
        </span>
      </div>

      {/* Toast notification */}
      {toastVisible && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-4"
          role="alert"
        >
          <div className="toast-header bg-success text-white">
            <strong className="me-auto">🛒 Cart</strong>
            <button
              className="btn-close btn-close-white"
              onClick={() => setToastVisible(false)}
            />
          </div>
          <div className="toast-body">
         