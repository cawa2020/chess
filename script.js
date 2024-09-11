const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const boardPieces = {
    'a8': { type: 'r', color: 'b' },
    'b8': { type: 'n', color: 'b' },
    'c8': { type: 'b', color: 'b' },
    'd8': { type: 'q', color: 'b' },
    'e8': { type: 'k', color: 'b' },
    'f8': { type: 'b', color: 'b' },
    'g8': { type: 'n', color: 'b' },
    'h8': { type: 'r', color: 'b' },

    'a7': { type: 'p', color: 'b' },
    'b7': { type: 'p', color: 'b' },
    'c7': { type: 'p', color: 'b' },
    'd7': { type: 'p', color: 'b' },
    'e7': { type: 'p', color: 'b' },
    'f7': { type: 'p', color: 'b' },
    'g7': { type: 'p', color: 'b' },
    'h7': { type: 'p', color: 'b' },

    'a2': { type: 'p', color: 'w' },
    'b2': { type: 'p', color: 'w' },
    'c2': { type: 'p', color: 'w' },
    'd2': { type: 'p', color: 'w' },
    'e2': { type: 'p', color: 'w' },
    'f2': { type: 'p', color: 'w' },
    'g2': { type: 'p', color: 'w' },
    'h2': { type: 'p', color: 'w' },

    'a1': { type: 'r', color: 'w' },
    'b1': { type: 'n', color: 'w' },
    'c1': { type: 'b', color: 'w' },
    'd1': { type: 'q', color: 'w' },
    'e1': { type: 'k', color: 'w' },
    'f1': { type: 'b', color: 'w' },
    'g1': { type: 'n', color: 'w' },
    'h1': { type: 'r', color: 'w' }
}
let draggedPiece = null
let turnToMove = 'w'
// Classes

class Figure {
    constructor(square, color, type) {
        this.square = square
        this.color = color
        this.type = type
    }

    get availableMoves() { }

    move(newSquare) {
        if (!this.availableMoves.includes(newSquare)) return false
        this.square = newSquare
        return true
    }

    canMoveToSquare(arr, square) {
        if (boardPieces[square]) {
            if (boardPieces[square].color != this.color) { arr.push(square); }
            return false;
        }
        arr.push(square)
        return true;
    }
}

class Pawn extends Figure {
    constructor(square, color, type) {
        super(square, color, type)
        this.isFirstMoveDone = false
    }

    get availableMoves() {
        const moves = []
        const letter = this.square[0]
        const number = +this.square[1]

        const numberSign = this.color === 'b' ? -1 : +1
        const isNextSquareFree = !boardPieces[letter + (number + 1 * numberSign)]
        const letterIndex = letters.findIndex(el => el === letter)
        const leftSideSquare = `${letters[letterIndex - 1]}${number + 1 * numberSign}`
        const rightSideSquare = `${letters[letterIndex + 1]}${number + 1 * numberSign}`
        if (boardPieces[leftSideSquare] && boardPieces[leftSideSquare].color != this.color) {
            moves.push(leftSideSquare)
        }
        if (boardPieces[rightSideSquare] && boardPieces[rightSideSquare].color != this.color) {
            moves.push(rightSideSquare)
        }
        if (!isNextSquareFree) return moves
        moves.push(`${letter}${number + 1 * numberSign}`)
        if (this.isFirstMoveDone) return moves
        moves.push(`${letter}${number + 2 * numberSign}`)
        return moves
    }

    move(newSquare) {
        if (!this.availableMoves.includes(newSquare)) return false
        this.square = newSquare
        this.isFirstMoveDone = true
        return true
    }
}

class Knight extends Figure {
    get availableMoves() {
        const moves = []
        const letterIndex = letters.findIndex(letter => letter === this.square[0])
        const number = +this.square[1]

        // влево
        moves.push(letters[letterIndex - 2]?.concat(number + 1))
        moves.push(letters[letterIndex - 2]?.concat(number - 1))

        // вверх
        moves.push(letters[letterIndex - 1]?.concat(number + 2))
        moves.push(letters[letterIndex + 1]?.concat(number + 2))

        // вправо
        moves.push(letters[letterIndex + 2]?.concat(number + 1))
        moves.push(letters[letterIndex + 2]?.concat(number - 1))

        // вниз
        moves.push(letters[letterIndex - 1]?.concat(number - 2))
        moves.push(letters[letterIndex + 1]?.concat(number - 2))

        return moves.filter(move => boardPieces[move]?.color != this.color)
    }

    move(newSquare) {
        const isMoveAvailable = this.availableMoves.includes(newSquare)
        const isMoveOnAlias = boardPieces[newSquare]?.color === this.color
        if (!isMoveAvailable || isMoveOnAlias) return false
        this.square = newSquare
        return true
    }
}

class Rook extends Figure {
    get availableMoves() {
        const moves = []
        const letterIndex = letters.findIndex(letter => letter === this.square[0])
        const letter = this.square[0]
        const number = +this.square[1]

        // влево
        for (let index = letterIndex - 1; index >= 0; index--) {
            const square = letters[index].concat(number);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вправо
        for (let index = letterIndex + 1; index < 8; index++) {
            const square = letters[index].concat(number);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вверх
        for (let index = number + 1; index <= 8; index++) {
            const square = letter.concat(index);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вниз
        for (let index = number - 1; index > 0; index--) {
            const square = letter.concat(index);
            if (!super.canMoveToSquare(moves, square)) break
        }

        return moves
    }
}

class Bishop extends Figure {
    get availableMoves() {
        const moves = []
        const letterIndex = letters.findIndex(letter => letter === this.square[0])
        const number = +this.square[1]

        // влево-вверх
        for (let i = 1; i < 8; i++) {
            const square = letters[letterIndex - i]?.concat(number + i);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вправо-вверх
        for (let i = 1; i < 8; i++) {
            const square = letters[letterIndex + i]?.concat(number + i);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вправо-вниз
        for (let i = 1; i < 8; i++) {
            const square = letters[letterIndex + i]?.concat(number - i);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // влево-вниз
        for (let i = 1; i < 8; i++) {
            const square = letters[letterIndex - i]?.concat(number - i);
            if (!super.canMoveToSquare(moves, square)) break
        }

        return moves.filter(move => move)
    }
}

class Queen extends Figure {
    get availableMoves() {
        const moves = []
        const letterIndex = letters.findIndex(letter => letter === this.square[0])
        const number = +this.square[1]
        const letter = this.square[0]

        // влево-вверх
        for (let i = 1; i < 8; i++) {
            const square = letters[letterIndex - i]?.concat(number + i);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вправо-вверх
        for (let i = 1; i < 8; i++) {
            const square = letters[letterIndex + i]?.concat(number + i);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вправо-вниз
        for (let i = 1; i < 8; i++) {
            const square = letters[letterIndex + i]?.concat(number - i);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // влево-вниз
        for (let i = 1; i < 8; i++) {
            const square = letters[letterIndex - i]?.concat(number - i);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // влево
        for (let index = letterIndex - 1; index >= 0; index--) {
            const square = letters[index].concat(number);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вправо
        for (let index = letterIndex + 1; index < 8; index++) {
            const square = letters[index].concat(number);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вверх
        for (let index = number + 1; index <= 8; index++) {
            const square = letter.concat(index);
            if (!super.canMoveToSquare(moves, square)) break
        }

        // вниз
        for (let index = number - 1; index > 0; index--) {
            const square = letter.concat(index);
            if (!super.canMoveToSquare(moves, square)) break
        }

        return moves.filter(move => move)
    }
}

class King extends Figure {
    get availableMoves() {
        const moves = []
        const letterIndex = letters.findIndex(letter => letter === this.square[0])
        const number = +this.square[1]
        const letter = this.square[0]

        super.canMoveToSquare(moves, letters[letterIndex - 1].concat(number + 1))
        super.canMoveToSquare(moves, letter.concat(number + 1))
        super.canMoveToSquare(moves, letters[letterIndex + 1].concat(number + 1))
        super.canMoveToSquare(moves, letters[letterIndex - 1].concat(number - 1))
        super.canMoveToSquare(moves, letter.concat(number - 1))
        super.canMoveToSquare(moves, letters[letterIndex + 1].concat(number - 1))
        super.canMoveToSquare(moves, letters[letterIndex - 1].concat(number))
        super.canMoveToSquare(moves, letters[letterIndex + 1].concat(number))

        const attackedSquares = 1

        console.log(attackedSquares)
        return moves
        // return moves.filter((move) => !attackedSquares.has(move))
    }
}

// Logic

function initBoard() {
    const board = document.querySelector('.chessboard')
    let isSquareBlack = false
    for (let i = 8; i > 0; i--) {
        letters.map((letter) => {
            const squareDiv = document.createElement('div')
            squareDiv.id = letter + i
            // squareDiv.addEventListener("click", hideAvailableMoves)
            squareDiv.addEventListener("dragover", (event) => { event.preventDefault(); });
            squareDiv.addEventListener("drop", (event) => onSquareDrop(event))

            squareDiv.classList.add('square')
            squareDiv.classList.add(isSquareBlack ? 'black-square' : 'white-square')
            isSquareBlack = !isSquareBlack
            board.appendChild(squareDiv)
        })
        isSquareBlack = !isSquareBlack
    }

    initFigures()
}

function initFigures() {
    for (const [square, piece] of Object.entries(boardPieces)) {
        const figureImg = document.createElement('img')
        const squareDiv = document.getElementById(square)
        const pieceFullname = getPieceFullname(piece)
        figureImg.src = `assets/imgs/${pieceFullname}.png`
        figureImg.draggable = true
        squareDiv.appendChild(figureImg)
        const figure = createFigure(piece, square)
        boardPieces[square] = figure

        // figureImg.addEventListener('click', () => {
        //     showAvailableMoves(figure)
        // })

        figureImg.addEventListener('dragstart', () => {
            if (figure.color !== turnToMove) return
            draggedPiece = { html: figureImg, piece: figure };
            hideAvailableMoves()
            showAvailableMoves(figure)
        })
    }
}

function onSquareDrop(event) {
    if (draggedPiece?.piece?.color !== turnToMove) return
    hideAvailableMoves()
    const target = event.target.tagName === 'IMG' ? event.target.parentElement : event.target
    const squareId = target.id
    const oldSquare = draggedPiece.piece.square
    if (!draggedPiece.piece.move(squareId)) return
    document.querySelectorAll('.last-move').forEach(e => e.classList.remove('last-move'))
    document.getElementById(oldSquare).classList.add('last-move')
    document.getElementById(squareId).classList.add('last-move')
    delete boardPieces[oldSquare]
    boardPieces[squareId] = draggedPiece.piece
    target.innerHTML = null
    target.appendChild(draggedPiece.html)
    turnToMove = draggedPiece.piece.color == 'b' ? 'w' : 'b'
}

function createFigure(piece, square) {
    switch (piece.type) {
        case 'n': return new Knight(square, piece.color, piece.type)
        case 'r': return new Rook(square, piece.color, piece.type)
        case 'b': return new Bishop(square, piece.color, piece.type)
        case 'q': return new Queen(square, piece.color, piece.type)
        case 'k': return new King(square, piece.color, piece.type)
        case 'p': return new Pawn(square, piece.color, piece.type)
        default: return new Figure(square, piece.color)
    }
}

function getPieceFullname(piece) {
    const pieceFullnameColor = piece.color === 'b' ? 'black' : 'white'
    let pieceFullnameType
    switch (piece.type) {
        case 'r': pieceFullnameType = 'rook'; break;
        case 'n': pieceFullnameType = 'knight'; break;
        case 'b': pieceFullnameType = 'bishop'; break;
        case 'q': pieceFullnameType = 'queen'; break;
        case 'k': pieceFullnameType = 'king'; break;
        case 'p': pieceFullnameType = 'pawn'; break;
        default: break;
    }

    return `${pieceFullnameColor}-${pieceFullnameType}`
}

function hideAvailableMoves() {
    document.querySelectorAll('.available-move').forEach((el) => {
        el.classList.remove('available-move')
    })
}

function showAvailableMoves(figure) {
    figure.availableMoves.map((square) => {
        document.getElementById(square)?.classList?.add('available-move')
    })
}

initBoard()