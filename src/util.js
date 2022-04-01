export function selectRondomInArray(arr = []) {
  if (arr.length === 0) return null;
  const rondom_index = Math.floor(Math.random() * arr.length);
  return arr[rondom_index];
}

export function cloneBoard(Board) {
  return Board.map((row) => row.slice());
}
