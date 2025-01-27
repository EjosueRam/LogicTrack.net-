using Microsoft.AspNetCore.Mvc;
using LogicTrack.api.Data;
using LogicTrack.api.Models;
using LogicTrack.api.DTOs;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LogicTrack.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadExcelController : ControllerBase
    {
        private readonly LogicTrackContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<UploadExcelController> _logger;

        public UploadExcelController(LogicTrackContext context, IMapper mapper, ILogger<UploadExcelController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        // GET: api/UploadExcel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HuInternalDto>>> GetHuInternal()
        {
            var huInternals = await _context.UploadFile.ToListAsync();
            var huInternalDtos = _mapper.Map<List<HuInternalDto>>(huInternals);
            return Ok(new { huInternals = huInternalDtos });
        }

        // POST: api/UploadExcel
        [HttpPost]
        public async Task<ActionResult> PostHuInternal([FromBody] List<HuInternalDto> huInternalDtos)
        {
            _logger.LogInformation($"Received HUInternals data: {huInternalDtos}");
            if (huInternalDtos == null || !huInternalDtos.Any())
            {
                return BadRequest(new { error = "Invalid data format" });
            }

            var huInternals = _mapper.Map<List<UploadFile>>(huInternalDtos);
            _context.UploadFile.AddRange(huInternals);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Data saved successfully");
            return CreatedAtAction(nameof(GetHuInternal), new { message = "HUInternals guardados con éxito" });
        }

        // PUT: api/UploadExcel
        [HttpPut]
        public async Task<ActionResult> PutHuInternal([FromBody] List<HuInternalDto> huInternalDtos)
        {
            var notFound = new List<string>();
            foreach (var huInternalDto in huInternalDtos)
            {
                var huInternal = await _context.UploadFile.FirstOrDefaultAsync(h => h.HuInternal == huInternalDto.HuInternal);
                if (huInternal == null)
                {
                    notFound.Add(huInternalDto.HuInternal);
                    continue;
                }

                huInternal.Status = huInternalDto.Status;
                _logger.LogInformation($"Updated HUInternal: {huInternal.HuInternal} to {huInternal.Status}");
            }

            await _context.SaveChangesAsync();
            var updatedHuInternals = await _context.UploadFile.ToListAsync();
            var updatedHuInternalDtos = _mapper.Map<List<HuInternalDto>>(updatedHuInternals);

            return Ok(new { huInternals = updatedHuInternalDtos, notFound });
        }
    }
}