import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import { fetchBooks, deleteBook } from '../api/BooksApi';
import NewBookForm from './NewBookForm';
import EditBookForm from './EditBookForm';

function AdminBooksPage() {
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Load all books (large page size to show everything in the admin table)
  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBooks(200, 1, 'asc', '', '');
      setBooks(data.books);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (bookId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this book?');
    if (!confirmed) return;

    try {
      await deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
    } catch {
      alert('Failed to delete book. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📚 Admin — Manage Books</h1>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← Back to Store
        </button>
      </div>

      {/* Add book button / form toggle */}
      {!showAddForm && !editingBook && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Book
        </button>
      )}

      {/* Add form */}
      {showAddForm && (
        <NewBookForm
          onSuccess={() => {
            setShowAddForm(false);
            loadBooks();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit form */}
      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            loadBooks();
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      {/* Loading / error states */}
      {loading && <p>Loading books...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {/* Books table */}
      {!loading && !error && (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookId}>
                <td>{book.bookId}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingBook(book);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm w-100"
                      onClick={() => handleDelete(book.bookId)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminBooksPage;
