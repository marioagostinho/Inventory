using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class Batch
    {
        [Key]
        public int? Id { get; set; }
        public int? ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool IsDeleted { get; set; }

        public Batch(int? productId, int quantity, DateTime expirationDate, bool isDeleted)
        {
            ProductId = productId;
            Quantity = quantity;
            ExpirationDate = expirationDate;
            IsDeleted = isDeleted;
        }

        public Batch(int? id, int? productId, int quantity, DateTime expirationDate, bool isDeleted)
        {
            Id = id;
            ProductId = productId;
            Quantity = quantity;
            ExpirationDate = expirationDate;
            IsDeleted = isDeleted;
        }
    }
}
