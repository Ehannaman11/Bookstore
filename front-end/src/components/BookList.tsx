import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';

function BookList() {
  // ---------- State ----------
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ---------- Data fetching ----------
  useEffect(() => {
    const fetchBooks = async () => {
      const url = `http://localhost:4000/api/books?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}&searchQuery=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      const data = await response.json();

      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortOrder, searchQuery, totalItems]);

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

  // ---------- Render ----------
  return (
    <div className="container mt-4 text-center">
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

      {/* Book cards */}
      <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
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
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}

export default BookList;
