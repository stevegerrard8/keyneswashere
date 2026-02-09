let balance = 100.00;
let intellect = 1.0000;
let pendingRent = 0.00;
let portfolio = {}; 
let activeBrokers = [];
let ownedAssets = { arsa: 0, ev: 0, dükkan: 0, çekici: 0 };

const market = [
    {id: 'ABC', price: 20}, {id: 'XYZ', price: 45}, {id: 'GOLD', price: 15}, 
    {id: 'TECH', price: 120}, {id: 'NRG', price: 65}, {id: 'AGR', price: 12}
];

const brokers = [
    {id: 'jr', name: 'Junior Broker', price: 150, boost: 0.0005},
    {id: 'pro', name: 'Professional Broker', price: 800, boost: 0.0020}
];

const assetShop = [
    {id: 'arsa', name: 'Arsa', price: 500, rent: 5},
    {id: 'ev', name: 'Ev', price: 2000, rent: 25},
    {id: 'dükkan', name: 'Dükkan', price: 5000, rent: 70},
    {id: 'çekici', name: 'Çekici (Lojistik)', price: 1200, rent: 15}
];

function updateUI() {
    // 1. Nakit ve Portföy Hesaplama
    let pVal = 0;
    const pBody = document.getElementById('portfolio-body');
    pBody.innerHTML = "";
    Object.keys(portfolio).forEach(id => {
        if(portfolio[id].qty > 0) {
            const s = market.find(x => x.id === id);
            let val = portfolio[id].qty * s.price;
            let profit = val - (portfolio[id].qty * portfolio[id].avgCost);
            pVal += val;
            pBody.innerHTML += `<tr><td>${id}</td><td>${portfolio[id].qty}</td><td>${portfolio[id].avgCost.toFixed(2)}</td><td class="${profit>=0?'profit':'loss'}">${profit.toFixed(2)} $</td><td><a onclick="executeSell('${id}', ${s.price})">[SAT]</a></td></tr>`;
        }
    });

    // 2. Market ve Statlar
    const mBody = document.getElementById('market-body');
    mBody.innerHTML = "";
    market.forEach(s => {
        s.price += (Math.random() * 2 - 1); // Basit dalgalanma
        mBody.innerHTML += `<tr><td><b>${s.id}</b></td><td>${s.price.toFixed(2)} $</td><td><a onclick="executeBuy('${s.id}', ${s.price})">[AL]</a></td></tr>`;
    });

    // 3. Mağazalar (Nakit ile alınır)
    const bShop = document.getElementById('broker-shop');
    bShop.innerHTML = "";
    brokers.forEach(b => {
        bShop.innerHTML += `<div class="shop-item">${b.name} (${b.price} $)<br><a onclick="buyBroker('${b.id}')">[Sözleşme]</a></div>`;
    });

    const aShop = document.getElementById('asset-shop');
    aShop.innerHTML = "";
    assetShop.forEach(a => {
        aShop.innerHTML += `<div class="shop-item">${a.name} (${a.price} $) <br>Getiri: ${a.rent}$/sn <br><a onclick="buyAsset('${a.id}')">[Satın Al]</a></div>`;
    });

    // 4. Varlık İstatistikleri
    const assetStats = document.getElementById('asset-stats-body');
    assetStats.innerHTML = "";
    Object.keys(ownedAssets).forEach(key => {
        let def = assetShop.find(x => x.id === key);
        assetStats.innerHTML += `<tr><td>${def.name}</td><td>${ownedAssets[key]}</td><td>${(ownedAssets[key] * def.rent).toFixed(2)} $</td></tr>`;
    });

    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('port-val').innerText = pVal.toFixed(2);
    document.getElementById('total-net').innerText = (balance + pVal).toFixed(2);
    document.getElementById('pending-rent').innerText = pendingRent.toFixed(2);
    document.getElementById('intellect').innerText = intellect.toFixed(4);
}

// Kira Toplama Mekanizması (Her saniye çalışır)
function processPassiveIncome() {
    Object.keys(ownedAssets).forEach(key => {
        let assetDef = assetShop.find(x => x.id === key);
        pendingRent += (ownedAssets[key] * assetDef.rent) / 10; // Her döngüde birikim
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
    } else { alert("Nakit yetersiz!"); }
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
    }
}

function executeSell(id, price) {
    if(portfolio[id]?.qty > 0) {
        balance += price;
        portfolio[id].qty--;
    }
}

setInterval(processPassiveIncome, 1000);
updateUI();
