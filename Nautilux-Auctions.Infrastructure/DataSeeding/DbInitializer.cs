using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Nautilux_Auctions.Domain.Entities;
using Nautilux_Auctions.Domain.Enums;

namespace Nautilux_Auctions.Infrastructure.DataSeeding;

public static class DbInitializer
{
    public static async Task SeedDatabaseAsync(ApplicationDbContext context, UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        if (context.Users.Any() || context.Categories.Any())
        {
            return;
        }

        await SeedRolesAsync(roleManager);
        var users = await SeedUsersAsync(userManager);
        var categories = await SeedCategoriesAsync(context);
        await SeedListingsAsync(context, users, categories);
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>("Admin"));
        }

        if (!await roleManager.RoleExistsAsync("User"))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>("User"));
        }
    }

    private static async Task<Dictionary<string, User>> SeedUsersAsync(UserManager<User> userManager)
    {
        var users = new Dictionary<string, User>();
        
        //Admin
        if (await userManager.FindByEmailAsync("admin@nautilux.com") == null)
        {
            var adminUser = new User
            {
                UserName = "admin@nautilux.com",
                Email = "admin@nautilux.com",
                FirstName = "Admin",
                LastName = "Nautilux",
                PhoneNumber = "0888888888",
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
                users["admin"] = adminUser;
            }
        }

        if (await userManager.FindByEmailAsync("captain@nautilux.com") == null)
        {
            var sellerUser = new User
            {
                UserName = "captain@nautilux.com",
                Email = "captain@nautilux.com",
                FirstName = "Captain",
                LastName = "Morgan",
                PhoneNumber = "0888888888",
                EmailConfirmed = true,
                AvatarUrl = null
            };

            var result = await userManager.CreateAsync(sellerUser, "Seller123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(sellerUser, "User");
                users["seller"] = sellerUser;
            }
        }

        //buyer
        if (await userManager.FindByEmailAsync("collector@nautilux.com") == null)
        {
            var buyerUser = new User
            {
                UserName = "collector@nautilux.com",
                Email = "collector@nautilux.com",
                FirstName = "Marine",
                LastName = "Collector",
                PhoneNumber = "0999999999",
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(buyerUser, "Buyer123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(buyerUser, "User");
                users["buyer"] = buyerUser;
            }
        }

        return users;
    }

    private static async Task<Dictionary<string, Category>> SeedCategoriesAsync(ApplicationDbContext context)
    {
        var categories = new Dictionary<string, Category>();
        
        var mainCategories = new List<Category>
        {
            new Category { Name = "Nautical Antiques", Description = "Historic maritime artifacts and collectibles" },
            new Category { Name = "Maritime Art", Description = "Paintings, sculptures, and art with nautical themes" },
            new Category { Name = "Navigation Tools", Description = "Historic and modern navigational instruments" },
            new Category { Name = "Ship Models", Description = "Replica models of ships and vessels" },
            new Category { Name = "Naval Memorabilia", Description = "Military and naval collectibles and artifacts" }
        };

        await context.Categories.AddRangeAsync(mainCategories);
        await context.SaveChangesAsync();

        foreach (var category in mainCategories)
        {
            categories[category.Name] = category;
        }

        var nauticalAntiques = await context.Categories.FirstAsync(c => c.Name == "Nautical Antiques");
        var maritimeArt = await context.Categories.FirstAsync(c => c.Name == "Maritime Art");
        var navigationTools = await context.Categories.FirstAsync(c => c.Name == "Navigation Tools");
        var shipModels = await context.Categories.FirstAsync(c => c.Name == "Ship Models");

        var subcategories = new List<Category>
        {
            new Category { Name = "Ship's Wheels", Description = "Antique and decorative steering wheels", ParentCategoryId = nauticalAntiques.Id },
            new Category { Name = "Ships in Bottles", Description = "Miniature ships crafted inside glass bottles", ParentCategoryId = nauticalAntiques.Id },
            new Category { Name = "Diving Helmets", Description = "Antique diving equipment and helmets", ParentCategoryId = nauticalAntiques.Id },
            new Category { Name = "Maritime Paintings", Description = "Paintings depicting naval scenes and ships", ParentCategoryId = maritimeArt.Id },
            new Category { Name = "Scrimshaw Art", Description = "Carved whale bone and ivory artifacts", ParentCategoryId = maritimeArt.Id },
            new Category { Name = "Nautical Charts", Description = "Historic and collectible sea maps", ParentCategoryId = navigationTools.Id },
            new Category { Name = "Compasses", Description = "Vintage and antique navigational compasses", ParentCategoryId = navigationTools.Id },
            new Category { Name = "Sextants", Description = "Historic celestial navigation tools", ParentCategoryId = navigationTools.Id },
            new Category { Name = "Wooden Sailing Ships", Description = "Wooden models of classic sailing vessels", ParentCategoryId = shipModels.Id },
            new Category { Name = "Historic Warships", Description = "Models of famous naval warships", ParentCategoryId = shipModels.Id }
        };

        await context.Categories.AddRangeAsync(subcategories);
        await context.SaveChangesAsync();
        
        foreach (var subcategory in subcategories)
        {
            categories[subcategory.Name] = subcategory;
        }
        
        return categories;
    }
    
    private static async Task SeedListingsAsync(
        ApplicationDbContext context, 
        Dictionary<string, User> users, 
        Dictionary<string, Category> categories)
    {
        var seller = users["seller"];
        var today = DateTime.UtcNow;
        
        var listings = new List<Listing>
        {
            new Listing
            {
                Title = "19th Century Captain's Brass Sextant",
                Description = "Rare brass sextant from the late 19th century in excellent condition. Features original optics and detailed engraving of the maker's mark.",
                StartingPrice = 350.00M,
                ReservePrice = 500.00M,
                BuyNowPrice = 1200.00M,
                StartDate = today.AddDays(-5),
                EndDate = today.AddDays(7),
                Status = ListingStatus.Active,
                ShippingOptions = ShippingOption.Econt,
                Condition = ListingCondition.Excellent,
                CategoryId = categories["Sextants"].Id,
                SellerId = seller.Id,
                CreatedAt = today.AddDays(-5),
                UpdatedAt = today.AddDays(-5),
                Images = new List<Image>
                {
                    new Image { Url = "/images/listings/sextant1.jpg", IsPrimary = true },
                    new Image { Url = "/images/listings/sextant2.jpg", IsPrimary = false }
                }
            },
            new Listing
            {
                Title = "Antique Ship's Wheel from Clipper Ship",
                Description = "Authentic 1870s ship's wheel salvaged from a clipper ship. 36 inches in diameter with eight spokes and beautiful patina showing its age and history.",
                StartingPrice = 800.00M,
                ReservePrice = 1200.00M,
                BuyNowPrice = 2500.00M,
                StartDate = today.AddDays(-10),
                EndDate = today.AddDays(3),
                Status = ListingStatus.Active,
                ShippingOptions = ShippingOption.None,
                Condition = ListingCondition.Good,
                CategoryId = categories["Ship's Wheels"].Id,
                SellerId = seller.Id,
                CreatedAt = today.AddDays(-10),
                UpdatedAt = today.AddDays(-10),
                Images = new List<Image>
                {
                    new Image { Url = "/images/listings/wheel1.jpg", IsPrimary = true },
                    new Image { Url = "/images/listings/wheel2.jpg", IsPrimary = false }
                }
            },
            new Listing
            {
                Title = "HMS Victory Model Ship - Museum Quality",
                Description = "Handcrafted model of Admiral Nelson's HMS Victory. 1:75 scale with intricate detailing, handmade sails, and rigging. Over 500 hours of craftsmanship.",
                StartingPrice = 1200.00M,
                ReservePrice = 1800.00M,
                BuyNowPrice = 3500.00M,
                StartDate = today.AddDays(-3),
                EndDate = today.AddDays(14),
                Status = ListingStatus.Active,
                ShippingOptions = ShippingOption.Speedy,
                Condition = ListingCondition.Excellent,
                CategoryId = categories["Historic Warships"].Id,
                SellerId = seller.Id,
                CreatedAt = today.AddDays(-3),
                UpdatedAt = today.AddDays(-3),
                Images = new List<Image>
                {
                    new Image { Url = "/images/listings/victory1.jpg", IsPrimary = true },
                    new Image { Url = "/images/listings/victory2.jpg", IsPrimary = false },
                    new Image { Url = "/images/listings/victory3.jpg", IsPrimary = false }
                }
            },
            new Listing
            {
                Title = "18th Century Maritime Oil Painting",
                Description = "Original oil painting depicting naval battle scene from the 18th century. Beautifully framed in period-appropriate gilded frame. Artwork measures 24x36 inches.",
                StartingPrice = 2000.00M,
                ReservePrice = 3000.00M,
                BuyNowPrice = 5500.00M,
                StartDate = today.AddDays(-7),
                EndDate = today.AddDays(10),
                Status = ListingStatus.Active,
                ShippingOptions = ShippingOption.Econt,
                Condition = ListingCondition.Fair,
                CategoryId = categories["Maritime Paintings"].Id,
                SellerId = seller.Id,
                CreatedAt = today.AddDays(-7),
                UpdatedAt = today.AddDays(-7),
                Images = new List<Image>
                {
                    new Image { Url = "/images/listings/painting1.jpg", IsPrimary = true },
                    new Image { Url = "/images/listings/painting2.jpg", IsPrimary = false }
                }
            },
            new Listing
            {
                Title = "Rare Whaler's Scrimshaw Tooth",
                Description = "Authentic 19th century scrimshaw on sperm whale tooth. Depicts whaling scene with remarkable detail. Approximately 5 inches in length with stand included.",
                StartingPrice = 1500.00M,
                ReservePrice = 2000.00M,
                BuyNowPrice = 4000.00M,
                StartDate = today.AddDays(-15),
                EndDate = today.AddDays(1),
                Status = ListingStatus.Active,
                ShippingOptions = ShippingOption.ExpressOne,
                Condition = ListingCondition.Good,
                CategoryId = categories["Scrimshaw Art"].Id,
                SellerId = seller.Id,
                CreatedAt = today.AddDays(-15),
                UpdatedAt = today.AddDays(-15),
                Images = new List<Image>
                {
                    new Image { Url = "/images/listings/scrimshaw1.jpg", IsPrimary = true },
                    new Image { Url = "/images/listings/scrimshaw2.jpg", IsPrimary = false }
                }
            }
        };

        await context.Listings.AddRangeAsync(listings);
        await context.SaveChangesAsync();
        
        var buyer = users["buyer"];
        var admin = users["admin"];
        
        var bids = new List<Bid>
        {
            new Bid
            {
                ListingId = listings[0].Id,
                BidderId = buyer.Id,
                Amount = 400.00M,
                Timestamp = today.AddDays(-2),
                IsAutoBid = false
            },
            new Bid
            {
                ListingId = listings[0].Id,
                BidderId = admin.Id,
                Amount = 450.00M,
                Timestamp = today.AddDays(-1),
                IsAutoBid = false
            },
            new Bid
            {
                ListingId = listings[1].Id,
                BidderId = buyer.Id,
                Amount = 850.00M,
                Timestamp = today.AddDays(-8),
                IsAutoBid = false
            },
            new Bid
            {
                ListingId = listings[1].Id,
                BidderId = admin.Id,
                Amount = 900.00M,
                Timestamp = today.AddDays(-6),
                IsAutoBid = false
            },
            new Bid
            {
                ListingId = listings[1].Id,
                BidderId = buyer.Id,
                Amount = 950.00M,
                Timestamp = today.AddDays(-4),
                IsAutoBid = false
            },
            new Bid
            {
                ListingId = listings[4].Id,
                BidderId = admin.Id,
                Amount = 1600.00M,
                Timestamp = today.AddDays(-10),
                IsAutoBid = false
            }
        };

        await context.Bids.AddRangeAsync(bids);
        await context.SaveChangesAsync();
        
        var watchItems = new List<WatchListItem>
        {
            new WatchListItem
            {
                UserId = buyer.Id,
                ListingId = listings[2].Id
            },
            new WatchListItem
            {
                UserId = buyer.Id,
                ListingId = listings[3].Id
            },
            new WatchListItem
            {
                UserId = admin.Id,
                ListingId = listings[0].Id
            }
        };

        await context.WatchListItems.AddRangeAsync(watchItems);
    }
}