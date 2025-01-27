using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Http;
using LogicTrack.api.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.IO;
using NPOI.HSSF.UserModel;
using System.Collections.Generic;

namespace LogicTrack.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadFileController : ControllerBase
    {
        private readonly LogicTrackContext _context;

        public UploadFileController(LogicTrackContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = "No file provided" });
            }

            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;
                    HSSFWorkbook workbook = new HSSFWorkbook(stream);
                    var sheet = workbook.GetSheet("2a REVISIONE");
                    if (sheet == null)
                        {
                            return BadRequest(new { error = "Sheet '2a REVISIONE' not found" });
                        }
                    
                        var huInternals = new List<string>();
                        for (int row = 2; row <= sheet.LastRowNum; row++)
                        {
                            var currentRow = sheet.GetRow(row);
                            if (currentRow != null)
                            {
                                var huInternal = currentRow.GetCell(0)?.ToString().Trim();
                                if (!string.IsNullOrEmpty(huInternal))
                                {
                                    huInternals.Add(huInternal);
                                    var scanData = await _context.ScanData.FirstOrDefaultAsync(s => s.Hu == huInternal);
                                    if (scanData != null)
                                    {
                                        scanData.Motivo = "apartado";
                                        scanData.Motivo = "almacen temporal ";
                                    }
                                        
                                }
                            }
                        }

                        await _context.SaveChangesAsync();
                        return Ok(new { message = "Archivo procesado con éxito", huInternals });
                    }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error processing file", details = ex.Message });
            }
        }
    }
}
