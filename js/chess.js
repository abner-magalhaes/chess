/*let isDragging = false;
let offsetX, offsetY;
let draggable = document.getElementsByClassName("chess-piece")[0];

draggable.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = draggable.offsetLeft + (e.clientX - draggable.offsetLeft);
    offsetY = draggable.offsetTop + (e.clientY - draggable.offsetTop);

    console.log("clientX: " + e.clientX, "offsetLeft: " + draggable.offsetLeft, " offsetX: " + offsetX);
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        draggable.style.left = `${e.clientX - offsetX}px`;
        draggable.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    draggable.style.cursor = 'grab';
});*/

const SquareLetters = ["a","b","c","d","e","f","g","h"];
const SquareNumbers = [1,2,3,4,5,6,7,8];

/**
 * Tipos das peças
 */
const PieceType = {
    KING     : "k",
    QUEEN    : "q", 
    ROOK     : "r",
    BISHOP   : "b",
    KINGHT   : "k",
    PAWN     : "p"
}

/**
 * Lados do tabuleiro
 */
const SideType = {
    BLACK : "b",
    WHITE : "w"
}

/**
 * Tipos de movimentos
 */
const MoveType = {
    INVALID     : 0,
    CANCELLED   : 1,
    VALID       : 2,
    CAPTURE     : 3
}

/**
 * Casas do tabuleiro
 */
class Square {

    constructor(letter, number) {
        this.letter = letter;
        this.number = number;
    }

    /**
     * @returns Se há uma peça nessa casa
     */
    hasPiece() {
        return this.piece != null;
    }

    /**
     * Limpa qualquer peça dessa casa
     */
    clear() {
        if(this.piece) this.piece.square = null;
        this.piece = null;
    }

}

/**
 * Peças do tabuleiro
 */
class Piece {

    /**
     * Define se a peça foi capturada
     */
    #captured = false;

    /**
     * @param {PieceType} type 
     * @param {Square} square 
     * @param {SideType} side
     */
    constructor(type, square, side) {
        this.type   = type;
        this.square = square;
        this.side   = side;
    }

    /**
     * @returns Se a peça foi capturada
     */
    hasCaptured() {
        return this.#captured;
    }

    /**
     * Torna a peça capturada
     */
    captured() {
        this.#captured = true;
    }
    
    move(square) {
        this.square = square;
        this.square.piece = this;
    }

}

class Player {

    #id         = false;
    #connected  = false;
    #playing    = false;
    #pieces     = [];

    constructor() {
        
    }

}

class Chess {

    static #peer;
    static #player      = null;
    static #opponent    = null;
    static #turn        = null;
    static #squares     = [];

    constructor() {}

    static #peerReceiveData(data) {

    }

    static #peerClose() {
        console.log("PeerJS Closed");
    }

    static #peerDisconnected() {
        console.log("PeerJS Disconnected");
    }

    static #peerError(error) {
        console.log("PeerJS Error. Type: " + error.type);
    }

    static #peerOpen() {
        Chess.#peer.on("data", Chess.#peerReceiveData);
        console.log("PeerJS Opened. Current ID: " + Chess.#peer.id)
        document.getElementById("peer-id").innerText = "Your ID: " + Chess.#peer.id;
    }

    static initialize() {
        Chess.#peer = new Peer();
        Chess.#peer.on("open", Chess.#peerOpen);
        Chess.#peer.on("close", Chess.#peerClose);
        Chess.#peer.on("disconnected", Chess.#peerDisconnected);
        Chess.#peer.on("error", Chess.#peerError);
        console.log("PeerJS Initialized");
    }

    connect(id) {
        Chess.#peer
    }

}

class MoveChecker {
    
    constructor() {
        throw Error("Não é possível instanciar uma classe MoveChecker");
    }

    static #pawnMove(piece, square) {
        
        if(piece.square.letter != square.letter) {
            return MoveType.INVALID;
        }

    }

    static isValid(piece, square) {

        if(square.hasPiece()) {
            if(square.piece == piece) {
                return MoveType.CANCELLED;
            }
            else if(square.piece.side == piece.side) {
                return MoveType.INVALID;
            }
        }

        switch(this.type) {
            case PieceType.PAWN:
                this.#pawnMove(piece, square);
                break;
            case PieceType.ROOK:
                break;
            case PieceType.KINGHT:
                break;
            case PieceType.BISHOP:
                break;
            case PieceType.QUEEN:
                break;
            case PieceType.KING:
                break;
        }

    }


}