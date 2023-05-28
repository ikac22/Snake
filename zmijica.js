$(document).ready(function(){    
    // tavle setup
    const CELL_DIM = 20

    //prva izmena
    let conf_str = localStorage.getItem("Config")
    let best_str = localStorage.getItem("Best")
    let pname = localStorage.getItem("Player")
    if(!pname || pname === ""){
        window.location.replace("zmijica-uputstvo.html")
    }

    let players_best = [];
    let best_arr = [];
    let player_index = 0;
    if (best_str){
        players_best = JSON.parse(best_str);
        for(player_index = 0; player_index < players_best.length; player_index++)
            if(players_best[player_index].key === pname){
                best_arr = players_best[player_index].value;
                break;
            }
    }

    if(player_index == players_best.length)
            players_best.push({
                value: [],
                key: pname,
                last: 0
            });
    

    //alert(JSON.stringify(players_best));

    let conf = null;
    if(conf_str)
        conf = JSON.parse(conf_str);
    else
        conf = {
            dim: 40,
            diff: "easy" 
        }
    
    

    let table = $("<table></table>").css({"width": conf.dim*CELL_DIM+"px", "height": conf.dim*CELL_DIM+"px"});  
    let colors = ["#0d1b2a", "#1b263b"]
    for(let i = 0; i < conf.dim; i++){
        let tr = $("<tr></tr>")
        for(let j = 0; j < conf.dim; j++){
            tr.append($("<td></td>").css({
                "width": CELL_DIM+"px",
                "height": CELL_DIM+"px",
                "background-color": colors[(i%2 + j) % 2] 
            }).attr("id", i+"_"+j).attr("type", "field"));
        }
        table.append(tr);
    }

    $(".table-content").append(table);

    // listener setup
    let keys = {
        up: 38,
        down: 40,
        left: 37,
        right: 39
    }
    let snake = {
        x: 0,
        y: 0,
        dir: keys.right,
        len: 1,
        tail_dir: keys.right,
        tail_dir_change: [],
        tail_x: 0,
        tail_y: 0,
        eaten: false,
    }
    let pressed = false;
    $(window).on({
        keydown: function(){

            if(!pressed) pressed = true; else return;
            if(event.which >=37 && event.which <= 40){
                //alert(event.which)
                snake.dir = event.which;
                let last = snake.tail_dir_change.slice(-1);

                snake.tail_dir_change.push({
                    x: snake.x,
                    y: snake.y,
                    dir: snake.dir
                });
            }

            pressed = false;
        },
        
    });

    // snake setup
    let score = 0;
    let best = 0;
    
    const SNAKE_COLOR = "#3a86ff"
    
    

    let handle = setInterval(move, 100);
    let handle1 = setInterval(spawnSuperFood, 10000);
    
    function paintHead(){
        let cell = $("#"+snake.x+"_"+snake.y);
        cell.css({
            "background-color": SNAKE_COLOR,
        }).attr("type","snake");

        // let cellt = $("#"+snake.tail_x+"_"+snake.tail_y);
        // cellt.css({
        //     "background-color": "red"
        // }).attr("type","snake");
    }

    function eraseTail(){
        let cell = $("#"+snake.tail_x+"_"+snake.tail_y);
        cell.css({
            "background-color": colors[(snake.tail_x%2 + snake.tail_y)%2]
        }).attr("type", "field");
    }

    function tailDirChange(){
        if(!snake.tail_dir_change.length) return;
        let field = snake.tail_dir_change[0];
        if(snake.tail_x == field.x && snake.tail_y == field.y){
            snake.tail_dir = field.dir;
            snake.tail_dir_change.shift();
        }
    }
    function spawnFood(){
        let randX = Math.floor(Math.random()*(conf.dim - 1));
        let randY = Math.floor(Math.random()*(conf.dim - 1)); 
        let cell = $("#"+randX+"_"+randY+"[type='field']");
        cell.attr("type", "food").append($("<span></span>").attr("class", "dot").css({
            "width": CELL_DIM - 10,
            "height": CELL_DIM -10
        }));
    }

    function spawnSuperFood(){
        let randX = Math.floor(Math.random()*conf.dim);
        let randY = Math.floor(Math.random()*conf.dim); 
        let cell = $("#"+randX+"_"+randY+"[type='field']");
        cell.attr("type", "super-food").append($("<span></span>").attr("class", "red-dot").css({
            "width": CELL_DIM - 5,
            "height": CELL_DIM -5
        }));
        setTimeout(eraseSuperFood, 3000);
    }

    function eraseSuperFood(){
        $("[type='super-food']").empty().attr("type", "field");
    }

    function eatFood(){
        let cell = $("#"+snake.x+"_"+snake.y);
        if(cell.attr("type") == "food"){
            cell.empty();
            spawnFood();
            snake.eaten = true;
            cell.attr("type", "snake");
            score+=1;
            $("#score").empty().text(score);
        }
        if(cell.attr("type") == "super-food"){
            cell.empty();
            snake.eaten = true;
            cell.attr("type", "snake");
            score+=10;
            $("#score").empty().text(score);
        }
        
    }

    function cmp(a, b){
        return a-b;
    }

    function addBest(){
        let i = 0;
        if(best_arr.length == 5){
            for(i = 0; i < best_arr.length; i++)
                if(best_arr[i] < score)
                    break;
            if(i == best_arr.length) return;
            else best_arr.shift();
        }

        best_arr.push(score);
        best_arr.sort(cmp);

        players_best[player_index].value = best_arr;
    }


    function die(){
        let cell = $("#"+snake.x+"_"+snake.y);
        if( (snake.x >= conf.dim || snake.x < 0) ||
            (snake.y >= conf.dim || snake.y < 0) ||
            (cell.attr("type") == "snake")  
        ){
            alert("Kraj igre!");
            clearInterval(handle);
            clearInterval(handle1);
            return true;
        }
        
        return false;
        
    }

    function updateBest(){
        let front_best = 0;
        if(best_arr.length != 0) 
            front_best = best_arr[best_arr.length-1];
        if(score > front_best)
            best = score;
        else
            best = front_best;
        $("#best").empty().text(best);
    }

    function move(){
        if(!snake.eaten){
            eraseTail();
            tailDirChange();
            switch(snake.tail_dir){
                case keys.down: snake.tail_x += 1; break;
                case keys.up: snake.tail_x-=1; break;
                case keys.left: snake.tail_y -= 1; break;
                case keys.right: snake.tail_y += 1; break;
            }
        }
        else
            snake.eaten = false;

        switch(snake.dir){
            case keys.down: snake.x += 1; break;
            case keys.up: snake.x-=1; break;
            case keys.left: snake.y -= 1; break;
            case keys.right: snake.y += 1; break;
        }
        if(!die()){
            eatFood();
            updateBest();
            paintHead();
        }
        else{
            addBest();
            players_best[player_index].last = score;
            localStorage.setItem("Best", 
                JSON.stringify(players_best)
            );
            window.location.replace("zmijica-uputstvo.html");
        }
    }
    
    spawnFood();
})
