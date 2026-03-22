export const helper = {
  updatePositions(array) {
    let count = 0;
    return array.reduce((arr, cur) => {
      cur.position = count;
      count += 1;
      arr.push(cur);
      return arr;
    }, []);
  },
};
