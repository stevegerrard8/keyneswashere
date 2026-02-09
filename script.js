let balance = 100.00;
let intellect = 1.0000;
let pendingRent = 0.00;
let portfolio = {}; 
let activeBrokers = [];
let ownedAssets = { arsa: 0, ev: 0, dükkan: 0, çekici: 0 };

const market = [
    {id: 'ABC', price: 20}, {id: 'XYZ', price: 45}, {id: 'GLD', price: 15}, 
    {id: 'TCH', price: 120}, {id: 'NRG', price: 65}, {id: 'AGR', price: 12},
    {id: 'CYB', price: 90}, {id: 'FLW', price: 30}
];

const brokers = [
    {id: 'jr', name: 'Junior Broker', price: 150, boost: 0.0005},
    {id: 'pro', name: 'Professional Broker', price: 800, boost: 0.0020},
    {id: 'sr', name: 'Senior Broker', price: 2000, boost: 0.0050}
];

const assetShop = [
    {id: 'arsa', name: 'Arsa', price: 500, rent: 0.5},
    {id: 'ev', name: 'Ev', price: 2000, rent: 3.0},
    {id: 'dükkan', name: 'Dükkan', price: 6000, rent: 10.0},
    {id: ' çekici', name: 'Çekici', price: 1200, rent: 1.5}
];

function updateUI() {
    // 1. Nakit ve Portföy
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

    // 2. Market
    const mBody = document.getElementById('market-body');
    mBody.innerHTML = "";
    market.forEach(s => {
        s.price += (Math.random() * 0.4 - 0.2); // Gerçekçi küçük dalgalanma
        mBody.innerHTML += `<tr><td><b>${s.id}</b></td><td>${s.price.toFixed(2)}</td><td><a onclick="executeBuy('${s.id}', ${s.price})">[AL]</a></td></tr>`;
    });

    // 3. Marketler
    const bShop = document.getElementById('broker-shop');
    bShop.innerHTML = brokers.map(b => `<div class="shop-item"><b>${b.name}</b> (${b.price}$)<br><a onclick="buyBroker('${b.id}')">[SÖZLEŞME]</a></div>`).join("");

    const aShop = document.getElementById('asset-shop');
    aShop.innerHTML = assetShop.map(a => `<div class="shop-item"><b>${a.name}</b> (${a.price}$)<br>Kira: ${a.rent}$/s <a onclick="buyAsset('${a.id}')">[AL]</a></div>`).join("");

    // 4. İstatistikler
    const assetStats = document.getElementById('asset-stats-body');
    assetStats.innerHTML = Object.keys(ownedAssets).map(key => {
        let def = assetShop.find(x => x.id === key);
        return `<tr><td>${def.name}</td><td>${ownedAssets[key]}</td><td>${(ownedAssets[key] * def.rent).toFixed(1)}</td></tr>`;
    }).join("");

    const activeList = document.getElementById('active-brokers-list');
    activeList.innerHTML = activeBrokers.map(b => `<li>${b.name} (+${(b.boost*100).toFixed(3)}/s)</li>`).join("");

    // 5. Header ve Durum
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('port-val').innerText = pVal.toFixed(2);
    document.getElementById('total-net').innerText = (balance + pVal).toFixed(2);
    document.getElementById('pending-rent').innerText = pendingRent.toFixed(2);
    document.getElementById('intellect').innerText = intellect.toFixed(4);
    
    const now = new Date();
    document.getElementById('clock').innerText = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
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
