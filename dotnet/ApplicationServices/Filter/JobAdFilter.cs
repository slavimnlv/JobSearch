using FinalProject.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.Filter
{
    public class JobAdFilter
    {
        public int Page { get; set; }
        public Category? Category { get; set; }
        public EmplType? Type { get; set; }
    }
}
