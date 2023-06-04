using Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class BatchHistory
    {
        [Key]
        public int? Id { get; set; }
        [Required(ErrorMessage = "BatchId is required")]
        public int? BatchId { get; set; }
        public Batch Batch { get; set; }
        [Required(ErrorMessage = "Quantity is required")]
        [Range(-int.MaxValue, int.MaxValue, ErrorMessage = "Quantity must be a positive number.")]
        public int Quantity { get; set; }
        [Required(AllowEmptyStrings = false)]
        public DateTime? Date { get; set; }
        [Required(ErrorMessage = "Type is required")]
        public EHistoryType Type { get; set; }
        [StringLength(250, ErrorMessage = "Comment must not exceed 250 characters")]
        public string Comment { get; set; }

        public BatchHistory(int? batchId, int quantity, DateTime? date, EHistoryType type, string comment)
        {
            BatchId = batchId;
            Quantity = quantity;
            Date = date;
            Type = type;
            Comment = comment;
        }

        public BatchHistory(int? id, int? batchId, int quantity, DateTime? date, EHistoryType type, string comment)
        {
            Id = id;
            BatchId = batchId;
            Quantity = quantity;
            Date = date;
            Type = type;
            Comment = comment;
        }
    }
}
