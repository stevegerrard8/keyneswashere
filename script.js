// --- BAŞLANGIÇ VERİLERİ ---
let balance = 100.00;
let intellect = 1.0000;
let pendingRent = 0.00;
let portfolio = {}; 
let activeBrokers = [];
let ownedAssets = { arsa: 0, ev: 0, dükkan: 0, çekici: 0 };

// 50 Adet Otomatik Hisse Üretimi
const stockPrefixes = ['TCK', 'MNG', 'VST', 'KCH', 'SAB', 'THY', 'ASE', 'ERE', 'PET', 'TUP'];
const market = Array.from({ length: 50 }, (_, i) => ({
    id: stockPrefixes[i % 10] + (100 + i),
    price: Math.floor(Math.random() * 200) + 10
}));

const brokers = [
    {id: 'jr', name: 'Junior Broker', price: 150, boost: 0.0005},
    {id: 'pro', name: 'Professional Broker', price: 800, boost: 0.0020},
    {id: 'sr', name: 'Senior Broker', price: 2500, boost: 0.0060},
    {id: 'ai', name: 'Quant AI v1', price: 12000, boost: 0.0250}
];

const assetShop = [
    {id: 'arsa', name: 'Arsa', price: 500, rent: 0.4},
    {id: 'ev', name: 'Müstakil Ev', price: 2500, rent: 2.5},
    {id: 'dükkan', name: 'Ticari Dükkan', price: 7500, rent: 9.0},
    {id: 'çekici', name: 'Lojistik Çekici', price: 1500, rent: 1.2}
];

// --- UI GÜNCELLEME ---
function updateUI() {
    // 1. Nakit ve Portföy Analizi
    let pVal = 0;
    const pBody = document.getElementById('portfolio-body');
    pBody.innerHTML = "";
    Object.keys(portfolio).forEach(id => {
        if(portfolio[id].qty > 0) {
            const s = market.find(x => x.id === id);
            let val = portfolio[id].qty * s.price;
            let profit = val - (portfolio[id].qty * portfolio[id].avgCost);
            pVal += val;
            pBody.innerHTML += `<tr><td>${id}</td><td>${portfolio[id].qty}</td><td>${portfolio[id].avgCost.toFixed(2)}</td><td class="${profit>=0?'profit':'loss'}">${profit.toFixed(2)}</td><td><a onclick="executeSell('${id}', ${s.price})">[SAT]</a></td></tr>`;
        }
    });

    // 2. 50 Hisse - Piyasa Tablosu
    const mBody = document.getElementById('market-body');
    mBody.innerHTML = "";
    market.forEach(s => {
        s.price += (Math.random() * 1 - 0.5); 
        if(s.price < 0.1) s.price = 0.1;
        mBody.innerHTML += `<tr><td><b>${s.id}</b></td><td>${s.price.toFixed(2)} $</td><td><a onclick="executeBuy('${s.id}', ${s.price})">[AL]</a></td></tr>`;
    });

    // 3. Market Panelleri
    document.getElementById('broker-shop').innerHTML = brokers.map(b => `<div class="shop-item"><b>${b.name}</b> (${b.price}$)<br><a onclick="buyBroker('${b.id}')">[Sözleşme İmzala]</a></div>`).join("");
    document.getElementById('asset-shop').innerHTML = assetShop.map(a => `<div class="shop-item"><b>${a.name}</b> (${a.price}$)<br>Getiri: ${a.rent}$/s <a onclick="buyAsset('${a.id}')">[Satın Al]</a></div>`).join("");

    // 4. Varlık İstatistikleri
    document.getElementById('asset-stats-body').innerHTML = Object.keys(ownedAssets).map(key => {
        let def = assetShop.find(x => x.id === key);
        return `<tr><td>${def.name}</td><td>${ownedAssets[key]}</td><td>${(ownedAssets[key] * def.rent).toFixed(1)} $</td></tr>`;
    }).join("");

    // 5. Durum Çubuğu
    document.getElementById('active-brokers-list').innerHTML = activeBrokers.map(b => `<li>• ${b.name} (Zeka +${(b.boost*100).toFixed(3)})</li>`).join("");
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('port-val').innerText = pVal.toFixed(2);
    document.getElementById('total-net').innerText = (balance + pVal).toFixed(2);
    document.getElementById('pending-rent').innerText = pendingRent.toFixed(2);
    document.getElementById('intellect').innerText = intellect.toFixed(4);
    
    const now = new Date();
    document.getElementById('clock').innerText = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
}

// --- SİSTEM DÖNGÜLERİ ---
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
        ownedAssets[id]++;
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
