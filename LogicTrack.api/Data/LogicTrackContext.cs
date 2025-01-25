using Microsoft.AspNetCore.Identity.EntityFrameworkCore;  
using Microsoft.EntityFrameworkCore;  
using LogicTrack.api.Models;  

namespace LogicTrack.api.Data  
{  
    public class LogicTrackContext : IdentityDbContext<ApplicationUser>  
    {  
        public LogicTrackContext(DbContextOptions<LogicTrackContext> options) : base(options) { }  

        public DbSet<HuGenerated> HuGenerated { get; set; }  
        public DbSet<SalesData> SalesData { get; set; }  
        public DbSet<ScanData> ScanData { get; set; }  
        public DbSet<UploadFile> UploadFile { get; set; }  
    }  
}