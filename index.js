
const container = document.querySelector('.container');
const DOMBoxes = container.querySelectorAll('.box');

const HUMAN_MOVE = 'X';
const AI_MOVE = 'O';

const gameBoard =  (() => {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    function getBoard() {
        return board;
    }
    
    function resetBoard() {
        return board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
    }

    function markHumanMove(row, col) {
        board[row][col] = HUMAN_MOVE;

        return {row, col};
    }

    function markAiMove() {
        const emptyBoxes = [];

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === '') {
                    emptyBoxes.push({row, col});
                }
            } 
        }
        
        const randomPick = Math.floor(Math.random() * emptyBoxes.length);
        const {row, col} = emptyBoxes[randomPick];

        board[row][col] = AI_MOVE;

        return {row, col};
    }

    return {
        getBoard,
        resetBoard,
        markHumanMove,
        markAiMove
    };
})();

// View
const view = (function() {
    function renderBoard(board) {
        container.innerHTML = '';
        
        const fragment = document.createDocumentFragment();

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const div = document.createElement('div');
                div.classList.add('box');
                div.dataset.row = row;
                div.dataset.col = col;

                fragment.appendChild(div);
            }
        }
        container.appendChild(fragment);
    }

    function updateBoard(move, symbol) {
        const box = document.querySelector(`[data-row='${move.row}'][data-col='${move.col}']`);

        box.textContent = symbol;
    }

    return {
        renderBoard,
        updateBoard
    };
})();

// Controller
const controller = (function() {
    function startGame() {
        view.renderBoard(gameBoard.getBoard());
        container.addEventListener('click', handleClick);
    }

    function handleClick(e) {
        e.stopPropagation();
        const boxClicked = e.target;

        if (!boxClicked.classList.contains('box')) return;

        const row = Number(boxClicked.dataset.row);
        const col = Number(boxClicked.dataset.col);

        if (gameBoard.getBoard()[row][col] !== '') return;

        const humanMove = gameBoard.markHumanMove(row, col);
        view.updateBoard(humanMove, HUMAN_MOVE);

        const flattenBoard = gameBoard.getBoard().flat().includes('');
        if (flattenBoard) {
            const aiMove = gameBoard.markAiMove();
            view.updateBoard(aiMove, AI_MOVE);
        }
    }

    return {
        startGame,
        handleClick
    };
})()

// Starts the game on page load
controller.startGame();