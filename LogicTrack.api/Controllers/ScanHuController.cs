using Microsoft.AspNetCore.Mvc;
using LogicTrack.api.Data;
using LogicTrack.api.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace LogicTrack.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScanHuController : ControllerBase
    {
        private readonly LogicTrackContext _context;

        public ScanHuController(LogicTrackContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> ScanHu([FromForm] string hu)
        {
            if (string.IsNullOrEmpty(hu))
            {
                return BadRequest(new { error = "No HU provided" });
            }

            var scanData = await _context.ScanData.FirstOrDefaultAsync(s => s.Hu == hu);
            if (scanData == null)
            {
                return NotFound(new { error = "HU not found" });
            }

            scanData.Motivo = "Apartado";
            scanData.Procedencia = "Almacen General";
            await _context.SaveChangesAsync();

            return Ok(new { message = "ScanData updated successfully" });
        }
    }
}