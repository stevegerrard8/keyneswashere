let balance = 100.00;
let intellect = 1.00;
let portfolio = {};
let activeBrokers = [];
let currentQ = {};

// 10 Farklı Hisse Senedi
const market = [
    {id: 'CRSH', name: 'CRASH_SCOPE', price: 20}, {id: 'WIKI', name: 'WIKI_INV', price: 45},
    {id: 'GLDB', name: 'GOLD_BULL', price: 15}, {id: 'AITE', name: 'AI_TECH', price: 120},
    {id: 'TRDE', name: 'TRADE_X', price: 8}, {id: 'ENER', name: 'PURE_ENERGY', price: 65},
    {id: 'AGRO', name: 'AGRO_CORP', price: 12}, {id: 'VOID', name: 'DARK_SPACE', price: 250},
    {id: 'CYBR', name: 'CYBER_SEC', price: 90}, {id: 'FLOW', name: 'LIQUID_FLOW', price: 30}
];

// 6 Farklı Danışman
const shop = [
    {id: 'jr', name: 'Junior Broker', price: 150, boost: 0.001},
    {id: 'pro', name: 'Professional Broker', price: 600, boost: 0.003},
    {id: 'sr', name: 'Senior Broker', price: 1500, boost: 0.008},
    {id: 'mng', name: 'Portfolio Manager', price: 4000, boost: 0.02},
    {id: 'ai', name: 'AI Engine v1', price: 10000, boost: 0.05},
    {id: 'quant', name: 'Quant Algorithm', price: 25000, boost: 0.15}
];

// Çeşitlendirilmiş Matematik Soruları
function generateQuestion() {
    const type = Math.floor(Math.random() * 3); // 0: Dört işlem, 1: Kare/Küp, 2: Denklem
    let a = Math.floor(Math.random() * 50) + 1;
    let b = Math.floor(Math.random() * 20) + 1;
    
    if (type === 0) {
        const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        currentQ = { q: `${a} ${op === '*' ? 'x' : op} ${b}`, a: eval(`${a} ${op} ${b}`) };
    } else if (type === 1) {
        currentQ = { q: `${a} sayısının karesi`, a: a * a };
    } else {
        let x = Math.floor(Math.random() * 10) + 1;
        currentQ = { q: `${a} + x = ${a + x} ise x`, a: x };
    }
    document.getElementById('question-text').innerText = `Problem: ${currentQ.q} = ?`;
}

function solve() {
    const ans = parseFloat(document.getElementById('ans-input').value);
    if(ans === currentQ.a) {
        intellect += 0.02;
        generateQuestion();
    }
    document.getElementById('ans-input').value = "";
    updateUI();
}

function updateUI() {
    // Market ve Portföy Tabloları
    const mBody = document.getElementById('market-body');
    const pBody = document.getElementById('portfolio-body');
    mBody.innerHTML = ""; pBody.innerHTML = "";
    let pVal = 0;

    market.forEach(s => {
        let bias = (intellect - 1) * 0.5;
        s.price += (Math.random() * 6 - (3 - bias));
        if(s.price < 0.1) s.price = 0.1;

        mBody.innerHTML += `<tr><td><b>${s.id}</b></td><td>${s.price.toFixed(2)} $</td><td>...</td><td><a onclick="buy('${s.id}', ${s.price})">[AL]</a></td></tr>`;

        if(portfolio[s.id]?.qty > 0) {
            let val = portfolio[s.id].qty * s.price;
            let profit = val - (portfolio[s.id].qty * portfolio[s.id].avgCost);
            pVal += val;
            pBody.innerHTML += `<tr><td>${s.id}</td><td>${portfolio[s.id].qty}</td><td>${portfolio[s.id].avgCost.toFixed(2)}</td><td style="color:${profit>=0?'green':'red'}">${profit.toFixed(2)} $</td><td><a onclick="sell('${s.id}', ${s.price})">[SAT]</a></td></tr>`;
        }
    });

    // Danışman Marketi ve Aktif Liste
    const shopDiv = document.getElementById('broker-shop');
    shopDiv.innerHTML = "";
    shop.forEach(b => {
        shopDiv.innerHTML += `<div class="shop-item"><b>${b.name}</b><br>Maliyet: ${b.price} $<br><a onclick="buyBroker('${b.id}')">[Satın Al]</a></div>`;
    });

    const activeList = document.getElementById('active-brokers-list');
    if(activeBrokers.length > 0) {
        activeList.innerHTML = activeBrokers.map(b => `<li>${b.name} (+%${(b.boost*100).toFixed(3)} hız)</li>`).join("");
    }

    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('port-val').innerText = pVal.toFixed(2);
    document.getElementById('intellect').innerText = intellect.toFixed(3);
}

function buy(id, price) {
    if(balance >= price) {
        balance -= price;
        if(!portfolio[id]) portfolio[id] = {qty: 0, avgCost: 0};
        portfolio[id].avgCost = ((portfolio[id].qty * portfolio[id].avgCost) + price) / (portfolio[id].qty + 1);
        portfolio[id].qty++;
        updateUI();
    }
}

function sell(id, price) {
    if(portfolio[id]?.qty > 0) {
        balance += price;
        portfolio[id].qty--;
        updateUI();
    }
}

function buyBroker(id) {
    const b = shop.find(x => x.id === id);
    if(balance >= b.price) {
        balance -= b.price;
        activeBrokers.push(b);
        // Zeka artış döngüsünü başlat
        setInterval(() => { intellect += b.boost; updateUI(); }, 5000);
        updateUI();
    }
}

setInterval(updateUI, 3000);
generateQuestion();
updateUI();
