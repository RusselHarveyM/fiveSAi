﻿namespace _5s.Model
{
    public class Space
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public List<SpaceImage> Pictures { get; set; }
        public int RoomId { get; set; }
    }
}
