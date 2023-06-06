using Core.Models;

namespace Core.Interfaces
{
    public interface IProductService
    {
        Task<IQueryable<Product>> GetProductsAsync();
        Task<Product> AddOrUpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(int productId);
    }
}
