using System;

namespace LogicTrack.api.Models
{
    public class HuGenerated
    {
        public int Id { get; set; }
        public DateTime DateTime { get; set; }
        public string HuGeneratedValue { get; set; }
        public string Hu { get; set; }
        public string Material { get; set; }
        public string Person { get; set; }
        public string Reason { get; set; }
        public string Requester { get; set; }
        public string HuByGenerated { get; set; }
    }
}