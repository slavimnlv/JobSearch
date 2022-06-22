using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implementations
{
    public abstract class BaseRepository<T> where T : BaseEntity
    {
        protected readonly ProjectContext _context;
        public BaseRepository(ProjectContext context)
        {
            _context = context;
        }

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Set<T>().FindAsync(id);

            if (entity != null)
            {
                _context.Set<T>().Remove(entity);
                await _context.SaveChangesAsync();
            }

        }

        public async Task<T> GetByIdAsync(int id)
        {
            var entity =  await _context.Set<T>().FindAsync(id);
            return entity!;
        }

        public async Task<IEnumerable<T>> GetPaginatedAsync(int page, int size, Expression<Func<T, bool>> filter = null!)
        {
            if (filter != null)
                return await _context.Set<T>().Where(filter).OrderBy(entity => entity.Id).Skip((page - 1) * size).Take(size).ToListAsync();
            else
                return await _context.Set<T>().Skip((page - 1) * size).Take(size).ToListAsync();

        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

    }
}
