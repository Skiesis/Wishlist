using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using WishlistV1._1.Services;

namespace WishlistV1._1.Models
{
    public class ListItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string id { get; set; }
        public string listId { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public IFormFile image { get; set; }
        public string imageSrc { get; set; }
    }
}
