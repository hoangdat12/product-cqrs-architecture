export const getSelectFromArray = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

export const getUnSelectFromArray = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]));
};
