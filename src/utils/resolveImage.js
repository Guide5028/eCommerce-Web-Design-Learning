const localImages = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,svg,webp}', {
  eager: true,
  import: 'default',
});

const byFilename = Object.fromEntries(
  Object.entries(localImages).map(([path, url]) => [path.split('/').pop(), url])
);

export function resolveImage(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return byFilename[path.split('/').pop()] ?? path;
}
