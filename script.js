let balance = 100.00;
let intellect = 1.00;
let portfolio = {}; 
let activeBrokers = [];
let currentQ = {};

// Piyasa Verileri (10 Hisse)
const market = [
    {id: 'CRSH', name: 'CRASH_SCOPE', price: 20}, {id: 'WIKI', name: 'WIKI_INV', price: 45},
    {id: 'GLDB', name: 'GOLD_BULL', price: 15}, {id: 'AITE', name: 'AI_TECH', price: 120},
    {id: 'TRDE', name: 'TRADE_X', price: 8}, {id: 'ENER', name: 'PURE_ENERGY', price: 65},
    {id: 'AGRO', name: 'AGRO_CORP', price: 12}, {id: 'VOID', name: 'DARK_SPACE', price: 250},
    {id: 'CYBR', name: 'CYBER_SEC', price: 90}, {id: 'FLOW', name: 'LIQUID_FLOW', price: 30}
];

// Danışmanlar ve Güçleri
const shop = [
    {id: 'jr', name: 'Junior Broker', price: 150, boost: 0.001, tradePower: 0.1},
    {id: 'pro', name: 'Professional Broker', price: 600, boost: 0.003, tradePower: 0.3},
    {id: 'sr', name: 'Senior Broker', price: 1500, boost: 0.008, tradePower: 0.6},
    {id: 'mng', name: 'Portfolio Manager', price: 4000, boost: 0.02, tradePower: 1.2},
    {id: 'ai', name: 'AI Engine v1', price: 10000, boost: 0.05, tradePower: 3.0},
    {id: 'quant', name: 'Quant Algorithm', price: 25000, boost: 0.15, tradePower: 10.0}
];

// --- OTOMATİK TRADE SİSTEMİ ---
function autoTrade() {
    if (activeBrokers.length === 0) return;

    activeBrokers.forEach(broker => {
        // Her danışman için rastgele bir hisse seç
        const targetStock = market[Math.floor(Math.random() * market.length)];
        
        // ALIM KARARI: Fiyat düşükse ve nakit varsa (Zeka çarpanı alım ihtimalini artırır)
        let buySignal = Math.random() * intellect;
        if (buySignal > 1.2 && balance >= targetStock.price) {
            buy(targetStock.id, targetStock.price, true);
            console.log(`${broker.name} otomatik alım yaptı: ${targetStock.id}`);
        }

        // SATIŞ KARARI: Eldeki hisse kârdaysa
        if (portfolio[targetStock.id]?.qty > 0) {
            let profit = targetStock.price - portfolio[targetStock.id].avgCost;
            // Zeka arttıkça daha akıllıca satış yapar (zararına satma ihtimali düşer)
            if (profit > (5 / intellect) || profit > 10) { 
                sell(targetStock.id, targetStock.price, true);
                console.log(`${broker.name} otomatik satış yaptı: ${targetStock.id}`);
            }
        }
    });
}

// UI Güncelleme ve Piyasa Akışı
function updateUI() {
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

    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('port-val').innerText = pVal.toFixed(2);
    document.getElementById('intellect').innerText = intellect.toFixed(3);
    
    // Aktif Danışmanlar Listesi
    const activeList = document.getElementById('active-brokers-list');
    activeList.innerHTML = activeBrokers.length > 0 
        ? activeBrokers.map(b => `<li>${b.name} (Aktif İşlemde)</li>`).join("")
        : "<li>Henüz bir danışman yok.</li>";

    // Danışman Marketi (Fiyat kontrolü ile)
    const shopDiv = document.getElementById('broker-shop');
    shopDiv.innerHTML = "";
    shop.forEach(b => {
        shopDiv.innerHTML += `<div class="shop-item"><b>${b.name}</b><br>Maliyet: ${b.price} $<br><a onclick="buyBroker('${b.id}')">[Sözleşme İmzala]</a></div>`;
    });
}

function buy(id, price, auto = false) {
    if(balance >= price) {
        balance -= price;
        if(!portfolio[id]) portfolio[id] = {qty: 0, avgCost: 0};
        portfolio[id].avgCost = ((portfolio[id].qty * portfolio[id].avgCost) + price) / (portfolio[id].qty + 1);
        portfolio[id].qty++;
        if(!auto) updateUI();
    }
}

function sell(id, price, auto = false) {
    if(portfolio[id]?.qty > 0) {
        balance += price;
        portfolio[id].qty--;
        if(!auto) updateUI();
    }
}

function buyBroker(id) {
    const b = shop.find(x => x.id === id);
    if(balance >= b.price) {
        balance -= b.price;
        activeBrokers.push(b);
        // Zeka artış döngüsü
        setInterval(() => { intellect += b.boost; }, 5000);
        updateUI();
    }
}

// Döngüler
setInterval(updateUI, 3000);   // Borsa ve UI güncelleme
setInterval(autoTrade, 5000); // OTOMATİK TRADE (5 saniyede bir analiz)
generateQuestion();
updateUI();
