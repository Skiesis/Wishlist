using MongoDB.Driver;
using WishlistV1._1.Models;

namespace WishlistV1._1.Services
{
    public class ListService
    {
        private readonly IMongoCollection<List> _lists;
        private readonly IMongoCollection<ListItem> _listItems;

        public ListService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _lists = database.GetCollection<List>("lists");
            _listItems = database.GetCollection<ListItem>("listItems");
        }

        public List[] Get() => _lists.Find(list => true).ToList().ToArray();

        public List Get(string id) => _lists.Find(list => list.id == id).FirstOrDefault();

        public ListItem[] GetItems(string listId) => _listItems.Find(item => item.listId == listId).ToList().ToArray();

        public ListItem GetItem(string id) => _listItems.Find(item => item.id == id).FirstOrDefault();

        public List Create(List list)
        {
            _lists.InsertOne(list);
            return list;
        }

        public ListItem CreateItem(ListItem listItem)
        {
            _listItems.InsertOne(listItem);
            return listItem;
        }

        public void Update(string id, List list) => _lists.ReplaceOne(list => list.id == id, list);

        public void UpdateItem(string id, ListItem item)
        {
            _listItems.ReplaceOne(listItem => listItem.id == id, item);
        } 

        public void Remove(string id) {
            _lists.DeleteOne(list => list.id == id);
            _listItems.DeleteMany(item => item.listId == id);
        }
        public void RemoveItem(string id) => _listItems.DeleteOne(item => item.id == id);
        
    }
}
