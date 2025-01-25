using System;

namespace LogicTrack.api.Models
{
    public class SalesData
    {
        public int Id { get; set; }
        public DateTime DateTime { get; set; }
        public string Sales { get; set; }
        public string HandlingUnit { get; set; }
        public string Material { get; set; }
        public string Presentation { get; set; }
        public string Coworker { get; set; }
    }
}