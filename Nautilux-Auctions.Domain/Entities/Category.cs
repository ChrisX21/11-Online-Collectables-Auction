using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int? ParentCategoryId { get; set; }

    // Navigation properties
    [ForeignKey("ParentCategoryId")]
    public virtual Category? ParentCategory { get; set; }
    public virtual ICollection<Category> Subcategories { get; set; } = new List<Category>();
    public virtual ICollection<Listing> Listings { get; set; } = new List<Listing>();
}