using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace WishlistV1._1.Services
{
    public class ImageManager
    {
        private string _imagePathFolder;

        public ImageManager(IWebHostEnvironment hostEnvironment)
        {
            _imagePathFolder = Path.Combine(hostEnvironment.ContentRootPath, "Images");
        }

        private bool ExistsImageWithoutExtension(string imageName)
        {
            var files = Directory.GetFiles(Path.Combine(_imagePathFolder, imageName + ".*"));
            return files.Length > 0;
        }

        public void DeleteImageWithoutExtension(string imageName)
        {
            var files = Directory.GetFiles(Path.Combine(_imagePathFolder, imageName + ".*"));
            foreach (var file in files)
                File.Delete(file);
        }

        private async Task<string> SaveImage(IFormFile file, string imagePath)
        {
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return imagePath;
        }

        private async Task<string> UpdateImage(IFormFile file, string imageName, string imagePath)
        {
            DeleteImageWithoutExtension(imageName);
            return await SaveImage(file, imagePath);
        }

        public async Task<string> UploadImage(IFormFile imageFile, string itemId)
        {
            string imageName = itemId + Path.GetExtension(imageFile.FileName);
            string imagePath = Path.Combine(_imagePathFolder, imageName);

            if (ExistsImageWithoutExtension(itemId)) await UpdateImage(imageFile, itemId, imagePath);
            else await SaveImage(imageFile, imagePath);

            return imageName;
        }
    }
}
