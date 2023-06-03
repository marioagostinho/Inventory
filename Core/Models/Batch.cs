using Core.Enums;
using HotChocolate;
using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class Batch
    {
        [Key]
        public int? Id { get; set; }
        [Required(ErrorMessage = "ProductId is required")]
        public int? ProductId { get; set; }
        public Product Product { get; set; }
        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be a positive number.")]
        public int Quantity { get; set; }
        [Required(ErrorMessage = "ExpirationDate is required")]
        public DateTime ExpirationDate { get; set; }
        public EBatchState? BatchState { get; set; }
        [GraphQLIgnore]
        public bool IsDeleted { get; set; }

        public Batch(int? productId, int quantity, DateTime expirationDate)
        {
            ProductId = productId;
            Quantity = quantity;
            ExpirationDate = expirationDate;
            BatchState = SetBatchState();
            IsDeleted = false;
        }

        public Batch(int? id, int? productId, int quantity, DateTime expirationDate)
        {
            Id = id;
            ProductId = productId;
            Quantity = quantity;
            ExpirationDate = expirationDate;
            BatchState = SetBatchState();
            IsDeleted = false;
        }

        public Batch(int? productId, int quantity, DateTime expirationDate, bool isDeleted)
        {
            ProductId = productId;
            Quantity = quantity;
            ExpirationDate = expirationDate;
            BatchState = SetBatchState();
            IsDeleted = isDeleted;
        }

        //TestUnit Constructor
        public Batch(int? id, int? productId, int quantity, DateTime expirationDate, bool isDeleted)
        {
            Id = id;
            ProductId = productId;
            Quantity = quantity;
            ExpirationDate = expirationDate;
            BatchState = SetBatchState();
            IsDeleted = isDeleted;
        }

        private EBatchState SetBatchState()
        {
            DateTime Now = DateTime.Today.Date;
            TimeSpan DaysDifference = ExpirationDate.Date - Now;
            int StateValue = Math.Sign(DaysDifference.Days);

            return (EBatchState)StateValue;

        }
    }
}
