using Core.Models;

namespace Core.Interfaces
{
    public interface IProductService
    {
        IQueryable<Product> GetProducts();
        Task<Product> AddOrUpdateProductAsync(Product product);
    }
}
