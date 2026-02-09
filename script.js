let balance = 100;
let initialBalance = 100;
let portfolio = {}; // Hangi hisseden kaç tane var?
let stocks = [
    { name: "APPLE", price: 150, last: 150 },
    { name: "TESLA", price: 200, last: 200 },
    { name: "BITCOIN", price: 50, last: 50 },
    { name: "GOLD", price: 180, last: 180 },
    { name: "OIL", price: 80, last: 80 }
];

function updateMarket() {
    const list = document.getElementById('stocks-list');
    list.innerHTML = "";
    let totalPortfolioVal = 0;

    stocks.forEach(s => {
        s.last = s.price;
        s.price += (Math.random() * 10 - 5); // Daha agresif dalgalanma
        if(s.price < 1) s.price = 1;

        // Sahip olunan hisse değerini hesapla
        if(portfolio[s.name]) {
            totalPortfolioVal += portfolio[s.name] * s.price;
        }

        const div = document.createElement('div');
        div.className = 'stock-item';
        const color = s.price >= s.last ? '#4caf50' : '#f44336';
        
        div.innerHTML = `
            <div class="stock-info">
                <span class="stock-name">${s.name}</span>
                <span style="font-size:0.7rem">Sende: ${portfolio[s.name] || 0} adet</span>
            </div>
            <span class="stock-price" style="color:${color}">${s.price.toFixed(2)} $</span>
            <button onclick="buyStock('${s.name}', ${s.price})" style="background:#444; color:white; border:none; border-radius:4px; padding:5px 10px; cursor:pointer">AL</button>
        `;
        list.appendChild(div);
    });

    // Verileri Güncelle
    document.getElementById('portfolio-val').innerText = totalPortfolioVal.toFixed(2);
    let totalWealth = balance + totalPortfolioVal;
    let pl = ((totalWealth - initialBalance) / initialBalance) * 100;
    const plEl = document.getElementById('profit-loss');
    plEl.innerText = pl.toFixed(2);
    plEl.style.color = pl >= 0 ? '#4caf50' : '#f44336';
}

function buyStock(name, price) {
    if (balance >= price) {
        balance -= price;
        portfolio[name] = (portfolio[name] || 0) + 1;
        updateUI();
    } else {
        alert("Yetersiz Nakit!");
    }
}

function withdrawCash() {
    let amt = parseFloat(document.getElementById('withdraw-amount').value);
    if (amt > 0 && amt <= balance) {
        // Belirlediğin tutarı "çekmiş" oluyorsun, sektör seçimi açılıyor
        alert(`${amt}$ nakit ayrıldı. Sektör seçebilirsin!`);
        document.getElementById('sector-overlay').classList.remove('hidden');
    } else {
        alert("Geçersiz tutar! Bakiyenizi kontrol edin.");
    }
}

function updateUI() {
    document.getElementById('balance').innerText = balance.toFixed(2);
}

function closeModal() { document.getElementById('sector-overlay').classList.add('hidden'); }

setInterval(updateMarket, 2000);
updateMarket();
