

for(var i = 0; i<=6; i++){
    document.querySelectorAll("button")[i].addEventListener("click",function()  {
        
        buttonInnerHtml = this.innerHTML;
        makeSound(buttonInnerHtml);
        animation(buttonInnerHtml);
        
    });
}   



document.addEventListener("keydown", function(event){  //here we listen to keybord keypress, the 'event' inside the function has many properties, one is key
    makeSound(event.key);
    animation(event.key);
})


function makeSound(key){
    switch (key) {
        case "w":
            var audio = new Audio('sounds/crash.mp3');
            audio.play();
            break;
        case "a":
            var audio = new Audio('sounds/kick-bass.mp3');
            audio.play();
            break;
        case "s":
            var audio = new Audio('sounds/snare.mp3');
            audio.play();
            break;
        case "d":
            var audio = new Audio('sounds/tom-1.mp3');
            audio.play();
            break;
        case "j":
            var audio = new Audio('sounds/tom-2.mp3');
            audio.play();
            break;
        case "k":
            var audio = new Audio('sounds/tom-3.mp3');
            audio.play();
            break;
        case "l":
            var audio = new Audio('sounds/tom-4.mp3');
            audio.play();
            break;

        default:
            break;
}
}
function animation(key){
    var currentButton = document.querySelector("."+key);
    currentButton.setAttribute("class", key+" drum pressed");
    setTimeout(function(){
        currentButton.setAttribute("class", key+" drum");
    },100)
}
// //object creation using constructor function
// function Myobject(name, age, work, regno){
//     this.name = name;
//     this.age = age;
//     this.work = work;
//     this.register = regno;
// }

// var myobject = new Myobject("Alan", 20, "sweeper", "21BCG10140");
// console.log(myobject.name);
