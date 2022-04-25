using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
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
        public byte[] image { get; set; }
        public string imageName { get; set; }
    }
}
