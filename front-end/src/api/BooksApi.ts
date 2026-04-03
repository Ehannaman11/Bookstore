import type { Book } from '../types/Book';

const apiUrl = 'https://bookstore-elijah-aedehwfza8e0fsem.francecentral-01.azurewebsites.net/api/books';

export interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

// GET — fetch a paged/filtered list of books
export async function fetchBooks(
  pageSize: number,
  pageNum: number,
  sortOrder: string,
  searchQuery: string,
  bookCategory: string
): Promise<FetchBooksResponse> {
  try {
    const url = `${apiUrl}?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}&searchQuery=${encodeURIComponent(searchQuery)}&bookCategory=${encodeURIComponent(bookCategory)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch books');
    return await response.json();
  } catch (error) {
    console.error('Error fetching books', error);
    throw error;
  }
}

// POST — add a new book
export async function addBook(newBook: Book): Promise<Book> {
  try {
    const response = await fetch(`${apiUrl}/AddBook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    if (!response.ok) throw new Error('Failed to add book');
    return await response.json();
  } catch (error) {
    console.error('Error adding a book', error);
    throw error;
  }
}

// PUT — update an existing book
export async function updateBook(bookId: number, updatedBook: Book): Promise<Book> {
  try {
    const response = await fetch(`${apiUrl}/UpdateBook/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBook),
    });
    if (!response.ok) throw new Error('Failed to update book');
    return await response.json();
  } catch (error) {
    console.error('Error updating book', error);
    throw error;
  }
}

// DELETE — delete a book by ID
export async function deleteBook(bookId: number): Promise<void> {
  try {
    const response = await fetch(`${apiUrl}/DeleteBook/${bookId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete book');
  } catch (error) {
    console.error('Error d