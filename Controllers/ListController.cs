using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WishlistV1._1.Models;
using System.Web;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using System.Text;
using WishlistV1._1.Services;
using Microsoft.AspNetCore.Hosting;

namespace WishlistV1._1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListController : ControllerBase
    {

        private readonly ILogger<ListController> _logger;
        private readonly ListService _listService;
        private readonly IWebHostEnvironment _hostEnvironment;

        public ListController(ILogger<ListController> logger, ListService listService, IWebHostEnvironment hostEnvironment)
        {
            _logger = logger;
            _listService = listService;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_listService.Get());
        }

        [HttpPost]
        public IActionResult Insert([FromBody] List list)
        {
            _listService.Create(list);
            return Ok(_listService.Get());
        }

        [HttpPut]
        public IActionResult Update([FromBody] List list)
        {
            _listService.Update(list.id, list);
            return Ok(_listService.Get());
        }

        [HttpDelete]
        public IActionResult Delete([FromBody] string id)
        {
            _listService.Remove(id);
            return Ok(_listService.Get());
        }

        [HttpGet("{listId}/items")]
        public IActionResult GetITems([FromRoute] string listId)
        {
            return Ok(_listService.GetItems(listId));
        }

        [HttpPost("{listId}/item")]
        public async Task<IActionResult> InsertItem([FromBody] ListItem item, [FromRoute] string listId)
        {
            await _listService.CreateItem(item);
            return Ok(_listService.GetItems(listId));
        }

        [HttpPut("{listId}/item")]
        public async Task<IActionResult> UpdateItem([FromBody] ListItem item, [FromRoute] string listId)
        {
            await _listService.UpdateItem(item.id, item);
            return Ok(_listService.GetItems(listId));
        }

        [HttpDelete("{listId}/item")]
        public IActionResult DeleteItem([FromBody] string id, [FromRoute] string listId)
        {
            _listService.RemoveItem(id);
            return Ok(_listService.GetItems(listId));
        }
    }
}
