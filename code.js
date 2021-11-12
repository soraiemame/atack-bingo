const N = 4;
let op = [[],[],[],[]];
let tr = []; // カード中でa[i]となっている要素は実はi
let inv_tr = []; // 実はiの要素はカード中ではinv[i]

let memo = [[],[]];
let ps = [];

let T = -1;
let evaled = document.querySelector("#eval");

function read_cards() {
    console.log(T);
    // doc.length === 32
    var doc = document.querySelectorAll("input");
    var a = [],b = [];

    for(let i = 0;i < 32;i++){
        let v = doc[i].value;
        if(v === ""){
            alert("Please input all the numbers.");
            return false;
        }
        if(v.match(/\D/)){
            alert("Please input numbers.");
            return false;
        }
        v = parseInt(v);
        if(i < 16)a.push(v);
        else b.push(v);
    }
    // is 0~15
    let aa = [],bb = [];
    for(let i = 0;i < 16;i++){
        aa[i] = 0;
        bb[i] = 0;
    }
    for(let i = 0;i < 16;i++){
        if(a[i] < 0 || 16 <= a[i] || b[i] < 0 || 16 <= b[i]){
            alert("Please input integers that is in [0,16).");
            return false;
        }
        aa[a[i]] = 1;
        bb[b[i]] = 1;
    }
    for(let i = 0;i < 16;i++){
        if(aa[i] === 0 || bb[i] === 0){
            alert("Please input unique integers.");
            return false;
        }
    }
    
    if(T === 1)[a,b] = [b,a];
    for(let i = 0;i < 16;i++)tr[a[i]] = i;
    for(let i = 0;i < 4;i++){
        for(let j = 0;j < 4;j++){
            op[i][j] = tr[b[i * 4 + j]];
            ps[op[i][j]] = [i,j];
        }
    }
    for(let i = 0;i < 16;i++)inv_tr[tr[i]] = i;
    // if(T === 1){
    //     for(let i = 0;i < 16;i++)[doc[i],doc[i + 16]] = [doc[i + 16],doc[i]];
    // }
    console.log(op);
    return true;
}

function to_button() {
    var td = document.querySelectorAll("td");
    var ip = document.querySelectorAll("input");
    for(let i = 0;i < 32;i++){
        td[i].innerHTML = `<button class="card-squares" onclick="player(${parseInt(ip[i].value)})">${ip[i].value}</button>`
    }
}

function fill_random() {
    var doc = document.querySelectorAll("input");
    let a = [],b = [];
    for(let i = 0;i < 16;i++){
        a[i] = i;
        b[i] = i;
    }
    for(let temp = 0;temp < 2;temp++){
        for(let i = 0;i < 16;i++){
            let j = Math.floor(Math.random() * 16);
            [a[i],a[j]] = [a[j],a[i]];
            j = Math.floor(Math.random() * 16);
            [b[i],b[j]] = [b[j],b[i]];
        }
    }
    for(let i = 0;i < 16;i++)doc[i].value = String(a[i]);
    for(let i = 0;i < 16;i++)doc[i + 16].value = String(b[i]);
}

class Game{
    constructor() {
        this.t = 0;
        this.A = 0;
        this.B = 0;
    }
    get(ab,x,y) {
        return (ab ? this.B : this.A) >> (x * N + y) & 1;
    }
    set(ab,x,y,b) {
        let c = x * N + y;
        if(!ab)this.A = b ? (this.A | (1 << c)) : (this.A & ~(1 << c));
        else this.B = b ? (this.B | (1 << c)) : (this.B & ~(1 << c));
    }
    win() {
        let a = false,b = false;
        let ok;
        for(let i = 0;i < N;i++){
            ok = 1;
            for(let j = 0;j < N;j++)if(this.get(0,i,j) != 1)ok = 0;
            if(ok)a = 1;
        }
        for(let i = 0;i < N;i++){
            ok = 1;
            for(let j = 0;j < N;j++)if(this.get(0,j,i) != 1)ok = 0;
            if(ok)a = 1;
        }
        ok = 1;
        for(let i = 0;i < N;i++)if(this.get(0,i,i) != 1)ok = 0;
        if(ok)a = 1;
        ok = 1;
        for(let i = 0;i < N;i++)if(this.get(0,i,N - i - 1) != 1)ok = 0;
        if(ok)a = 1;

        for(let i = 0;i < N;i++){
            ok = 1;
            for(let j = 0;j < N;j++)if(this.get(1,i,j) != 1)ok = 0;
            if(ok)b = 1;
        }
        for(let i = 0;i < N;i++){
            ok = 1;
            for(let j = 0;j < N;j++)if(this.get(1,j,i) != 1)ok = 0;
            if(ok)b = 1;
        }
        ok = 1;
        for(let i = 0;i < N;i++)if(this.get(1,i,i) != 1)ok = 0;
        if(ok)b = 1;
        ok = 1;
        for(let i = 0;i < N;i++)if(this.get(1,i,N - i - 1) != 1)ok = 0;
        if(ok)b = 1;

        if(a && b)return this.t;
        else if(a)return 1;
        else if(b)return 0;
        else return -1;
    }
};

let g = new Game();

function rec() {
    if(memo[g.t][g.A] != -1)return memo[g.t][g.A];
    let res = 1 - g.t
    let w = g.win();
    if(w == g.t)res = g.t;
    else if(w == 1 - g.t)res = 1 - g.t;
    else{
        for(let i = 0;i < N;i++){
            for(let j = 0;j < N;j++){
                if(g.get(0,i,j) == 0){

                    // auto [x,y] = ps[i * N + j];
                    let x,y;
                    [x,y] = ps[i * N + j];
                    g.set(0,i,j,1);
                    g.set(1,x,y,1);
                    g.t = 1 - g.t;
                    w = g.win();
                    let rg = rec();
                    g.set(0,i,j,0);
                    g.set(1,x,y,0);
                    g.t = 1 - g.t;
                    if(w == g.t || rg == g.t){
                        res = g.t;
                        break;
                    }
                }
            }
            if(res == g.t)break;
        }
    }
    return memo[g.t][g.A] = res;
}

function nxt() {
    let w;
    let d = -1;
    for(let i = 0;i < N;i++){
        for(let j = 0;j < N;j++){
            if(g.get(0,i,j) == 0){
                let x,y;
                [x,y] = ps[i * N + j];
                g.set(0,i,j,1);
                g.set(1,x,y,1);
                g.t = 1 - g.t;
                w = g.win();
                let rg = rec();
                g.set(0,i,j,0);
                g.set(1,x,y,0);
                g.t = 1 - g.t;
                if(w === g.t || rg === g.t){
                    return [i * N + j,1];
                }
                else if(w !== 1 - g.t || d === -1)d = i * N + j;
            }
        }
    }
    return [d,0];
}

function put(n) {
    console.log(`put: ${n}`);
    inv = inv_tr[n];
    let x,y;
    [x,y] = ps[n];
    // g.set(0,Math.floor(inv / N),inv % N,1);
    g.set(0,Math.floor(n / N),n % N,1);
    g.set(1,x,y,1);
    var doc = document.querySelectorAll("button");
    doc[n + (T === 1 ? 16 : 0)].classList.add("active");
    doc[x * N + y + (T === 0 ? 16 : 0)].classList.add("active");
}

function cpu() {
    let n,b;
    [n,b] = nxt();
    console.log(`cpu play: ${n}(${inv_tr[n]}) ${b}`);
    put(n);
    g.t = 1 - g.t;
    evaled.innerHTML = ["player may win","computer will win"][b];
    if(g.win() === 1 - T){
        alert("You Lose!");
        evaled.innerHTML = "You Lose!";
    }
    else if(g.win() === T){
        alert("You Win!");
        evaled.innerHTML = "You Win!";
    }
}

function player(n) {
    console.log(`player: ${n}`);
    let a = Math.floor(tr[n] / N),b = tr[n] % N;
    if(g.get(0,a,b) === 1) {
        alert("That square has already marked!");
        return;
    }
    put(tr[n]);
    g.t = 1 - g.t;
    if(g.win() === T){
        alert("You Win!");
        return;
    }
    else if(g.win() === 1 - T){
        alert("You Lose!");
        return;
    }
    cpu();
}

function ready(turn) {
    T = turn;
    now_T = turn;
    let ok = read_cards();
    if(!ok)return;
    for(let i = 0;i < (1 << (N * N));i++){
        memo[0][i] = -1;
        memo[1][i] = -1;
    }
    evaled.innertHTML = rec(g) === T ? "Player may win" : "Computer will win";
    console.log(rec(g));
    to_button();
    if(T === 1)cpu();
}
