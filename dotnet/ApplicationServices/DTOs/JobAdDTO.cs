using FinalProject.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.DTOs
{
    public  class JobAdDTO
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 10, ErrorMessage = "Minimum of 10 and maximum of 100 characters")]
        public string? Title { get; set; }
        [Required]
        [StringLength(500, MinimumLength = 50, ErrorMessage = "Minimum of 50 and maximum of 500 characters")]
        public string? Description { get; set; }
        [Required]
        public decimal Salary { get; set; }
        [Required]
        public EmplType Type { get; set; }
        [Required]
        public Category Category { get; set; }
        [Required]
        public int EmployerId { get; set; }
    }
}
