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
        private IWebHostEnvironment _hostEnvironment;

        public ImageManager(IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
            _imagePathFolder = Path.Combine(hostEnvironment.ContentRootPath, "Images");
        }

        private bool ExistsImage(string imageName)
        {
            return File.Exists(Path.Combine(_imagePathFolder, imageName));
        }

        public void DeleteImage(string imageName)
        {
            File.Delete(Path.Combine(_imagePathFolder, imageName));
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
            DeleteImage(imageName);
            return await SaveImage(file, imagePath);
        }

        public async Task<string> UploadImage(IFormFile imageFile)
        {
            string imagePath = Path.Combine(_imagePathFolder, imageFile.FileName);

            if (ExistsImage(imageFile.FileName)) await UpdateImage(imageFile, imageFile.FileName, imagePath);
            else await SaveImage(imageFile, imagePath);

            return imageFile.FileName;
        }

        public string GetFileUrl(string imageName)
        {
            return ExistsImage(imageName) ? GenerateFileUrl(imageName) : "";
        }

        private string GenerateFileUrl(string imageName)
        {
            return Path.Combine(_imagePathFolder, imageName);
        }
    }
}
