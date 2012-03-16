        /*
         *  Screen coordinates (y,x):
         *  
         *  0,0     0,2
         *      0,1     0,3
         *  1,0     1,2
         *      1,1     1,3
         *  
         *  
         *  World coordinates (y,x):
         *  
         *      3,-1     3,0
         *  2,-1     2,0     2,1
         *       1,0     1,1
         *  0,0      0,1     0,2
         *  
         */

        // screen coordinates of world origin (0,0) -> (y,x)
        var originscreen = [10, 10];

        // World to screen
        function wts(y,x) {
            return [originscreen[0] - Math.floor((y + (originscreen[1] + 1) % 2) / 2), originscreen[1] + 2 * x + y];
        }

        // Screen to world
        function stw(y, x) {
            var dy = originscreen[0] - y;
            var dx = x - originscreen[1];
            var c = (originscreen[1] + 1)%2;
            return [2 * dy + (1 + ys + xs + ys % 2) % 2 - c, Math.floor(dx / 2) - (dy - c * dx % 2)];
        }