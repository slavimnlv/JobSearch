using System.ComponentModel.DataAnnotations;

namespace Data.Entities
{
    public class Application : BaseEntity
    {
       
        public bool Approved { get; set; }
        public bool Rejected { get; set; }
        public string? CoverLetter { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int JobAdId { get; set; }
        public JobAd? JobAd { get; set; }

    }
}
