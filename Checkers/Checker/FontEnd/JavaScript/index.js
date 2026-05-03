function Checker(){
    return {
        renderKey: 0,
        size: 10,

        popupMode: "",

        // Looks awfull
        playerBlack: [
            {x : 2, y : 1, king: false},{x : 4, y : 1, king: false},{x : 6, y : 1, king: false},{x : 8, y : 1, king: false},{x : 10, y : 1, king: false},
            {x : 1, y : 2, king: false},{x : 3, y : 2, king: false},{x : 5, y : 2, king: false},{x : 7, y : 2, king: false},{x : 9, y : 2, king: false},
            {x : 2, y : 3, king: false},{x : 4, y : 3, king: false},{x : 6, y : 3, king: false},{x : 8, y : 3, king: false},{x : 10, y : 3, king: false},
            {x : 1, y : 4, king: false},{x : 3, y : 4, king: false},{x : 5, y : 4, king: false},{x : 7, y : 4, king: false},{x : 9, y : 4, king: false}
        ],

        playerWhite: [
            {x : 1, y : 10, king: false},{x : 3, y : 10, king: false},{x : 5, y : 10, king: false},{x : 7, y : 10, king: false},{x : 9, y : 10, king: false},
            {x : 2, y : 9, king: false},{x : 4, y : 9, king: false},{x : 6, y : 9, king: false},{x : 8, y : 9, king: false},{x : 10, y : 9, king: false},
            {x : 1, y : 8, king: false},{x : 3, y : 8, king: false},{x : 5, y : 8, king: false},{x : 7, y : 8, king: false},{x : 9, y : 8, king: false},
            {x : 2, y : 7, king: false},{x : 4, y : 7, king: false},{x : 6, y : 7, king: false},{x : 8, y : 7, king: false},{x : 10, y : 7, king: false}
        ],

        playerBackUp: [[
            {x : 1, y : 10, king: false},{x : 3, y : 10, king: false},{x : 5, y : 10, king: false},{x : 7, y : 10, king: false},{x : 9, y : 10, king: false},
            {x : 2, y : 9, king: false},{x : 4, y : 9, king: false},{x : 6, y : 9, king: false},{x : 8, y : 9, king: false},{x : 10, y : 9, king: false},
            {x : 1, y : 8, king: false},{x : 3, y : 8, king: false},{x : 5, y : 8, king: false},{x : 7, y : 8, king: false},{x : 9, y : 8, king: false},
            {x : 2, y : 7, king: false},{x : 4, y : 7, king: false},{x : 6, y : 7, king: false},{x : 8, y : 7, king: false},{x : 10, y : 7, king: false}
        ], [
            {x : 2, y : 1, king: false},{x : 4, y : 1, king: false},{x : 6, y : 1, king: false},{x : 8, y : 1, king: false},{x : 10, y : 1, king: false},
            {x : 1, y : 2, king: false},{x : 3, y : 2, king: false},{x : 5, y : 2, king: false},{x : 7, y : 2, king: false},{x : 9, y : 2, king: false},
            {x : 2, y : 3, king: false},{x : 4, y : 3, king: false},{x : 6, y : 3, king: false},{x : 8, y : 3, king: false},{x : 10, y : 3, king: false},
            {x : 1, y : 4, king: false},{x : 3, y : 4, king: false},{x : 5, y : 4, king: false},{x : 7, y : 4, king: false},{x : 9, y : 4, king: false}]
        ],

        turn: {
            NONE  : 0,
            WHITE : 1,
            BLACK : 2
        },

        currTurn: 0,

        seleted: {x : 0, y : 0, i : 0},

        seletedCount: 0,

        showPopup: false,
        popupTitle: "",

        winState: {
            NONE  : 0,
            WHITE : 1,
            BLACK : 2
        },

        gameId : 0,
        savePass: "",

        currWinState: 0,

        GetSeleted(_row, _col) {
            this.WinStateFunc();

            switch(this.currTurn){ 
                case 0: this.NextTurn(); break;
                case 1: this.SeletedPiece(_row, _col, this.playerWhite); break;
                case 2: this.SeletedPiece(_row, _col, this.playerBlack); break;
            }
        },

        SeletedPiece(_row, _col, _pieces) {    
            this.WhatIsSeleted(_row, _col, _pieces);

            console.log("seletedCount:", this.seletedCount, "seleted:", JSON.stringify(this.seleted), "piece:", JSON.stringify(_pieces[this.seleted.i]));

            if (this.InField(this.seleted.x, this.seleted.y) && this.seletedCount > 0) {
                if (this.IsStanding(_col, _row)) {  
                    const enemy = this.GetEnemy(_pieces);
                    const mustCapture = this.PlayerHasCapture(_pieces, enemy);
                    console.log("mustCapture:", mustCapture);

                    if(mustCapture) {
                        const captured = this.TryCapture(_col, _row, _pieces[this.seleted.i], enemy);
                        if(captured) { 
                            this.ResetSelected(); 
                            this.NextTurn(); 
                        }
                        // if capture failed — wrong destination clicked, do nothing
                    } else {
                        // No capture required — normal move through InBound
                        this.SetSeletedPiece(_row, _col, _pieces);
                        this.NextTurn();
                    }
                }
            } else { this.seletedCount++; }
                    
            this.renderKey++;
        },

        GetEnemy(_pieces){ return (_pieces == this.playerWhite) ? this.playerBlack : this.playerWhite; },

        SetSeletedPiece(_row, _col, _pieces){
            if (this.InBound(_col, _row, _pieces[this.seleted.i])) {
                _pieces[this.seleted.i].x = _col;
                _pieces[this.seleted.i].y = _row;

                console.log(_pieces[this.seleted.i].y);

                if(_pieces[this.seleted.i].y == 1 && this.currTurn == this.turn.WHITE || _pieces[this.seleted.i].y == 10 && this.currTurn == this.turn.BLACK){ _pieces[this.seleted.i].king = true; }
            }

            this.seletedCount = 0;
            this.seleted = { x: -1, y: -1, i: -1 };
        },

        PlayerHasCapture(_pieces, _enemyPieces) {
            for(let i = 0; i < _pieces.length; i++) {
                let piece = _pieces[i];
                console.log("checking piece:", piece.x, piece.y, "king:", piece.king);

                if(!piece.king) {
                    const dirs = [[2,2],[-2,2],[2,-2],[-2,-2]];
                    for(let d = 0; d < dirs.length; d++) {
                        let x = piece.x + dirs[d][0];
                        let y = piece.y + dirs[d][1];
                        if(this.CanCapture(x, y, piece, _enemyPieces) >= 0) return true;
                    }
                } else {
                    const dirs = [[1,1],[-1,1],[1,-1],[-1,-1]];
                    for(let d = 0; d < dirs.length; d++) {
                        let x = piece.x + dirs[d][0];
                        let y = piece.y + dirs[d][1];
                        let enemyFound = false;
                        let enemyIdx = -1;

                        while(this.InField(x, y)) {
                            // Check if enemy is here
                            let isEnemy = false;
                            for(let e = 0; e < _enemyPieces.length; e++) {
                                if(_enemyPieces[e].x === x && _enemyPieces[e].y === y) {
                                    isEnemy = true;
                                    enemyIdx = e;
                                    break;
                                }
                            }

                            // Check if friendly is here
                            let isFriendly = false;
                            for(let p of _pieces) {
                                if(p !== piece && p.x === x && p.y === y) {
                                    isFriendly = true;
                                    break;
                                }
                            }

                            if(isFriendly) break; // friendly always blocks

                            if(isEnemy) {
                                if(enemyFound) break; // second enemy — blocked
                                enemyFound = true;
                            } else if(enemyFound) {
                                // Empty square past an enemy — valid capture landing
                                return true;
                            }

                            x += dirs[d][0];
                            y += dirs[d][1];
                        }
                    }
                }
            }
            return false;
        },

        ResetSelected(){
            this.seletedCount = 0;
            this.seleted = {x:-1,y:-1,i:-1};
        },

        WhatIsSeleted(_row, _col, _pieces){ for(let i =0; i < _pieces.length; i++) { if(this.IsAt(_col, _row, _pieces[i])){ this.seleted.x = _col; this.seleted.y = _row; this.seleted.i = i; } } },

        GetColor(_row, _col) { return (_row == this.seleted.y && _col == this.seleted.x) ? "w-16 h-16 bg-blue border-4 border-blue" : ((_row + _col) % 2 === 0) ? "w-16 h-16 bg-white border-4 border-white" : "w-16 h-16 bg-black border-4 border-black"},

        GetPlayer(_row, _col, _black = false) { 
            if(!_black){ for (let i = 0; i < this.playerWhite.length; i++) { if(this.playerWhite[i].y == _row && this.playerWhite[i].x == _col){ if(this.playerWhite[i].king){return "Imgs/WhiteKing.png";} else {return "Imgs/White.png";} } } } 
            else { for (let i = 0; i < this.playerBlack.length; i++) { if(this.playerBlack[i].y == _row && this.playerBlack[i].x == _col){ this.seleted.x = 0; this.seleted.y = 0; if(this.playerBlack[i].king){return "Imgs/BlackKing.png";} else {return "Imgs/Black.png";} } } }
                
            return "";
        },

        WinStateFunc(){
            if(this.playerWhite.length < 1) { this.currWinState = this.winState.BLACK; this.popupTitle = "Player Black Won"; this.showPopup = true; this.popupMode = "win";}
            else if(this.playerBlack.length < 1) { this.currWinState = this.winState.WHITE; this.popupTitle = "Player White Won"; this.showPopup = true; this.popupMode = "win";}
            else if(!this.CanMove(this.playerWhite)) {this.currWinState = this.winState.BLACK; this.popupTitle = "Player Black Won"; this.showPopup = true; this.popupMode = "win";}
            else if(!this.CanMove(this.playerBlack)) {this.currWinState = this.winState.WHITE; this.popupTitle = "Player White Won"; this.showPopup = true; this.popupMode = "win";}
        },

        ReStart(){
            this.playerWhite = this.playerBackUp[0];
            this.playerBlack = this.playerBackUp[1];

            this.currTurn = this.turn.WHITE;

            this.popupTitle = "";
            this.showPopup = false;
        },

        GetTurn() { return (this.currTurn == this.turn.BLACK) ? "Black's Turn" : (this.currTurn == this.turn.WHITE) ? "White's Turn" : "None's Turn"; },

        NextTurn() {  this.currTurn = (this.currTurn == this.turn.BLACK) ? this.turn.WHITE : (this.currTurn == this.turn.WHITE) ? this.turn.BLACK : this.turn.WHITE;  },

        // for enemy is alweays white
        // for now only easy mode AI he dont care what you do but just random chose one fgor testing prosuses
        NPCTurn() {

            let captureMoves = [];
            let normalMoves = [];

            for (let i = 0; i < this.playerWhite.length; i++) {
                let p = this.playerWhite[i];

                // CAPTURES
                const dirs = [
                    [2, 2],
                    [-2, 2],
                    [2, -2],
                    [-2, -2]
                ];

                for (let d of dirs) {
                    let nx = p.x + d[0];
                    let ny = p.y + d[1];

                    if (this.CanCapture(nx, ny, p, this.playerBlack)) {
                        captureMoves.push({
                            piece: p,
                            oldI: i,
                            x: nx,
                            y: ny
                        });
                    }
                }

                // NORMAL MOVES
                const moveDirs = [
                    [1, 1],
                    [-1, 1]
                ];

                for (let d of moveDirs) {
                    let nx = p.x + d[0];
                    let ny = p.y + d[1];

                    if (this.InField(nx, ny) && this.IsStanding(nx, ny)) {
                        normalMoves.push({
                            piece: p,
                            oldI: i,
                            x: nx,
                            y: ny
                        });
                    }
                }
            }

            // MUST CAPTURE
            CanCapture = false;

            if (captureMoves.length > 0) {
                let move = captureMoves[Math.floor(Math.random() * captureMoves.length)];

                CanCapture = this.TryCapture(move.x, move.y, move.piece, this.playerBlack);
            }
            
            if (normalMoves.length > 0 && !CanCapture) {
                let move = normalMoves[Math.floor(Math.random() * normalMoves.length)];

                move.piece.x = move.x;
                move.piece.y = move.y;

                if(move.piece.y == 10){
                    move.piece.king = true;
                }
            }

            this.renderKey++;
            this.NextTurn();
        },

        IsAt(_x, _y, _player) { return _player.x === _x && _player.y === _y; },

        CanMove(_pieces){
            let enemys = this.GetEnemy(_pieces);

            for(let i =0; i < _pieces.length; i++){
                if(_pieces == this.playerBlack){
                    if(this.IsStanding(_pieces[i].x + 1, _pieces[i].y + 1) || this.IsStanding(_pieces[i].x - 1, _pieces[i].y + 1) || this.InField(_pieces[i].x + 1, _pieces[i].y + 1) || this.InField(_pieces[i].x - 1, _pieces[i].y + 1)){
                        console.log("Black Can move");
                        return true;
                    }
                }
                else if(_pieces == this.playerWhite){
                    if(this.IsStanding(_pieces[i].x + 1, _pieces[i].y - 1) || this.IsStanding(_pieces[i].x - 1, _pieces[i].y - 1) || this.InField(_pieces[i].x + 1, _pieces[i].y - 1) || this.InField(_pieces[i].x - 1, _pieces[i].y - 1)){
                        console.log("White Can move");
                        return true;
                    }
                }

                if(!this.CanCapture(_pieces[i].x + 2, _pieces[i].y + 2, _pieces[i], enemys) || !this.CanCapture(_pieces[i].x - 2, _pieces[i].y + 2, _pieces[i], enemys)|| !this.CanCapture(_pieces[i].x - 2, _pieces[i].y - 2, _pieces[i], enemys)|| !this.CanCapture(_pieces[i].x + 2, _pieces[i].y - 2, _pieces[i], enemys)){
                    console.log("Can Jump");
                    return true;
                }
            }

            return false;
        },

        IsStanding(_x, _y) { 
            for(let i = 0; i < this.playerBlack.length; i++) { if (this.playerBlack[i].y == _y && this.playerBlack[i].x == _x) { return false; } } 
            for(let i = 0; i < this.playerWhite.length; i++) { if (this.playerWhite[i].y == _y && this.playerWhite[i].x == _x) { return false; } } 

            return true;
        },

        InField(_x, _y) {  if (_y > this.size || _y < 1 || _x > this.size || _x < 1) { return false; } return true; },

        InBound(_x, _y, _player) { 
            if(_player.king) {
                if(!this.InField(_x, _y)) return false;
                if(!this.IsStanding(_x, _y)) return false;

                const dx = Math.sign(_x - _player.x);
                const dy = Math.sign(_y - _player.y);

                if(dx === 0 || dy === 0) return false;
                if(Math.abs(_x - _player.x) !== Math.abs(_y - _player.y)) return false;

                const friendly = this.playerWhite.some(p => p === _player)
                    ? this.playerWhite : this.playerBlack;

                let enemiesInPath = 0;
                let x = _player.x + dx;
                let y = _player.y + dy;

                while(x !== _x || y !== _y) {
                    // Friendly piece always blocks
                    for(let p of friendly) {
                        if(p.x === x && p.y === y) return false;
                    }
                    // Count enemies
                    if(!this.IsStanding(x, y)) enemiesInPath++;
                    // More than one enemy — blocked
                    if(enemiesInPath > 1) return false;

                    x += dx;
                    y += dy;
                }

                return true;
            }

            if(this.currTurn == this.turn.WHITE) { 
                if (_player.y - 1 == _y && (_player.x - 1 == _x || _player.x + 1 == _x)) return true; 
            } 
            else if(this.currTurn == this.turn.BLACK) { 
                if (_player.y + 1 == _y && (_player.x - 1 == _x || _player.x + 1 == _x)) return true; 
            }

            return false;
        },

       CanCapture(_col, _row, _piece, _enemyPieces) {
            if(!_piece.king) {
                const midX = (_piece.x + _col) / 2;
                const midY = (_piece.y + _row) / 2;

                if (Math.abs(_col - _piece.x) !== 2 || Math.abs(_row - _piece.y) !== 2) return -1;
                if (!this.InField(_col, _row)) return -1;
                if (!this.IsStanding(_col, _row)) return -1;

                for (let i = 0; i < _enemyPieces.length; i++) { 
                    if (_enemyPieces[i].x === midX && _enemyPieces[i].y === midY) return i; 
                }

                return -1;
            }

            // King
            const dx = Math.sign(_col - _piece.x);
            const dy = Math.sign(_row - _piece.y);

            if (dx === 0 || dy === 0) return -1;
            if (Math.abs(_col - _piece.x) !== Math.abs(_row - _piece.y)) return -1;
            if (!this.InField(_col, _row)) return -1;
            if (!this.IsStanding(_col, _row)) return -1;

            const isWhite = this.playerWhite.some(p => p === _piece);
            const friendly = isWhite ? this.playerWhite : this.playerBlack;

            let enemyIndex = -1;
            let x = _piece.x + dx;
            let y = _piece.y + dy;

            while (x !== _col || y !== _row) {
                // Friendly blocks completely
                for (let p of friendly) {
                    if (p.x === x && p.y === y) return -1;
                }

                // Enemy found
                for (let i = 0; i < _enemyPieces.length; i++) {
                    if (_enemyPieces[i].x === x && _enemyPieces[i].y === y) {
                        if (enemyIndex >= 0) return -1; // second enemy — blocked
                        enemyIndex = i;
                    }
                }

                x += dx;
                y += dy;
            }

            // Must have found exactly one enemy
            if (enemyIndex === -1) return -1;

            return enemyIndex;
        },

        TryCapture(_col, _row, _piece, _enemyPieces) {
            const index = this.CanCapture(_col, _row, _piece, _enemyPieces);
            console.log("TryCapture index:", index, "dest:", _col, _row, "piece:", _piece.x, _piece.y);
            
            if (index === -1) return false;
            console.log("Removing enemy:", _enemyPieces[index]);
            
            _enemyPieces.splice(index, 1);
            _piece.x = _col;
            _piece.y = _row;
            return true;
        },

        async SaveGame(){
            const DATA = {
                white: this.playerWhite,
                black: this.playerBlack,
                turn: this.currTurn
            };
            fetch("http://localhost:5157/api/match/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    seed: JSON.stringify(DATA),
                    password: this.savePass
                })
            })
            .then(res => res.json())
            .then(data => {
                this.gameId = data.id
                console.log("Saved ID:", data.id);
                this.renderKey++;
            });

            this.savePass = "";
            this.popupMode = "showId";
        },

        async LoadGame(){
            if (this.gameId == null || this.savePass == null) {
                alert("Enter ID and password");
                return; 
            }

            const response = await fetch(`http://localhost:5157/api/match/${this.gameId}/${this.savePass}`);

            if(!response.ok) { alert("Game not found"); return; }

            const data = await response.json();

            const seed = JSON.parse(data.seed); 

    this.playerWhite = seed.white;
    this.playerBlack = seed.black;
    this.currTurn = seed.turn;

    this.showSaveLoad = false;
    this.popupMode = "";
    this.showPopup = false;

    this.savePass = "";
    this.gameId = "";

    this.renderKey++;
        }
    }
}