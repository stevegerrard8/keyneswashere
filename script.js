let balance = 1000.00; // Başlangıç parası biraz artırıldı
let intellect = 1.0000;
let pendingRent = 0.00;
let portfolio = {}; 
let activeBrokers = [];
let ownedAssets = {}; // Artık dinamik, mülk alana kadar boş.

// 50 Hisse
const stockPrefixes = ['USA', 'UK', 'TR', 'GER', 'JPN', 'FR', 'CHN', 'RU', 'IND', 'BRZ'];
const market = Array.from({ length: 50 }, (_, i) => ({
    id: stockPrefixes[i % 10] + (100 + i),
    price: Math.floor(Math.random() * 500) + 20
}));

// ÇOK DAHA FAZLA MÜLK (20+ Mülk)
const assetShop = [
    {id: 'a1', name: 'Arsa - Türkiye / Sakarya', price: 500, rent: 0.5},
    {id: 'a2', name: 'Apartman Dairesi - Londra / Soho', price: 4500, rent: 4.5},
    {id: 'a3', name: 'Dükkan - İstanbul / Nişantaşı', price: 8000, rent: 9.0},
    {id: 'a4', name: 'Villa - Miami / Beach Front', price: 15000, rent: 20.0},
    {id: 'a5', name: 'Çekici Filosu - Almanya', price: 2500, rent: 3.0},
    {id: 'a6', name: 'Bağ Evi - İtalya / Toskana', price: 3200, rent: 3.8},
    {id: 'a7', name: 'Rezidans - Dubai / Downtown', price: 12000, rent: 15.5},
    {id: 'a8', name: 'Ofis Katı - New York / Wall St.', price: 25000, rent: 35.0},
    {id: 'a9', name: 'Fabrika - Çin / Şangay', price: 50000, rent: 80.0},
    {id: 'a10', name: 'Lojistik Depo - Hollanda', price: 18000, rent: 22.0},
    {id: 'a11', name: 'Otoban Dinlenme Tesisi - TR', price: 11000, rent: 14.0},
    {id: 'a12', name: 'Maden Ocağı - Avustralya', price: 100000, rent: 250.0},
    {id: 'a13', name: 'Otel - İspanya / Ibiza', price: 75000, rent: 180.0},
    {id: 'a14', name: 'Yat Limanı - Yunanistan / Mykonos', price: 150000, rent: 400.0}
];

// GERÇEKÇİ DANIŞMAN LİSTESİ (15+ Uzman)
const brokers = [
    {id: 'b1', name: 'Stajyer Analist', price: 200, boost: 0.0004},
    {id: 'b2', name: 'Junior Portföy Yöneticisi', price: 1000, boost: 0.0015},
    {id: 'b3', name: 'Kıdemli Borsa Brokerı', price: 3500, boost: 0.0045},
    {id: 'b4', name: 'Gayrimenkul Yatırım Uzmanı', price: 5000, boost: 0.0070},
    {id: 'b5', name: 'Baş Ekonomist', price: 12000, boost: 0.0150},
    {id: 'b6', name: 'Algoritmik Trade Yazılımcısı', price: 25000, boost: 0.0400},
    {id: 'b7', name: 'Fon Yönetim Başkanı (CEO)', price: 75000, boost: 0.1200},
    {id: 'b8', name: 'Hedge Fund Stratejisti', price: 150000, boost: 0.3500},
    {id: 'b9', name: 'Yapay Zeka (Quant AI v4.0)', price: 500000, boost: 1.2000}
];

function updateUI() {
    let pVal = 0;
    const pBody = document.getElementById('portfolio-body');
    pBody.innerHTML = "";
    Object.keys(portfolio).forEach(id => {
        if(portfolio[id].qty > 0) {
            const s = market.find(x => x.id === id);
            let val = portfolio[id].qty * s.price;
            let profit = val - (portfolio[id].qty * portfolio[id].avgCost);
            pVal += val;
            pBody.innerHTML += `<tr><td>${id}</td><td>${portfolio[id].qty}</td><td class="${profit>=0?'profit':'loss'}">${profit.toFixed(2)}</td><td><a onclick="executeSell('${id}', ${s.price})">[S]</a></td></tr>`;
        }
    });

    const mBody = document.getElementById('market-body');
    mBody.innerHTML = "";
    market.forEach(s => {
        s.price += (Math.random() * 2 - 1); 
        if(s.price < 0.1) s.price = 0.1;
        mBody.innerHTML += `<tr><td><b>${s.id}</b></td><td>${s.price.toFixed(2)} $</td><td><a onclick="executeBuy('${s.id}', ${s.price})">[AL]</a></td></tr>`;
    });

    document.getElementById('broker-shop').innerHTML = brokers.map(b => `<div class="shop-item"><b>${b.name}</b> (${b.price}$)<br><a onclick="buyBroker('${b.id}')">[İşe Al]</a></div>`).join("");
    document.getElementById('asset-shop').innerHTML = assetShop.map(a => `<div class="shop-item"><b>${a.name}</b> (${a.price}$)<br>Getiri: ${a.rent}$/s <a onclick="buyAsset('${a.id}')">[Satın Al]</a></div>`).join("");

    // Sadece sahip olunan mülkleri listele (Kural 1)
    const assetStats = document.getElementById('asset-stats-body');
    assetStats.innerHTML = "";
    Object.keys(ownedAssets).forEach(key => {
        let def = assetShop.find(x => x.id === key);
        assetStats.innerHTML += `<tr><td>${def.name}</td><td>${ownedAssets[key]}</td><td>${(ownedAssets[key] * def.rent).toFixed(1)} $</td></tr>`;
    });

    document.getElementById('active-brokers-list').innerHTML = activeBrokers.map(b => `<li>• ${b.name}</li>`).join("");
    document.getElementById('balance').innerText = balance.toLocaleString(undefined, {minimumFractionDigits: 2});
    document.getElementById('port-val').innerText = pVal.toLocaleString(undefined, {minimumFractionDigits: 2});
    document.getElementById('total-net').innerText = (balance + pVal).toLocaleString(undefined, {minimumFractionDigits: 2});
    document.getElementById('pending-rent').innerText = pendingRent.toFixed(2);
    document.getElementById('intellect').innerText = intellect.toFixed(4);
    
    const now = new Date();
    document.getElementById('clock').innerText = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0') + ":" + now.getSeconds().toString().padStart(2, '0');
}

function processPassive() {
    Object.keys(ownedAssets).forEach(key => {
        let assetDef = assetShop.find(x => x.id === key);
        pendingRent += (ownedAssets[key] * assetDef.rent);
    });
    activeBrokers.forEach(b => intellect += b.boost);
    updateUI();
}

function collectRent() {
    balance += pendingRent;
    pendingRent = 0;
    updateUI();
}

function buyAsset(id) {
    let asset = assetShop.find(x => x.id === id);
    if(balance >= asset.price) {
        balance -= asset.price;
        ownedAssets[id] = (ownedAssets[id] || 0) + 1;
        updateUI();
    }
}

function buyBroker(id) {
    let b = brokers.find(x => x.id === id);
    if(balance >= b.price) {
        balance -= b.price;
        activeBrokers.push(b);
        updateUI();
    }
}

function executeBuy(id, price) {
    if(balance >= price) {
        balance -= price;
        if(!portfolio[id]) portfolio[id] = {qty: 0, avgCost: 0};
        portfolio[id].avgCost = ((portfolio[id].qty * portfolio[id].avgCost) + price) / (portfolio[id].qty + 1);
        portfolio[id].qty++;
        updateUI();
    }
}

function executeSell(id, price) {
    if(portfolio[id]?.qty > 0) {
        balance += price;
        portfolio[id].qty--;
        updateUI();
    }
}

setInterval(processPassive, 1000);
updateUI();
