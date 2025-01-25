using System;

namespace LogicTrack.api.Models
{
    public class ScanData
    {
        public int Id { get; set; }
        public DateTime DateHour { get; set; }
        public string Linea { get; set; }
        public string Hu { get; set; }
        public string DateHu { get; set; }
        public string Material { get; set; }
        public string Motivo { get; set; }
        public string Submotivo { get; set; }
        public string Procedencia { get; set; }
        public string Escaneo { get; set; }
        public string Comentarios { get; set; }
        public string Carril { get; set; }
        public string Colaborador { get; set; }
    }
}