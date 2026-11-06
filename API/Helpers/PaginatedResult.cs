using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PaginatedResult<T>
    {
        public PaginationMetadata Metadata { get; set; } = default!;
        public List<T> Items { get; set; } = [];

    };

    public class PaginationMetadata
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
    };

    public class PaginatonHelper {
        public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query, int pageNumber, int pageSize)
        {
            var count = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(); // At this point the request is executed

            return new PaginatedResult<T>
            {
                Metadata = new PaginationMetadata
                {
                CurrentPage =  pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize), 
                PageSize = pageSize,
                TotalCount = count
                },
                Items = items
            };   
        }
    }
}