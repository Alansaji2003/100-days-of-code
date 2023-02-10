var randomNumber1 = Math.floor(Math.random() * 6 + 1);
var dice = "images/dice"+randomNumber1+".png";
document.querySelector("img").setAttribute("src",dice);
var randomNumber2 = Math.floor(Math.random() * 6 + 1);
document.querySelector("img.img2").setAttribute("src", "images/dice"+randomNumber2+".png")
if (randomNumber1 > randomNumber2){
    document.querySelector("h1").innerHTML = "Player 1 Won";
} else if(randomNumber2 > randomNumber1){
    document.querySelector("h1").innerHTML = "Player 2 Won";
}else{
    document.querySelector("h1").innerHTML = "Draw";
}