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
}