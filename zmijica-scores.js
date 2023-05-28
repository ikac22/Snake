$(document).ready(function(){
    let players = localStorage.getItem("Best");
    if(players){
        players = JSON.parse(players);
        for(let i = 0; i < players.length; i++){
            tr = $("<tr></tr>");
            tr.append($("<td></td>").text(players[i].key));
            for(best of players[i].value.reverse())
                tr.append($("<td></td>").text(best));
            for(let j = players[i].value.length; j < 5; j++)
                tr.append($("<td></td>"));
            tr.append($("<td></td>").text(players[i].last));
            $("#table").append(tr);
        }
    }
});