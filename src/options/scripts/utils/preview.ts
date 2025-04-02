const liveWallpaperPreviewEl = document.getElementById("live-wallpaper-preview") as HTMLDivElement;

export const previewWallpaper = (
  wallpaper: Blob | string | undefined,
  brightness: string,
  blur: string
) => {
  if (!wallpaper) {
    liveWallpaperPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
    return;
  }

  let src: string;
  if (wallpaper instanceof Blob) src = URL.createObjectURL(wallpaper);
  else src = wallpaper;

  const isVideo =
    (wallpaper instanceof Blob && wallpaper.type.startsWith("video/")) ||
    (typeof wallpaper === "string" && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(wallpaper));

  const mediaEl = isVideo ? document.createElement("video") : document.createElement("img");
  mediaEl.src = src;
  mediaEl.className = "w-full h-full object-cover";

  if (isVideo) {
    const videoEl = mediaEl as HTMLVideoElement;
    videoEl.autoplay = true;
    videoEl.loop = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
  }

  applyWallpaperFilters(brightness, blur);

  liveWallpaperPreviewEl.innerHTML = "";
  liveWallpaperPreviewEl.appendChild(mediaEl);

  if (wallpaper instanceof Blob) {
    mediaEl.onload = () => URL.revokeObjectURL(src);
  }
};

export const applyWallpaperFilters = (brightness: string, blur: string) => {
  liveWallpaperPreviewEl.style.filter = `brightness(${brightness}) blur(${blur})`;
};

export const previewWallpaperLegacy = (
  wallpaperBase64: string,
  brightness: string,
  blur: string
) => {
  applyWallpaperFilters(brightness, blur);

  if (!wallpaperBase64) {
    liveWallpaperPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
  } else {
    liveWallpaperPreviewEl.innerHTML = `<img src="${wallpaperBase64}" class="w-full h-full" />`;
  }
};

export const previewFavicon = (favicon: string) => {
  // prettier-ignore
  const liveFaviconPreviewEl = document.getElementById("live-favicon-preview") as HTMLDivElement;

  if (!favicon) {
    liveFaviconPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
  } else {
    liveFaviconPreviewEl.innerHTML = `<img src="${favicon}" class="w-full h-full" />`;
  }
};
