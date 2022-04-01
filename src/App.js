import React, { useState } from "react";
import "./styles.css";
import ArrowKeysReact from "arrow-keys-react";
import { cloneBoard, selectRondomInArray } from "./util";
import { colors } from "./consts";

export default function App() {
  const [Board, setBoard] = useState(initRondomly(3));

  ArrowKeysReact.config({
    left: () => {
      console.log("left key detected.");
      setBoard(handlSwip(Board, "SWIP_LEFT"));
    },
    right: () => {
      console.log("right key detected.");
      setBoard(handlSwip(Board, "SWIP_RIGHT"));
    },
    up: () => {
      console.log("up key detected.");
      setBoard(handlSwip(Board, "SWIP_UP"));
    },
    down: () => {
      console.log("down key detected.");
      setBoard(handlSwip(Board, "SWIP_DOWN"));
    }
  });

  return (
    <div className="App" {...ArrowKeysReact.events} tabIndex="1">
      <div className="Board">
        {GameOver(Board) && (
          <div className="GameOver">
            <h2>Game Over</h2>
            <button onClick={() => setBoard(handlSwip(Board, "RESET"))}>
              Try Again
            </button>
          </div>
        )}
        {GameWon(Board) && (
          <div className="GameWon">
            <h2>You Won</h2>
            <button onClick={() => setBoard(handlSwip(Board, "RESET"))}>
              Play Again
            </button>
          </div>
        )}
        {Board.map((row, index) => (
          <div key={index} className="Row">
            {row.map((cell, cell_index) => (
              <div
                key={cell_index}
                className="Cell"
                style={{ backgroundColor: colors[cell] }}
              >
                {cell > 0 ? cell : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function handlSwip(prevBoard, action) {
  switch (action) {
    case "SWIP_UP":
      console.log("swiping up");
      const swapedUp = swipUp(prevBoard);
      if (!AreEqual(swapedUp, prevBoard)) return SpawnRondomPostion(swapedUp);
      return swapedUp;

    case "SWIP_DOWN":
      console.log("swiping down");
      const swipedDown = swipDown(prevBoard);
      if (!AreEqual(swipedDown, prevBoard))
        return SpawnRondomPostion(swipedDown);
      return swipedDown;

    case "SWIP_RIGHT":
      console.log("swiping right");
      const swipedRight = swipRight(prevBoard);
      if (!AreEqual(swipedRight, prevBoard))
        return SpawnRondomPostion(swipedRight);
      return swipedRight;

    case "SWIP_LEFT":
      console.log("swiping left");
      const swipedLeft = swipLeft(prevBoard);
      if (!AreEqual(swipedLeft, prevBoard))
        return SpawnRondomPostion(swipedLeft);
      return swipedLeft;

    case "RESET":
      return initRondomly(2);

    default:
      return prevBoard;
  }
}

function swipUp(Board) {
  const copy = cloneBoard(Board);
  if (GameOver(copy) || GameWon(copy)) return copy;
  for (let i = 0; i < copy.length; i++) {
    if (i === 0) continue;
    for (let j = 0; j < copy[i].length; j++) {
      if (copy[i][j] === 0) continue;
      let k = i;
      while (k > 0 && copy[k - 1][j] === 0) {
        copy[k - 1][j] = copy[k][j];
        copy[k][j] = 0;
        k--;
      }
      if (k === 0) continue;
      if (copy[k][j] === copy[k - 1][j]) {
        copy[k - 1][j] *= 2;
        copy[k][j] = 0;
      }
    }
  }
  return copy;
}
function swipDown(Board) {
  const copy = cloneBoard(Board);
  if (GameOver(copy) || GameWon(copy)) return copy;
  for (let i = 3; i > -1; i--) {
    if (i === 3) continue;
    for (let j = 0; j < copy[i].length; j++) {
      if (copy[i][j] === 0) continue;
      let k = i;
      while (k < 3 && copy[k + 1][j] === 0) {
        copy[k + 1][j] = copy[k][j];
        copy[k][j] = 0;
        k++;
      }
      if (k === 3) continue;
      if (copy[k][j] === copy[k + 1][j]) {
        copy[k + 1][j] *= 2;
        copy[k][j] = 0;
      }
    }
  }
  return copy;
}
function swipRight(Board) {
  const copy = cloneBoard(Board);
  if (GameOver(copy) || GameWon(copy)) return copy;
  for (let i = 0; i < copy.length; i++) {
    for (let j = 3; j > -1; j--) {
      if (j === 3) continue;
      if (copy[i][j] === 0) continue;
      let k = j;
      while (k < 3 && copy[i][k + 1] === 0) {
        copy[i][k + 1] = copy[i][k];
        copy[i][k] = 0;
        k++;
      }
      if (k === 3) continue;
      if (copy[i][k] === copy[i][k + 1]) {
        copy[i][k + 1] *= 2;
        copy[i][k] = 0;
      }
    }
  }
  return copy;
}
function swipLeft(Board) {
  const copy = cloneBoard(Board);
  if (GameOver(copy) || GameWon(copy)) return copy;
  for (let i = 0; i < copy.length; i++) {
    for (let j = 0; j < copy[i].length; j++) {
      if (j === 0) continue;
      if (copy[i][j] === 0) continue;
      let k = j;
      while (k > 0 && copy[i][k - 1] === 0) {
        copy[i][k - 1] = copy[i][k];
        copy[i][k] = 0;
        k--;
      }
      if (k === 0) continue;
      if (copy[i][k] === copy[i][k - 1]) {
        copy[i][k - 1] *= 2;
        copy[i][k] = 0;
      }
    }
  }
  return copy;
}

function SpawnRondomPostion(Board) {
  const copy = cloneBoard(Board);
  const emptyPosition = [];
  for (let i = 0; i < copy.length; i++) {
    for (let j = 0; j < copy[i].length; j++) {
      if (copy[i][j] === 0) emptyPosition.push([i, j]);
    }
  }
  if (emptyPosition.length) {
    const spawnPos = selectRondomInArray(emptyPosition);
    copy[spawnPos[0]][spawnPos[1]] = selectRondomInArray([2, 4]);
  }
  return copy;
}

function initRondomly(n) {
  const emptyBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  let copy = emptyBoard;
  for (let i = 0; i < n; i++) {
    copy = SpawnRondomPostion(copy);
  }
  return copy;
}
function GameOver(Board) {
  console.log(Board);

  for (let i = 0; i < Board.length; i++) {
    for (let j = 0; j < Board[i].length; j++) {
      const current = Board[i][j];
      if (current === 0) return false;
      const up = i > 0 ? Board[i - 1][j] : -1;
      const left = j > 0 ? Board[i][j - 1] : -1;
      if (current === up || current === left) return false;
    }
  }
  return true;
}
function GameWon(Board) {
  for (let row of Board) {
    for (let cell of row) {
      if (cell === 2048) return true;
    }
  }
  return false;
}
function AreEqual(Board1, Board2) {
  for (let i = 0; i < Board1.length; i++) {
    for (let j = 0; j < Board1[i].length; j++) {
      if (Board1[i][j] !== Board2[i][j]) return false;
    }
  }
  return true;
}
