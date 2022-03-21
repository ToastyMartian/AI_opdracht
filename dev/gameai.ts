/// <reference path="knight.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate

    public static depth: number = 5;
    public static moves: any = [];

    //Initiate MiniMax algorithm
    public static miniMax(king: King, knight: Knight, copyGameState: GameState, depth: number, minimizingPlayer: boolean, index: number): any {

        if (depth == 0 || copyGameState.getScore()[0] == 100 || copyGameState.getScore()[0] == -100) {

            return copyGameState.getScore()[0]

        }

        if (minimizingPlayer) {

            let minEvalu: any = +Infinity;

            knight.getMoves(copyGameState.knightPositions[index]).forEach(function (move: [number, number]) {

                let oldPos = copyGameState.knightPositions[index]

                copyGameState.knightPositions[index] = move;

                let evalu = GameAI.miniMax(king, knight, copyGameState, depth - 1, false, index)
                minEvalu = Math.min(minEvalu,evalu);

                //save all first possible moves a knight can make
                if(depth == GameAI.depth){
                    GameAI.moves.push([minEvalu,move,index])
                }

                copyGameState.knightPositions[index] = oldPos;
            })

            return minEvalu;

        } else {

            let maxEvalu: any = -Infinity;

            king.getMoves(copyGameState.kingPos).forEach(function (move: [number, number]) {

                let oldPos = copyGameState.kingPos
                copyGameState.kingPos = move;

                let evalu = GameAI.miniMax(king, knight, copyGameState, depth - 1, true, index)

                maxEvalu = Math.max(maxEvalu,evalu);

                copyGameState.kingPos = oldPos;

            })

            return maxEvalu;

        }
    }

    //Move knight based on best calculated move
    public static moveKnight(king: King, knights: Knight[], gameState: GameState) {

        let t0 = performance.now();

        for (let kn = 0; kn < knights.length; kn++) {

            this.miniMax(king, knights[kn], gameState.copy(), this.depth, true, kn);

        }

        //filter out a result with the highest value

        let result = [];

        for (let i = 0; i < this.moves.length; i++) {

            result.push(this.moves[i][0])
        }

        //find lowest result
        let maxValue = Math.min(...result);

        let indexMax = result.indexOf(maxValue);

        let bestMove = this.moves[indexMax]

        if(bestMove !== undefined) {

            knights[bestMove[2]].setPosition(bestMove[1]);
            gameState.knightPositions[bestMove[2]] = bestMove[1];
        }

        let t1 = performance.now();

        console.log("AI move took " + (t1 - t0) + " milliseconds.");

        //Clear movement array
        this.moves = [];
    }

}