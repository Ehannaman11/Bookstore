using backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookstoreDbContext _context;

    public BooksController(BookstoreDbContext context) => _context = context;

    // GET api/books?pageSize=5&pageNum=1&sortOrder=asc&searchQuery=les
    [HttpGet]
    public IActionResult GetBooks(
        int pageSize = 5,
        int pageNum = 1,
        string sortOrder = "asc",
        string searchQuery = "",
        string bookCategory = "")
    {
        // Start with the full Books queryable
        var query = _context.Books.AsQueryable();

        // Filter by title if a search query was provided
        if (!string.IsNullOrWhiteSpace(searchQuery))
            query = query.Where(b => b.Title.ToLower().Contains(searchQuery.ToLower()));

        if (!string.IsNullOrWhiteSpace(bookCategory))
            query = query.Where(b => b.Category == bookCategory);    

        // Sort by Title
        query = sortOrder.ToLower() == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        // Total count (needed for pagination buttons)
        var totalNumBooks = query.Count();

        // Page the results using Skip + Take (from the video notes)
        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Return both the paged list AND the total count in one response object
        var result = new { books, totalNumBooks };
        return Ok(result);
    }

    // GET api/books/categories
    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        var categories = _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return Ok(categories);
    }

    // POST api/books/AddBook
    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        _context.Books.Add(newBook);
        _context.SaveChanges();
        return Ok(newBook);
    }

    // PUT api/books/UpdateBook/{bookId}
    [HttpPut("UpdateBook/{bookId}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = _context.Books.Find(bookId);
        if (existingBook == null) return NotFound("Book not found");

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.Isbn = updatedBook.Isbn;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        _context.Books.Update(existingBook);
        _context.SaveChanges();
        return Ok(existingBook);
    }

    // DELETE api/books/DeleteBook/{bookId}
    [HttpDelete("DeleteBook/{bookId}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _context.Books.Find(bookId);
        if (book == null) return NotFound("Book not found");

        _context.Books.Remove(book);
        _context.SaveChanges();
        return NoContent();
    }
}