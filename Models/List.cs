using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
namespace WishlistV1._1.Models
{
    public class List
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string id { get; set; }
        public string name { get; set; }
    }
}
