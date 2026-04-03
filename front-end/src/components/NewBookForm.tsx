import { useState } from 'react';
import type { Book } from '../types/Book';
import { addBook } from '../api/BooksApi';

interface NewBookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function NewBookForm({ onSuccess, onCancel }: NewBookFormProps) {
  const [formData, setFormData] = useState<Book>({
    bookId: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBook(formData);
      onSuccess();
    } catch {
      alert('Failed to add book. Please try again.');
    }
  };

  return (
    <div className="card mb-4 p-4 shadow-sm">
      <h2 className="mb-3">Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input className="form-control" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Author</label>
          <input className="form-control" name="author" value={formData.author} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Publisher</label>
          <input className="form-control" name="publisher" value={formData.publisher} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">ISBN</label>
          <input className="form-control" name="isbn" value={formData.isbn} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Classification</label>
          <input className="form-control" name="classification" value={formData.classification} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Category</label>
          <input className="form-control" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Page Count</label>
          <input className="form-control" type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input className="form-control" type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">Add Book</button>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default NewBookForm;
