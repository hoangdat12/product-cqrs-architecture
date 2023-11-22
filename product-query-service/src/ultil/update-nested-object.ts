export const updateNestedObjectParse = (obj: any) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const objectResponse = updateNestedObjectParse(obj[key]);
      Object.keys(objectResponse).forEach((k) => {
        final[`${key}.${k}`] = objectResponse[k];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};
