function Checker(){
    return {
        renderKey: 0,
        size: 10,
        // Looks awfull
        playerWhite: [
            {x : 2, y : 1},{x : 4, y : 1},{x : 6, y : 1},{x : 8, y : 1},{x : 10, y : 1},
            {x : 1, y : 2},{x : 3, y : 2},{x : 5, y : 2},{x : 7, y : 2},{x : 9, y : 2},
            {x : 2, y : 3},{x : 4, y : 3},{x : 6, y : 3},{x : 8, y : 3},{x : 10, y : 3},
            {x : 1, y : 4},{x : 3, y : 4},{x : 5, y : 4},{x : 7, y : 4},{x : 9, y : 4}
        ],

        playerBlack: [
            {x : 1, y : 10},{x : 3, y : 10},{x : 5, y : 10},{x : 7, y : 10},{x : 9, y : 10},
            {x : 2, y : 9},{x : 4, y : 9},{x : 6, y : 9},{x : 8, y : 9},{x : 10, y : 9},
            {x : 1, y : 8},{x : 3, y : 8},{x : 5, y : 8},{x : 7, y : 8},{x : 9, y : 8},
            {x : 2, y : 7},{x : 4, y : 7},{x : 6, y : 7},{x : 8, y : 7},{x : 10, y : 7}
        ],

        turn: {
            NONE  : 0,
            WHITE : 1,
            BLACK : 2
        },

        currTurn: 0,

        seleted: {x : 0, y : 0, i : 0},

        seletedCount: 0,

        GetSeleted(_row, _col) {
            if(this.currTurn == 2) {
                for(let i =0; i < this.playerBlack.length; i++) { if(this.IsAt(_col, _row, this.playerBlack[i])){ this.seleted.x = _col; this.seleted.y = _row; this.seleted.i = i; } }

                if (this.InField(this.seleted.x, this.seleted.y) && this.seletedCount > 0) {
                    if (this.IsStanding(_col, _row)) {  
                        const captured = this.TryCapture(_col, _row, this.playerBlack[this.seleted.i], this.playerWhite);

                        if (captured || (!captured && this.InBound(_col, _row, this.playerBlack[this.seleted.i]))) {
                            this.playerBlack[this.seleted.i].x = _col;
                            this.playerBlack[this.seleted.i].y = _row;

                            this.seletedCount = 0;
                            this.seleted = { x: -1, y: -1, i: -1 };

                            this.NextTurn();
                        }
                    }
                } else { this.seletedCount++; }
                    
                this.renderKey++;
            }
        },

        GetColor(_row, _col) { return (_row == this.seleted.y && _col == this.seleted.x) ? "w-16 h-16 bg-blue border-4 border-blue" : ((_row + _col) % 2 === 0) ? "w-16 h-16 bg-white border-4 border-white" : "w-16 h-16 bg-black border-4 border-black"},

        GetPlayer(_row, _col, _black = false) { 
            if(!_black){ for (let i = 0; i < this.playerWhite.length; i++) { if(this.playerWhite[i].y == _row && this.playerWhite[i].x == _col){ return "White.png"; } } } 
            else { for (let i = 0; i < this.playerBlack.length; i++) { if(this.playerBlack[i].y == _row && this.playerBlack[i].x == _col){ this.seleted.x = 0; this.seleted.y = 0; return "Black.png"; } } }
                
            return "";
        },

        GetTurn() { return (this.currTurn == this.turn.BLACK) ? "Black's Turn" : (this.currTurn == this.turn.WHITE) ? "White's Turn" : "None's Turn"; },

        NextTurn() { 
            this.currTurn = (this.currTurn == this.turn.BLACK) ? this.turn.WHITE : (this.currTurn == this.turn.WHITE) ? this.turn.BLACK : this.turn.WHITE; 
            
            if(this.currTurn == this.turn.WHITE) { this.NPCTurn(); }
        },

        // for enemy is alweays white
        // for now only easy mode AI he dont care what you do but just random chose one fgor testing prosuses
        NPCTurn() { 
            emptyObjs = [];
            for(let i =0; i < this.playerWhite.length; i++) {
                let notAble = false;

                for (let j = 0; j < this.playerWhite.length; j++) { if(this.InField(this.playerWhite[i].x + 1, this.playerWhite[i].y + 1) || this.InField(this.playerWhite[i].x - 1, this.playerWhite[i].y + 1)) { if(!this.IsStanding(this.playerWhite[i].x + 1, this.playerWhite[i].y + 1) || !this.IsStanding(this.playerWhite[i].x - 1, this.playerWhite[i].y + 1) ) { notAble = true; break; } }else{notAble = true; break;} }

                if(!notAble) {
                    const idx = emptyObjs.length;

                    emptyObjs[idx] = this.playerWhite[i];
                    emptyObjs[idx].oldI = i;

                    console.log(emptyObjs[idx]);
                }
            }

            let pieceToMove = emptyObjs[Math.floor(Math.random() * emptyObjs.length)];
            console.log(pieceToMove);
            let dire = Math.floor(Math.random() * 2);

            let newX = (dire === 0) ? (pieceToMove.x - 1 > 0 ? pieceToMove.x - 1 : pieceToMove.x + 1) : pieceToMove.x + 1;

            pieceToMove.x = newX;
            pieceToMove.y += 1;
                
            this.playerWhite[pieceToMove.oldI] = pieceToMove;
            console.log(pieceToMove);

            this.NextTurn();

            this.renderKey++;
        },

        IsAt(_x, _y, _player) { return _player.x === _x && _player.y === _y; },

        IsStanding(_x, _y) { 
            for(let i = 0; i < this.playerBlack.length; i++) { if (this.playerBlack[i].y == _y && this.playerBlack[i].x == _x) { return false; } } 
            for(let i = 0; i < this.playerWhite.length; i++) { if (this.playerWhite[i].y == _y && this.playerWhite[i].x == _x) { return false; } } 

            return true;
        },

        InField(_x, _y) {  if (_y > this.size || _y < 1 || _x > this.size || _x < 0) { return false; } return true; },

        InBound(_x, _y, _player) { 
            if (_player.y - 1 == _y) {  if(_player.x - 1 == _x || _player.x + 1 == _x) { return true; }  } 

            console.log("false");

            return false;
        },

        TryCapture(_col, _row, _piece, _pieces) {
            const midX = (_piece.x + _col) / 2;
            const midY = (_piece.y + _row) / 2;

            if (Math.abs(_col - _piece.x) !== 2 || Math.abs(_row - _piece.y) !== 2) { return false; }

            for (let j = 0; j < _pieces.length; j++) {
                if (_pieces[j].x === midX && _pieces[j].y === midY) {
                    if (this.IsStanding(_col, _row)) {
                        _pieces.splice(j, 1);
                        return true;
                    }
                }
            }

            console.log("captured");

            return false;
        },

    }
}