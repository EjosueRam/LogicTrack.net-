using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LogicTrack.api.Data;
using LogicTrack.api.Models;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace LogicTrack.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class HuGeneratedController : ControllerBase
    {
        private readonly LogicTrackContext _context;

        public HuGeneratedController(LogicTrackContext context)
        {
            _context = context;
        }

        // GET: api/v1/HuGenerated
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HuGenerated>>> GetHuGenerated()
        {
            return await _context.HuGenerated.ToListAsync();
        }

        // GET: api/v1/HuGenerated/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HuGenerated>> GetHuGenerated(int id)
        {
            var huGenerated = await _context.HuGenerated.FindAsync(id);

            if (huGenerated == null)
            {
                return NotFound();
            }

            return huGenerated;
        }

        // POST: api/v1/HuGenerated
        [HttpPost]
        public async Task<ActionResult<HuGenerated>> PostHuGenerated(HuGenerated huGenerated)
        {
            _context.HuGenerated.Add(huGenerated);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHuGenerated), new { id = huGenerated.Id }, huGenerated);
        }

        // PUT: api/v1/HuGenerated/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHuGenerated(int id, HuGenerated huGenerated)
        {
            if (id != huGenerated.Id)
            {
                return BadRequest();
            }

            _context.Entry(huGenerated).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HuGeneratedExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/v1/HuGenerated/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHuGenerated(int id)
        {
            var huGenerated = await _context.HuGenerated.FindAsync(id);
            if (huGenerated == null)
            {
                return NotFound();
            }

            _context.HuGenerated.Remove(huGenerated);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HuGeneratedExists(int id)
        {
            return _context.HuGenerated.Any(e => e.Id == id);
        }
    }
}