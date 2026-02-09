let balance = 100.00;
let intellect = 1.00;
let portfolio = {}; // { ID: {qty: 0, avgCost: 0} }
let currentQ = {};

const market = [
    {id: 'CRSH', name: 'CRASH_SCOPE', price: 20},
    {id: 'WIKI', name: 'WIKI_INV', price: 45},
    {id: 'GLDB', name: 'GOLD_BULL', price: 15},
    {id: 'AITE', name: 'AI_TECH', price: 120},
    {id: 'TRDE', name: 'TRADE_X', price: 8}
];

// Matematik Soruları
function generateQuestion() {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 30) + 5;
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    currentQ = { q: `${a} ${op} ${b}`, a: eval(`${a} ${op} ${b}`) };
    document.getElementById('question-text').innerText = `Problem: ${currentQ.q} sonucu nedir?`;
}

function solve() {
    const userAns = parseFloat(document.getElementById('ans-input').value);
    if(userAns === currentQ.a) {
        intellect += 0.01;
        alert("Doğru! Yatırım aklınız arttı.");
        generateQuestion();
    } else {
        alert("Hatalı cevap.");
    }
    document.getElementById('ans-input').value = "";
}

function update() {
    const mBody = document.getElementById('market-body');
    const pBody = document.getElementById('portfolio-body');
    mBody.innerHTML = ""; pBody.innerHTML = "";
    let pTotalVal = 0;

    market.forEach(s => {
        // Fiyat hareketi zeka oranına (intellect) göre pozitif yöne meyillenir
        let bias = (intellect - 1) * 0.5;
        s.price += (Math.random() * 4 - (2 - bias));
        if(s.price < 0.1) s.price = 0.1;

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${s.id}</td><td>${s.price.toFixed(2)}</td><td>...</td><td><a onclick="buy('${s.id}', ${s.price})">[AL]</a></td>`;
        mBody.appendChild(tr);

        // Portföy Satırları
        if(portfolio[s.id] && portfolio[s.id].qty > 0) {
            let currentVal = portfolio[s.id].qty * s.price;
            let cost = portfolio[s.id].qty * portfolio[s.id].avgCost;
            let profit = currentVal - cost;
            pTotalVal += currentVal;

            const ptr = document.createElement('tr');
            ptr.innerHTML = `
                <td>${s.id}</td><td>${portfolio[s.id].qty}</td>
                <td>${portfolio[s.id].avgCost.toFixed(2)}</td>
                <td style="color:${profit >= 0 ? 'green':'red'}">${profit.toFixed(2)} $</td>
                <td><a onclick="sell('${s.id}', ${s.price})">[SAT]</a></td>
            `;
            pBody.appendChild(ptr);
        }
    });

    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('port-val').innerText = pTotalVal.toFixed(2);
    document.getElementById('intellect').innerText = intellect.toFixed(2);
}

function buy(id, price) {
    if(balance >= price) {
        balance -= price;
        if(!portfolio[id]) portfolio[id] = {qty: 0, avgCost: 0};
        let newQty = portfolio[id].qty + 1;
        portfolio[id].avgCost = ((portfolio[id].qty * portfolio[id].avgCost) + price) / newQty;
        portfolio[id].qty = newQty;
        update();
    }
}

function sell(id, price) {
    if(portfolio[id] && portfolio[id].qty > 0) {
        balance += price;
        portfolio[id].qty -= 1;
        update();
    }
}

function buyBroker(type) {
    let prices = {junior: 150, pro: 500, senior: 1200, ai: 5000};
    if(balance >= prices[type]) {
        balance -= prices[type];
        // Brokerlar zekayı otomatik artırmaya başlar (Basit mantık)
        setInterval(() => { intellect += 0.001; update(); }, 5000);
        alert(type + " işe alındı!");
    }
}

setInterval(update, 3000);
generateQuestion();
update();
