let balance = 100.00;
let intellect = 1.00;
let portfolio = {}; // { ID: {qty: 0, avgCost: 0} }
let currentQ = {};

const market = [
    {id: 'CRSH', name: 'CRASH_SCOPE', price: 20.00},
    {id: 'WIKI', name: 'WIKI_INV', price: 45.00},
    {id: 'GLDB', name: 'GOLD_BULL', price: 15.00},
    {id: 'AITE', name: 'AI_TECH', price: 120.00},
    {id: 'TRDE', name: 'TRADE_X', price: 8.00}
];

// Matematik Problemleri (Zeka Artışı İçin)
function generateQuestion() {
    const a = Math.floor(Math.random() * 80) + 20;
    const b = Math.floor(Math.random() * 50) + 10;
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let result = eval(`${a} ${op} ${b}`);
    currentQ = { q: `${a} ${op === '*' ? 'x' : op} ${b}`, a: result };
    document.getElementById('question-text').innerText = `Veri Analiz Problemi: ${currentQ.q} = ?`;
}

function solve() {
    const userAns = parseFloat(document.getElementById('ans-input').value);
    if(userAns === currentQ.a) {
        intellect += 0.01;
        alert("Doğrulandı. Yatırım aklı yükseltildi.");
        generateQuestion();
    } else {
        alert("Hatalı veri girişi.");
    }
    document.getElementById('ans-input').value = "";
    updateUI();
}

function updateUI() {
    const mBody = document.getElementById('market-body');
    const pBody = document.getElementById('portfolio-body');
    mBody.innerHTML = ""; 
    pBody.innerHTML = "";
    let pTotalVal = 0;

    market.forEach(s => {
        // Borsa Hareketi: Zeka (Intellect) arttıkça fiyatların artma olasılığı yükselir
        let bias = (intellect - 1) * 0.4; 
        s.price += (Math.random() * 6 - (3 - bias));
        if(s.price < 0.1) s.price = 0.1;

        // Market Tablosu
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>${s.id}</b></td>
            <td>${s.price.toFixed(2)} $</td>
            <td>...</td>
            <td><a onclick="buy('${s.id}', ${s.price})">[HİSSE AL]</a></td>
        `;
        mBody.appendChild(tr);

        // Portföy Tablosu (Sadece sahip olunan hisseler)
        if(portfolio[s.id] && portfolio[s.id].qty > 0) {
            let currentVal = portfolio[s.id].qty * s.price;
            let cost = portfolio[s.id].qty * portfolio[s.id].avgCost;
            let profit = currentVal - cost;
            pTotalVal += currentVal;

            const ptr = document.createElement('tr');
            ptr.innerHTML = `
                <td>${s.id}</td>
                <td>${portfolio[s.id].qty}</td>
                <td>${portfolio[s.id].avgCost.toFixed(2)}</td>
                <td class="${profit >= 0 ? 'profit' : 'loss'}">${profit.toFixed(2)} $</td>
                <td><a onclick="sell('${s.id}', ${s.price})">[NAKDE ÇEVİR]</a></td>
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
        updateUI();
    } else {
        alert("Nakit yetersiz. Broker almak veya yeni hisse için hisse satmalısınız.");
    }
}

function sell(id, price) {
    if(portfolio[id] && portfolio[id].qty > 0) {
        balance += price; // Hisse satıldığında para NAKİT kısmına (balance) gelir.
        portfolio[id].qty -= 1;
        updateUI();
    }
}

function buyBroker(type) {
    let prices = {junior: 150, pro: 500, senior: 1200, ai: 5000};
    if(balance >= prices[type]) {
        balance -= prices[type];
        // Brokerlar zekayı (intellect) arka planda pasif artırır.
        setInterval(() => { 
            intellect += (type === 'ai' ? 0.005 : 0.001); 
            updateUI(); 
        }, 4000);
        alert(type.toUpperCase() + " aktif edildi. Zeka artışı sağlandı.");
    } else {
        alert("Nakit yetersiz. Mevcut hisselerinizden bir kısmını nakde çevirmelisiniz.");
    }
}

setInterval(updateUI, 3000);
generateQuestion();
updateUI();
