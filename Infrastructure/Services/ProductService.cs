using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly IDbContextFactory<InventoryDbContext> _dbContext;

        public ProductService(IDbContextFactory<InventoryDbContext> dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Product> GetProducts()
        {
            var context = _dbContext.CreateDbContext();
            context.Database.EnsureCreated();

            return context.Products
                .Where(b => !b.IsDeleted);
        }
    }
}
