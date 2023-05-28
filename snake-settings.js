$(document).ready(function(){
    
    let conf_str = localStorage.getItem("Config")
    let pname = localStorage.getItem("Player")

    if(conf_str){
        conf = JSON.parse(conf_str)
        $("#dimension").val(conf.dim);
        $("#difficulty").val(conf.diff);
        updateSliderVal();
    }

    if(pname){
        $("#player-name").val(pname);
    }
    

    function updateSliderVal(){
        $("#val-show").text($("#dimension").val());
    }
    function loadInStorage(){
        let conf = {
            dim: $("#dimension").val(),
            diff: $("#difficulty").val()
        }
    
        localStorage.setItem("Config", JSON.stringify(conf));
    }

    $("#play-btn").on({
            click: () => {
                let pname = $("#player-name").val().trim();
                if(pname != ""){
                    localStorage.setItem("Player", pname);
                    loadInStorage();
                    window.location.replace("snake-game.html")
                }   
                else{
                    alert("Please fill in your name!");
                }
            }
        }
    )

    $("#dimension").change(function(){
        updateSliderVal();
    });

    updateSliderVal();
    // alert("Majmunee");
})