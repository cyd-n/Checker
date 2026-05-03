using BackEnd.Models;
using BackEnd.Reqeust;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using System.Text.RegularExpressions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchController : ControllerBase
    {
        private readonly MatchContext _context;

        public MatchController(MatchContext _ctx) { _context = _ctx; }

        // GET api/match/{gameId}
        [HttpGet("{_gameId}")]
        public async Task<IActionResult> Get(int _gameId, string _pass) {
            var match = await _context.matches.FirstOrDefaultAsync(m => m.Id == _gameId);

            if (match == null) { return NotFound(new { message = "Game not found" }); }

            if (_pass != match.Password || _pass == null) { return NotFound(new { message = "PassWord is Invalid" }); }

            return Ok(new { match.Seed});
        }

        // POST api/<MatchController>
        [HttpPost("Save")]
        public async Task<IActionResult> Save([FromBody] SaveRequest _req) {
            var match = new Matches
            {
                Seed = _req.Seed,
                Password = _req.Password
            };

            _context.matches.Add(match);
            await _context.SaveChangesAsync();

            return Ok(new { id = match.Id, _req.Seed, _req.Password });
        }
    }
}
