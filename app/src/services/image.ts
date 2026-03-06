export class ImageService {
  /**
   * Resize image to target dimensions while maintaining aspect ratio
   */
  static async resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.82
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate thumbnail from image file
   */
  static async generateThumbnail(file: File): Promise<Blob> {
    return this.resizeImage(file, 300, 300, 0.8);
  }

  /**
   * Process image for wardrobe upload (main + thumbnail)
   */
  static async processWardrobeImage(file: File): Promise<{
    main: Blob;
    thumbnail: Blob;
  }> {
    const [main, thumbnail] = await Promise.all([
      this.resizeImage(file, 800, 800, 0.82),
      this.generateThumbnail(file),
    ]);

    return { main, thumbnail };
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload a JPEG, PNG, or WebP image',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Image must be smaller than 10MB',
      };
    }

    return { valid: true };
  }
}
