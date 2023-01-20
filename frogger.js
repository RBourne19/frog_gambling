class Frog{
    constructor(id, amount){
        this.id = id;
        this.amount = amount;
    }
}
class Player{
    constructor(total, bet, winnings){
        this.total = total;
        this.bet = bet;
        this.winnings = winnings;
    }
}

let previd = null;
let p1 = new Player(1000, 0, 0);
let inactive = new Map();
let active = new Map();


function on_load(){
    console.log("LOADED");
    for(let i = 1; i <= 25; i ++){
        let frog = new Frog(i, 0);
        inactive.set(i, frog);
    }
    
}
function start(){
    document.getElementById("winstate").innerText = "Pick a frog, any frog!";
    p1.bet = document.getElementById("bet").value;
    
    if(p1.bet > p1.total || p1.total <= 0 || p1.bet <= 0){
        alert("INSUFFICIENT FUNDS OR VALUE");
        return;
    }
    playAudio('sounds/bet.wav');
   
    p1.total -= p1.bet;
    let obj = document.getElementById("total");
    animateValue(obj, p1.total);
    populate();
    
}
function populate(){
    previd = null;
    for(let i = 1; i <= 25; i++){
        active.set(i, p1.bet/10);
        let tile = document.getElementById(i);
        let frog_img = tile.children[0].children[1];
        const money_doc = tile.children[0].children[0];
        frog_img.src = "images/frog_idle.gif";
        money_doc.innerText = "";
    }
    for(i = 0; i < 3; i++){
        let pick = Math.floor(Math.random()*25) + 1;
        if(active.get(pick) != 0){
            active.set(pick, p1.bet/5);
        }
        else{
            i--;
        }
        
    }
    for(i = 0; i < 2; i++){
        let pick = Math.floor(Math.random()*25) + 1;
        if(active.get(pick) != 0){
            active.set(pick, p1.bet/2);
        }
        else{
            i--;
        }
        
    }
    inactive.clear();
    for(i = 0; i < 3; i++){
        let pick = Math.floor(Math.random()*25) + 1;
        if(active.get(pick) != 0){
            active.set(pick, 0);
        }
        else{
            i--;
        }
        
    }
    p1.bet = 0;
}
function end(){
    document.getElementById("winstate").innerText = "Bet to play again!";
    p1.total += p1.winnings;
    if(p1.winnings > 0){
        playAudio('sounds/win.wav');   
    }
    let obj = document.getElementById("total");
    animateValue(obj, p1.total);
    p1.winnings = 0; 
    obj = document.getElementById("winnings");
    animateValue(obj, 0);
    for(let i = 1; i <= 25; i ++){
        let frog = new Frog(i, 0);
        inactive.set(i, frog);

    }
}

function flip(id){
    id = parseInt(id);
    if(inactive.has(id)){
        return;
    }

    let tile = document.getElementById(id);
    let frog_img = tile.children[0].children[1];
    let money_doc = tile.children[0].children[0];
    const money = active.get(id);
    let winning_box = document.getElementById("winnings");

    if(previd != null){
        let prev_tile = document.getElementById(previd);
        let prev_frog_img = prev_tile.children[0].children[1];
        prev_frog_img.src = "";
    }
    if(money !== 0){
        frog_img.src = "images/frog_destroy.gif";
        inactive.set(id, active.get(id));
        active.delete(id);

        money_doc.innerText = money;
        playAudio('sounds/coin_win.wav');
        p1.winnings += money;
        animateValue(winning_box, p1.winnings);

        previd = id;
    } else{
        frog_img.src = "images/red_frog.gif";
        p1.winnings = 0;
        animateValue(winning_box, p1.winnings);
        playAudio('sounds/frog_lose.wav');
        end();
        return;
    }
    

}

function animateValue(obj, end) {
    let duration = 1000;
    let start = parseInt(obj.innerHTML);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

function playAudio(file_name){
    let audio = new Audio(file_name);

        audio.volume = 0.3;
        audio.play();
}