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
    public class SalesDataController : ControllerBase
    {
        private readonly LogicTrackContext _context;

        public SalesDataController(LogicTrackContext context)
        {
            _context = context;
        }

        // GET: api/v1/SalesData
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesData>>> GetSalesData()
        {
            return await _context.SalesData.ToListAsync();
        }

        // GET: api/v1/SalesData/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesData>> GetSalesData(int id)
        {
            var salesData = await _context.SalesData.FindAsync(id);

            if (salesData == null)
            {
                return NotFound();
            }

            return salesData;
        }

        // POST: api/v1/SalesData
        [HttpPost]
        public async Task<ActionResult<SalesData>> PostSalesData(SalesData salesData)
        {
            _context.SalesData.Add(salesData);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSalesData), new { id = salesData.Id }, salesData);
        }

        // PUT: api/v1/SalesData/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSalesData(int id, SalesData salesData)
        {
            if (id != salesData.Id)
            {
                return BadRequest();
            }

            _context.Entry(salesData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesDataExists(id))
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

        // DELETE: api/v1/SalesData/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalesData(int id)
        {
            var salesData = await _context.SalesData.FindAsync(id);
            if (salesData == null)
            {
                return NotFound();
            }

            _context.SalesData.Remove(salesData);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SalesDataExists(int id)
        {
            return _context.SalesData.Any(e => e.Id == id);
        }
    }
}