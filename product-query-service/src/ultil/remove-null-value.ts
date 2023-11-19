export const removeNullOrUndefinedFromRequest = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key];
    }
  });
  return obj;
};
