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
    public class UploadFileController : ControllerBase
    {
        private readonly LogicTrackContext _context;

        public UploadFileController(LogicTrackContext context)
        {
            _context = context;
        }

        // GET: api/v1/HUInternal
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UploadFile>>> GetHuInternal()
        {
            return await _context.UploadFile.ToListAsync();
        }

        // POST: api/v1/HUInternal
        [HttpPost]
        public async Task<ActionResult> PostHuInternal([FromBody] List<UploadFile> huInternals)
        {
            if (huInternals == null || !huInternals.Any())
            {
                return BadRequest(new { error = "Invalid data format" });
            }

            _context.UploadFile.AddRange(huInternals);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHuInternal), new { message = "HUInternals guardados con éxito" });
        }

        // PUT: api/v1/HUInternal
        [HttpPut]
        public async Task<ActionResult> PutHuInternal([FromBody] List<UploadFile> huInternals)
        {
            if (huInternals == null || !huInternals.Any())
            {
                return BadRequest(new { error = "Invalid data format" });
            }

            var notFound = new List<string>();
            foreach (var huInternal in huInternals)
            {
                var hu = await _context.UploadFile.FirstOrDefaultAsync(h => h.HuInternalValue == huInternal.HuInternalValue);
                if (hu != null)
                {
                    hu.Status = huInternal.Status;
                }
                else
                {
                    notFound.Add(huInternal.HuInternalValue);
                }
            }

            await _context.SaveChangesAsync();

            var updatedHuInternals = await _context.UploadFile.ToListAsync();
            return Ok(new { huInternals = updatedHuInternals, not_found = notFound });
        }
    }
}