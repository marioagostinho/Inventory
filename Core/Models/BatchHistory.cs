using Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class BatchHistory
    {
        [Key]
        public int? Id { get; set; }
        public int BatchId { get; set; }
        public Batch Batch { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
        public EHistoryType Type { get; set; }
        public string Comment { get; set; }

        public BatchHistory(int batchId, int quantity, DateTime date, EHistoryType type, string comment)
        {
            BatchId = batchId;
            Quantity = quantity;
            Date = date;
            Type = type;
            Comment = comment;
        }

        public BatchHistory(int id, int batchId, int quantity, DateTime date, EHistoryType type, string comment)
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
