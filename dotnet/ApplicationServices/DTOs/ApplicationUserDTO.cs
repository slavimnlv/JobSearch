using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.DTOs
{
    public class ApplicationUserDTO
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? CoverLetter { get; set; }
        public int UserId { get; set; }
        public int ApplicationId { get; set; }
        public bool Rejected { get; set; }
        public bool Approved { get; set; }

    }
}
