using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchController : ControllerBase
    {
        private readonly MatchContext _context;

        public MatchController(MatchContext _ctx)
        {
            _context = _ctx;
        }

        // GET api/match/{gameId}
        [HttpGet("{_gameId}")]
        public async Task<IActionResult> Get(string _gameId)
        {
            var match = await _context.matches
                .FirstOrDefaultAsync(m => m.Seed == _gameId);

            if (match == null)
                return NotFound(new { message = "Game not found" });

            return Ok(match.Seed);
        }

        // POST api/<MatchController>
        [HttpPost("Save")]
        public async Task<IActionResult> Save(string _field, string _pass) {
            string gameId = _field;

            var match = new Matches
            {
                Seed = gameId,
                Password = _pass
            };

            _context.matches.Add(match);
            await _context.SaveChangesAsync();

            return Ok(new { gameId });
        }
    }
}
