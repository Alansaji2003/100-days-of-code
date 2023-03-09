buttonColours = ["red", "blue", "green", "yellow"];
userClickedPattern = [];
gamePattern = [];
var randomNumber = 0;
var level = 0;
function nextSequence(){
     userClickedPattern = [];
     level++;
     $("h1").text("level "+level);
     randomNumber = Math.floor(Math.random() * 4);
     var randomChosenColor = buttonColours[randomNumber];
     gamePattern.push(randomChosenColor);
     $("#"+randomChosenColor).fadeOut().fadeIn();
     playSound(randomChosenColor);
     
     
     console.log(gamePattern)
    console.log(userClickedPattern)
}


$(".btn").click(function(e){
    
    var userChosenColor = $(this).attr("id");
    playSound(userChosenColor);
    animatePress(userChosenColor);
    userClickedPattern.push(userChosenColor);
    
    checkAnswer(userClickedPattern.length-1);
})

function playSound(name){
    var audio = new Audio("sounds/"+name+".mp3");
    audio.play();
}

function animatePress(currentColor){
    $("#"+currentColor).addClass("pressed")
    setTimeout(function(){
        $(".btn").removeClass("pressed")
    },100);
}

$("body").keypress(function(e){
    if(e.key === 'a' || e.key === 'A'){
        nextSequence();
        $("h1").text("level "+level);
    }
});

function checkAnswer(currentLevel){
    console.log(gamePattern)
    console.log(userClickedPattern)
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("success");
        if (userClickedPattern.length === gamePattern.length){
          setTimeout(function () {
            nextSequence();
          }, 1000);
        }
        
      } else {
        console.log("wrong");
        var audio2 = new Audio("sounds/wrong.mp3");
        audio2.play();
        $("h1").text("Game Over, Press A to restart");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },200)
        $(document).keypress(function(e){
            if(e.key === 'a' || e.key === 'A'){
                startOver();
            }
            
        });
        
      }
  
  }
function startOver(){
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    randomNumber = 0;
    $("h1").text("level "+level);
    nextSequence();
    
}