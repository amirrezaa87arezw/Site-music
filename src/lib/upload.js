export function saveAudioFile(file) {
  // حداکثر ۴۰ مگابایت برای فایل صوتی
  return saveFile(file, "audio", AUDIO_EXT, 40 * 1024 * 1024);
}

export function saveCoverFile(file) {
  // حداکثر ۸ مگابایت برای کاور
  return saveFile(file, "covers", IMAGE_EXT, 8 * 1024 * 1024);
}
