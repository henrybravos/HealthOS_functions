export const getExtension = (url: string) => {
  return url.substring(
    url.lastIndexOf(".") + 1,
    url.indexOf("?") !== -1 ? url.indexOf("?") : undefined
  );
};
