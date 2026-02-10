let balance = 1000.00;
let intellect = 1.0000;
let pendingRent = 0.00;
let portfolio = {}; 
let activeBrokers = [];
let ownedAssets = {};

const stockPrefixes = ['XAU', 'UST', 'JPY', 'GER', 'EURE', 'AAPL', 'NVDA', 'TSLA', 'AMZN', 'BTC'];
const market = Array.from({ length: 50 }, (_, i) => ({
    id: stockPrefixes[i % 10] + (200 + i),
    price: Math.floor(Math.random() * 500) + 50,
    oldPrice: 0
}));

const assetShop = [
    {id: 'a1', name: 'Arsa - Türkiye', price: 500, rent: 0.5},
    {id: 'a2', name: 'Daire - Londra', price: 4500, rent: 4.5},
    {id: 'a3', name: 'Mağaza - İstanbul', price: 9000, rent: 10.0},
    {id: 'a4', name: 'Villa - Miami', price: 25000, rent: 30.0},
    {id: 'a5', name: 'Lojistik Merkezi', price: 75000, rent: 100.0}
];

const brokers = [
    {id: 'b1', name: 'Stajyer Analist', price: 200, boost: 0.0005},
    {id: 'b2', name: 'Portföy Yöneticisi', price: 1500, boost: 0.0020},
    {id: 'b3', name: 'Kıdemli Broker', price: 5000, boost: 0.0070},
    {id: 'b4', name: 'Yapay Zeka Botu', price: 20000, boost: 0.0300}
];

// LOG YAZMA FONKSİYONU
function writeLog(message) {
    const logContainer = document.getElementById('log-container');
    const time = new Date().toLocaleTimeString();
    const newLog = document.createElement('div');
    newLog.style.marginBottom = "2px";
    newLog.innerHTML = `<span style="color: #888;">[${time}]</span> > ${message}`;
    logContainer.prepend(newLog);
}

function updateUI() {
    let pVal = 0;
    
    // Borsa Güncelleme
    const mBody = document.getElementById('market-body');
    mBody.innerHTML = market.map(s => {
        let change = (Math.random() * 4 - 2 + ((intellect - 1) * 0.1));
        s.oldPrice = s.price;
        s.price += change;
        if(s.price < 1) s.price = 1;
        let flashClass = s.price > s.oldPrice ? 'up-flash' : 'down-flash';
        return `<tr><td><b>${s.id}</b></td><td class="${flashClass} ${s.price >= s.oldPrice ? 'profit' : 'loss'}">${s.price.toFixed(2)}</td><td><a onclick="executeBuy('${s.id}', ${s.price})">[AL]</a></td></tr>`;
    }).join("");

    // Portföy
    const pBody = document.getElementById('portfolio-body');
    pBody.innerHTML = "";
    Object.keys(portfolio).forEach(id => {
        if(portfolio[id].qty > 0) {
            const s = market.find(x => x.id === id);
            let currentVal = portfolio[id].qty * s.price;
            let profit = currentVal - (portfolio[id].qty * portfolio[id].avgCost);
            pVal += currentVal;
            pBody.innerHTML += `<tr><td>${id}</td><td>${portfolio[id].qty}</td><td class="${profit>=0?'profit':'loss'}">${profit.toFixed(2)}</td><td><a onclick="executeSell('${id}', ${s.price})">[SAT]</a></td></tr>`;
        }
    });

    // Marketler
    document.getElementById('asset-shop').innerHTML = assetShop.map(a => `<div class="shop-item"><b>${a.name}</b> (${a.price}$)<br>Kira: ${a.rent}$/s | <a onclick="buyAsset('${a.id}')">[AL]</a></div>`).join("");
    document.getElementById('broker-shop').innerHTML = brokers.map(b => `<div class="shop-item"><b>${b.name}</b> (${b.price}$)<br>Zeka: +${(b.boost*100).toFixed(3)} | <a onclick="buyBroker('${b.id}')">[AL]</a></div>`).join("");
    
    // Envanter
    document.getElementById('asset-stats-body').innerHTML = Object.keys(ownedAssets).map(key => {
        let def = assetShop.find(x => x.id === key);
        return `<tr><td>${def.name}</td><td>${ownedAssets[key]}</td><td>${(ownedAssets[key] * def.rent).toFixed(1)}</td></tr>`;
    }).join("");

    document.getElementById('active-brokers-list').innerHTML = activeBrokers.map(b => `<li>• ${b.name} (+${(b.boost*100).toFixed(3)})</li>`).join("");

    // Statlar
    document.getElementById('balance').innerText = balance.toLocaleString(undefined, {minimumFractionDigits: 2});
    document.getElementById('port-val').innerText = pVal.toLocaleString(undefined, {minimumFractionDigits: 2});
    document.getElementById('total-net').innerText = (balance + pVal).toLocaleString(undefined, {minimumFractionDigits: 2});
    document.getElementById('pending-rent').innerText = pendingRent.toFixed(2);
    document.getElementById('intellect').innerText = intellect.toFixed(4);
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}

function process() {
    Object.keys(ownedAssets).forEach(key => {
        let assetDef = assetShop.find(x => x.id === key);
        pendingRent += (ownedAssets[key] * assetDef.rent);
    });
    activeBrokers.forEach(b => intellect += b.boost);
    updateUI();
}

function collectRent() {
    if(pendingRent > 0) {
        writeLog(`Kira Tahsilatı: <span style="color: #00ff00;">+${pendingRent.toFixed(2)}$</span>`);
        balance += pendingRent;
        pendingRent = 0;
        const el = document.getElementById('balance');
        el.classList.remove('money-anim');
        void el.offsetWidth;
        el.classList.add('money-anim');
        updateUI();
    }
}

function buyAsset(id) {
    let a = assetShop.find(x => x.id === id);
    if(balance >= a.price) {
        balance -= a.price;
        ownedAssets[id] = (ownedAssets[id] || 0) + 1;
        writeLog(`Mülk Alındı: ${a.name} | <span style="color: #ff4444;">-${a.price}$</span>`);
        updateUI();
    }
}

function buyBroker(id) {
    let b = brokers.find(x => x.id === id);
    if(balance >= b.price) {
        balance -= b.price;
        activeBrokers.push(b);
        writeLog(`Personel Alındı: ${b.name} | <span style="color: #ff4444;">-${b.price}$</span>`);
        updateUI();
    }
}

function executeBuy(id, price) {
    if(balance >= price) {
        balance -= price;
        if(!portfolio[id]) portfolio[id] = {qty: 0, avgCost: 0};
        portfolio[id].avgCost = ((portfolio[id].qty * portfolio[id].avgCost) + price) / (portfolio[id].qty + 1);
        portfolio[id].qty++;
        writeLog(`Borsa ALIM: ${id} @ ${price.toFixed(2)}$`);
        updateUI();
    }
}

function executeSell(id, price) {
    if(portfolio[id]?.qty > 0) {
        balance += price;
        portfolio[id].qty--;
        writeLog(`Borsa SATIŞ: ${id} @ ${price.toFixed(2)}$ | Nakit: <span style="color: #00ff00;">+${price.toFixed(2)}$</span>`);
        updateUI();
    }
}

setInterval(process, 1000);
updateUI();
