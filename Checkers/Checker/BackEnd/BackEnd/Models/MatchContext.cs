using Microsoft.EntityFrameworkCore;

namespace BackEnd.Models{
    public class MatchContext : DbContext {
        public DbSet<Matches> matches { get; set; }

        public MatchContext(DbContextOptions<MatchContext> _options) : base(_options)
        {

        }
    }
}
