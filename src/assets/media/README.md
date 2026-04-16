# Media Assets Folder

This folder is a dedicated space for you to upload your pictures, videos, and other media files. 

Files placed here will **not** automatically show up on the website. They will just sit safely in your code files until you decide to use them.

## How to upload files here:
1. In the file explorer on the left side of your screen, navigate to `src` -> `assets` -> `media`.
2. Hover over the `media` folder and click the upload icon (or drag and drop your files into this folder).

## How to use these files in your code later:
When you are ready to use an image or video in your website, you can import it into your React components like this:

```tsx
// 1. Import the file at the top of your component
import myPicture from '../assets/media/my-picture.jpg';

// 2. Use it in an image tag
<img src={myPicture} alt="My uploaded picture" />
```
