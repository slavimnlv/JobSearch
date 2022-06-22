using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implementations
{
    public class ApplicationRepository : BaseRepository<Application>
    {
        public ApplicationRepository(ProjectContext context) : base(context)
        {
        }

        public async Task<int> GetUserId(int id)
        {
            return await _context.Applications!.Where(u => u.Id == id).Select(u => u.UserId).FirstOrDefaultAsync();
        }

        public async Task<List<int>> GetJobAdIds(int id)
        {
            return await _context.Applications!.Where(u => u.UserId == id).Select(u => u.JobAdId).ToListAsync();
        }

        public async Task<bool> DoesApplicationExist(int id)
        {
            return await _context.Applications!.Where(u => u.Id == id).AnyAsync();
        }

        public async Task<bool> DoesApplicationExist(int userId, int jobAdId)
        {
            return await _context.Applications!.Where(u => u.UserId == userId && u.JobAdId == jobAdId).AnyAsync();
        }

        //public async Task<List<int>> GetUserIds(int jobid)
        //{
        //    return await _context.Applications!.Where(u => u.JobAdId == jobid).Select(u => u.UserId).ToListAsync();
        //}

        public async Task<List<Application>> GetApplicationsByJobId(int jobId)
        {
            return await _context.Applications!.Where(u => u.JobAdId == jobId).ToListAsync();
        }

        public async Task<Application> GetApplicationByJobAndUser(int jobid, int userid)
        {
            Application? application = await _context.Applications!.Where(u=> u.UserId == userid && u.JobAdId ==jobid).FirstOrDefaultAsync();

            return application!;
        }
    }
}
