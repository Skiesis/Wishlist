using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WishlistV1._1.Models;

namespace WishlistV1._1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListController : ControllerBase
    {
        private readonly ILogger<ListController> _logger;

        public ListController(ILogger<ListController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            List[] lists = Enumerable.Range(1, 5).Select(index => new List
            {
                id = index,
                name = index+"test"
            }).ToArray();

            return Ok(lists);
        }
    }
}
