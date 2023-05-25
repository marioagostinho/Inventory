using Core.Models;

namespace Core.Interfaces
{
    public interface IProductService
    {
        IQueryable<Product> GetProducts();
    }
}
