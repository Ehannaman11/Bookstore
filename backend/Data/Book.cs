using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data;

public class Book
{
    [Key]
    [Column("BookID")]
    public int BookId { get; set; }

    public required string Title { get; set; }

    public required string Author { get; set; }

    public required string Publisher { get; set; }

    [Column("ISBN")]
    public required string Isbn { get; set; }

    public required string Classification { get; set; }

    public required string Category { get; set; }

    public int PageCount { get; set; }

    public decimal Price { get; set; }
}
