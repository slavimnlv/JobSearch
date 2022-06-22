using FinalProject.Data.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities
{
    public class JobAd : BaseEntity
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal Salary { get; set; }
        public EmplType Type { get; set; }
        public Category Category { get; set; }
        public int EmployerId { get; set; }
        public User? Employer { get; set; }

    }
}
