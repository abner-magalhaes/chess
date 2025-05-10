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
const SquareNumbers = [8,7,6,5,4,3,2,1];

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

    #letter;
    #number;
    #dom;

    constructor(letter, number, dom) {
        this.#letter = letter;
        this.#number = number;
        this.#dom = dom;
    }

    /**
     * @returns Se há uma peça nessa casa
     */
    hasPiece() {
        return this.piece != null;
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
     * @param {Player} side
     */
    constructor(type, player) {
        this.type   = type;
        this.player = player;
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
        this.#captured      = true;
        this.square.piece   = null;
        this.square         = null;
    }
    
    move(square) {
        this.square = square;
        this.square.piece = this;
    }

}

class Player {

    #id;
    #side;
    #playing    = false;
    #pieces     = [];

    #findByType(piece) {
        console.log(piece.type, this);
        if(piece.type == this) {
            return true;
        }
    }

    constructor(id, side) {
        
        this.#id = id;
        this.#side = side;

        for(let i = 0; i < 8; i++) {
            this.#pieces.push(new Piece(PieceType.PAWN, this));
        }

        this.#pieces.push(new Piece(PieceType.ROOK, this));
        this.#pieces.push(new Piece(PieceType.ROOK, this));

        this.#pieces.push(new Piece(PieceType.KINGHT, this));
        this.#pieces.push(new Piece(PieceType.KINGHT, this));

        this.#pieces.push(new Piece(PieceType.BISHOP, this));
        this.#pieces.push(new Piece(PieceType.BISHOP, this));

        this.#pieces.push(new Piece(PieceType.QUEEN, this));
        this.#pieces.push(new Piece(PieceType.KING, this));

    }

    getPieces() {
        return this.#pieces;
    }

    getSide() {
        return this.#side;
    }

}

class Chess {

    static #peer;
    static #connection;
    static #player      = null;
    static #opponent    = null;
    static #turn        = null;
    static #squares     = [];

    constructor() {}

    static #getSquare(letter, number) {
        return this.#squares.find((element) => { return element.letter == this.l && element.number == this.n; }, { l : letter, n : number });
    }

    static #updateBoard() {

        let playerPieces    = Chess.#player.getPieces();
        let opponentPieces  = Chess.#opponent.getPieces();

        

    }

    static #startGame() {

        console.log("Chess Start Game!");

        let playerPieces = Chess.#player.getPieces();

        /**
         * Organizando as casas do tabuleiro de acordo com a cor do jogador
         */
        let squaresHTML = document.getElementsByClassName("chess-square");
        let s = 0;
        let csquare;

        if(Chess.#player.side == SideType.WHITE) {
            
            for(let l = 0; l < 8; l++) {
                for(let c = 0; c < 8; c++) {
                    
                    csquare = new Square(SquareLetters[c], SquareNumbers[l], squaresHTML[s]);
                    Chess.#squares.push(csquare);
                    s++;

                    for(let p in playerPieces) {
                        
                    }

                }
            }

        }
        else {

            for(let l = 7; l >= 0; l--) {
                for(let c = 0; c < 8; c++) {
                    Chess.#squares.push(new Square(SquareLetters[c], SquareNumbers[l]), squaresHTML[s]);
                    s++;
                }
            }

        }

    }

    static #peerReceiveData(data) {

        if(data["connected"]) {
            
            Chess.#startGame();

        }
        else {
            console.log("PeerJS Received Unhandled Data: ");
            console.log(data);
        }
    }

    static #peerConnected() {
        console.log("PeerJS Connected");
        Chess.#connection.send({ connected : true });
    }

    static #peerConnection(connection) {
        
        Chess.#connection = connection;
        let opponentID = connection.peer;
        
        console.log("PeerJS Received Connection From: " + opponentID);

        Chess.#opponent = new Player(opponentID, SideType.BLACK);

        console.log("Chess Opponent initialized");

        Chess.#player = new Player(Chess.#peer.id, SideType.WHITE);

        Chess.#connection.on("data", Chess.#peerReceiveData);
        Chess.#connection.on("open", Chess.#peerConnected);

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
        document.getElementById("button-connect").removeAttribute("disabled");
        console.log("PeerJS Opened. Current ID: " + Chess.#peer.id)
        document.getElementById("peer-id").innerText = "Your ID: " + Chess.#peer.id;
    }

    static #connect() {
        let opponentID = document.getElementById("text-opponent-id").value;

        console.log("PeerJS Connecting To: " + opponentID);

        Chess.#connection = Chess.#peer.connect(opponentID);
        Chess.#connection.on("data", Chess.#peerReceiveData);
        Chess.#connection.on("open", Chess.#peerConnected);
        
        Chess.#player = new Player(Chess.#peer.id, SideType.BLACK);
        Chess.#opponent = new Player(Chess.#connection.peer, SideType.WHITE);
    }

    static initialize() {

        document.getElementById("button-connect").setAttribute("disabled", "disabled");
        document.getElementById("button-connect").addEventListener("click", Chess.#connect);

        Chess.#peer = new Peer();
        Chess.#peer.on("open", Chess.#peerOpen);
        Chess.#peer.on("close", Chess.#peerClose);
        Chess.#peer.on("error", Chess.#peerError);
        Chess.#peer.on("disconnected", Chess.#peerDisconnected);
        Chess.#peer.on("connection", Chess.#peerConnection);
        
        console.log("PeerJS Initialized");

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