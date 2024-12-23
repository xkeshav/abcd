import { SyntheticEvent, useEffect, useState } from "react";

type CellCord = [number, number];

type DifficultyLevel = "easy" | "medium" | "hard";

type DirectionType = "horizontal" | "vertical" | "diagonal";

type Word = string[];

type Grid = string[][];

type Solution = { word: Word[0]; cells: CellCord[]; direction: string | null };

const WordSearchPuzzle = () => {
  // Words for different age groups
  const wordSets = {
    easy: ["CAT", "DOG", "PIG", "COW", "HEN"],
    medium: ["BIRD", "FISH", "DUCK", "FROG", "BEAR"],
    hard: ["MONKEY", "RABBIT", "GIRAFFE", "ZEBRA", "TIGER"]
  };

  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [grid, setGrid] = useState<Grid>([]);
  const [size, setSize] = useState(8); // Smaller grid for kids
  const [selectedCells, setSelectedCells] = useState<CellCord[]>([]);
  const [foundWords, setFoundWords] = useState<Word>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [matchedCells, setMatchedCells] = useState<CellCord[]>([]); // New state for matched cells

  // Direction colors for solution display
  const directionColors: Record<DirectionType, string> = {
    horizontal: "hsla(120, 70%, 70%, 0.5)",
    vertical: "hsla(200, 70%, 70%, 0.5)",
    diagonal: "hsla(300, 70%, 70%, 0.5)"
  };

  const generateRandomLetter = () => {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  const getWordDirection = (cells: CellCord[]) => {
    const [[r1, c1], [r2, c2]] = [cells[0], cells[cells.length - 1]];
    if (r1 === r2) return "horizontal";
    if (c1 === c2) return "vertical";
    return "diagonal";
  };

  const canPlaceWord = (grid: Grid, word: string, row: number, col: number, dRow: number, dCol: number) => {
    if (row + dRow * (word.length - 1) >= size || row + dRow * (word.length - 1) < 0) return false;
    if (col + dCol * (word.length - 1) >= size || col + dCol * (word.length - 1) < 0) return false;

    for (let i = 0; i < word.length; i++) {
      const currentCell = grid[row + dRow * i][col + dCol * i];
      if (currentCell !== "" && currentCell !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (grid: Grid, word: string) => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1] // diagonal
    ];

    const attempts = 100;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (canPlaceWord(grid, word, row, col, direction[0], direction[1])) {
        const wordCells = [] as CellCord[];
        for (let i = 0; i < word.length; i++) {
          const cellRow = row + direction[0] * i;
          const cellCol = col + direction[1] * i;
          grid[cellRow][cellCol] = word[i];
          wordCells.push([cellRow, cellCol]);
        }
        return { placed: true, cells: wordCells, direction: getWordDirection(wordCells) };
      }
    }
    return { placed: false, cells: [], direction: null };
  };

  const generatePuzzle = () => {
    const newGrid = Array(size)
      .fill(Infinity)
      .map(() => Array(size).fill(""));
    const newSolutions: Solution[] = [];
    const words: string[] = (wordSets as any)[difficulty];

    // Place each word and store solutions
    words.forEach((word) => {
      const result = placeWord(newGrid, word);
      if (result.placed) {
        newSolutions.push({ word, cells: result.cells, direction: result.direction });
      }
    });

    // Fill empty cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j] === "") {
          newGrid[i][j] = generateRandomLetter();
        }
      }
    }
    console.log({ newGrid });

    setGrid(newGrid);
    setSolutions(newSolutions);
    setFoundWords([]);
    setShowSolution(false);
    setSelectedCells([]);
    setClickCount(0);
    setMatchedCells([]); // Reset matched cells
  };

  const handleCellClick = (e: SyntheticEvent<HTMLElement>, cellPoint: CellCord) => {
    const [row, col] = cellPoint;
    setClickCount((n) => n + 1);
    setSelectedCells((prev: any) => {
      // If clicking the same cell, clear selection
      if ((e.target as HTMLElement).classList.contains("selected")) {
        console.log("clicking same");
        return [];
      }

      // If no selection, start new selection
      if (prev.length === 0) {
        return [[row, col]];
      }

      // Add to selection if adjacent
      const [lastRow, lastCol]: any = prev[prev.length - 1];
      const isAdjacent = Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1;

      if (isAdjacent) {
        const newSelection = [...prev, [row, col]];
        checkForWord(newSelection);
        return newSelection;
      }

      // If not adjacent, start new selection
      return [[row, col]];
    });
  };

  const handleCellStart = (row: number, col: number) => {
    setIsDragging(true);
    setSelectedCells([[row, col]]);
  };

  const handleCellEnter = (row: number, col: number) => {
    if (isDragging) {
      setSelectedCells((prev: CellCord[]) => {
        const newSelection = [...prev, [row, col]] as CellCord[];
        checkForWord(newSelection);
        return newSelection;
      });
    }
  };

  const handleCellEnd = () => {
    setIsDragging(false);
    setSelectedCells([]);
  };

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellCoords = element?.getAttribute("data-coords");
    if (cellCoords) {
      const [row, col] = cellCoords.split("-").map(Number);
      handleCellStart(row, col);
    }
  };

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellCoords = element?.getAttribute("data-coords");
    if (cellCoords) {
      const [row, col] = cellCoords.split("-").map(Number);
      handleCellEnter(row, col);
    }
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    handleCellEnd();
  };

  const checkForWord = (selection: CellCord[]) => {
    console.log({ selection });
    if (selection.length > 2) {
      const word = selection.map(([row, col]: CellCord) => grid[row][col]).join("");
      const words = wordSets[difficulty];

      if (words.includes(word) && !foundWords.includes(word)) {
        setFoundWords((prev) => [...prev, word]);
        setMatchedCells((prev) => [...prev, ...selection]); // Add matched cells to state
        setSelectedCells([]);
      }
    }
  };

  const clearSelection = () => {
    setSelectedCells([]);
  };

  useEffect(() => {
    generatePuzzle();
  }, [difficulty]);

  return (
    <div className="puzzle-container">
      <div className="controls">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
          className="difficulty-select"
        >
          <option value="easy">Easy (Ages 3-5)</option>
          <option value="medium">Medium (Ages 5-6)</option>
          <option value="hard">Hard (Ages 7-8)</option>
        </select>
        <button className="new-puzzle-btn" onClick={generatePuzzle}>
          New Puzzle
        </button>
        <button className="solution-btn" onClick={() => setShowSolution(!showSolution)}>
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
        <button className="clear-btn" onClick={clearSelection}>
          Clear Selection
        </button>
      </div>

      <div className="stats">
        <span>Clicks: {clickCount}</span>
        <span>
          Found: {foundWords.length}/{wordSets[difficulty].length}
        </span>
      </div>
      <div className="word-list">
        {wordSets[difficulty].map((word) => (
          <span key={word} className={`word ${foundWords.includes(word) ? "found" : ""}`}>
            {word}
          </span>
        ))}
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          touchAction: "none"
        }}
        onMouseUp={handleCellEnd}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const isSelected = selectedCells.some(([row, col]) => row === i && col === j);
            const isMatched = matchedCells.some(([row, col]) => row === i && col === j); // Check if cell is matched
            const isFound = solutions.find(
              (solution) => showSolution && solution.cells.some(([row, col]) => row === i && col === j)
            );
            return (
              <div
                key={`${i}-${j}`}
                className={`cell ${isSelected ? "selected" : "unselected"} ${isMatched ? "match" : ""} ${
                  isFound ? "solution" : ""
                }`}
                onClick={(e) => handleCellClick(e, [i, j])}
                data-coords={`${i}-${j}`}
                style={{
                  backgroundColor: isFound ? directionColors[isFound.direction as DirectionType] : "white"
                }}
                onMouseDown={() => handleCellStart(i, j)}
                onMouseEnter={() => handleCellEnter(i, j)}
                onTouchStart={() => handleCellStart(i, j)}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WordSearchPuzzle;
