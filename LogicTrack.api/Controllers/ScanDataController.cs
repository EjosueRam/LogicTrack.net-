using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LogicTrack.api.Data;
using LogicTrack.api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LogicTrack.api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ScanDataController : ControllerBase
    {
        private readonly LogicTrackContext _context;

        public ScanDataController(LogicTrackContext context)
        {
            _context = context;
        }

        // GET: api/v1/ScanData
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScanData>>> GetScanData()
        {
            return await _context.ScanData.ToListAsync();
        }

        // GET: api/v1/ScanData/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScanData>> GetScanData(int id)
        {
            var scanData = await _context.ScanData.FindAsync(id);

            if (scanData == null)
            {
                return NotFound();
            }

            return scanData;
        }

        // POST: api/v1/ScanData
        [HttpPost]
        public async Task<ActionResult<ScanData>> PostScanData(ScanData scanData)
        {
            _context.ScanData.Add(scanData);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetScanData), new { id = scanData.Id }, scanData);
        }

        // PUT: api/v1/ScanData/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScanData(int id, ScanData scanData)
        {
            if (id != scanData.Id)
            {
                return BadRequest();
            }

            _context.Entry(scanData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScanDataExists(id))
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

        // DELETE: api/v1/ScanData/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScanData(int id)
        {
            var scanData = await _context.ScanData.FindAsync(id);
            if (scanData == null)
            {
                return NotFound();
            }

            _context.ScanData.Remove(scanData);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScanDataExists(int id)
        {
            return _context.ScanData.Any(e => e.Id == id);
        }
    }
}