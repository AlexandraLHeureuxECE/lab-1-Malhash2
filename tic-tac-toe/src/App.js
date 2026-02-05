import React, { useState, useEffect } from 'react';
import './index.css';

const THEMES = [
	{ id: 'light', name: '☀️ Light' },
	{ id: 'dark', name: '🌙 Dark' },
	{ id: 'neon', name: '👾 Neon' },
	{ id: 'retro', name: '🕹️ Retro' },
];

const PIECE_SETS = {
	classic: { X: 'X', O: 'O' },
	emoji: { X: '⚡', O: '🔮' },
	pets: { X: '🐱', O: '🐶' },
	astro: { X: '🚀', O: '🪐' },
	math: { X: '∑', O: '∏' }
};

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8],
		[0, 3, 6], [1, 4, 7], [2, 5, 8],
		[0, 4, 8], [2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return { winner: squares[a], line: [a, b, c] };
		}
	}
	return null;
}

export default function App() {
	// --- STATE ---
	// History is an array of board states: [ [null, null...], ['X', null...] ]
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);

	// Customization State
	const [currentTheme, setCurrentTheme] = useState('light');
	const [pieceStyle, setPieceStyle] = useState('classic');

	// --- DERIVED STATE ---
	const currentSquares = history[currentMove];
	const xIsNext = currentMove % 2 === 0;

	const winInfo = calculateWinner(currentSquares);
	const winner = winInfo ? winInfo.winner : null;
	const winningLine = winInfo ? winInfo.line : [];
	const isDraw = !winner && !currentSquares.includes(null);

	// --- EFFECTS ---
	useEffect(() => {
		document.body.setAttribute('data-theme', currentTheme);
	}, [currentTheme]);

	// --- HANDLERS ---
	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	function handleClick(i) {
		if (currentSquares[i] || winner) return;

		const nextSquares = currentSquares.slice();
		nextSquares[i] = xIsNext ? 'X' : 'O';
		handlePlay(nextSquares);
	}

	function resetGame() {
		setHistory([Array(9).fill(null)]);
		setCurrentMove(0);
	}

	// Helper to render icons
	const getIcon = (val) => val ? PIECE_SETS[pieceStyle][val] : null;

	// --- RENDER HELPERS ---
	let status;
	if (winner) {
		status = `Winner: ${getIcon(winner)}!`;
	} else if (isDraw) {
		status = "It's a Draw!";
	} else {
		status = `Next: ${getIcon(xIsNext ? 'X' : 'O')}`;
	}

	// Generate the list of history buttons
	const moves = history.map((squares, move) => {
		let description;
		if (move > 0) {
			description = `Go to move #${move}`;
		} else {
			description = 'Go to game start';
		}

		return (
			<li key={move}>
				<button
					className={`history-btn ${move === currentMove ? 'active' : ''}`}
					onClick={() => jumpTo(move)}
				>
					{description}
				</button>
			</li>
		);
	});

	return (
		<div className="game-wrapper">
			<div className="status">{status}</div>

			<div className="game-layout">

				{/* LEFT COLUMN: GAME BOARD */}
				<div className="game-main">
					<div className="board">
						{currentSquares.map((square, i) => (
							<button
								key={i}
								className={`square ${winningLine.includes(i) ? 'winning' : ''}`}
								onClick={() => handleClick(i)}
							>
								{getIcon(square)}
							</button>
						))}
					</div>

					<button className="reset-btn" onClick={resetGame} style={{ marginTop: '20px' }}>
						New Game
					</button>
				</div>

				{/* RIGHT COLUMN: HISTORY & SETTINGS */}
				<div className="sidebar">

					<div className="history-panel">
						<div className="history-title">Time Travel</div>
						<ul className="history-list">{moves}</ul>
					</div>

					<div className="settings-panel">
						<div className="setting-group">
							<label>Theme</label>
							<select value={currentTheme} onChange={(e) => setCurrentTheme(e.target.value)}>
								{THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
							</select>
						</div>
						<div className="setting-group">
							<label>Marks</label>
							<select value={pieceStyle} onChange={(e) => setPieceStyle(e.target.value)}>
								<option value="classic">Classic (X/O)</option>
								<option value="emoji">Mystic</option>
								<option value="pets">Pets</option>
								<option value="astro">Space</option>
								<option value="math">Math</option>
							</select>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}
