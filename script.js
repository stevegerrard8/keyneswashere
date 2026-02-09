let balance = 100;
let stocks = [
    { name: "TEKNO", price: 20, lastPrice: 20 },
    { name: "ENERJİ", price: 35, lastPrice: 35 },
    { name: "GIDA", price: 10, lastPrice: 10 },
    { name: "SAĞLIK", price: 50, lastPrice: 50 },
    { name: "ULAŞIM", price: 15, lastPrice: 15 }
];

function updateMarket() {
    const list = document.getElementById('stocks-list');
    list.innerHTML = "";

    stocks.forEach(stock => {
        // Rastgele fiyat değişimi
        stock.lastPrice = stock.price;
        let change = (Math.random() * 4 - 2); // -2$ ile +2$ arası
        stock.price = Math.max(1, stock.price + change);

        const div = document.createElement('div');
        div.className = 'stock-item';
        const trendClass = stock.price >= stock.lastPrice ? 'price-up' : 'price-down';
        
        div.innerHTML = `
            <span>${stock.name}</span>
            <span class="${trendClass}">${stock.price.toFixed(2)} $</span>
            <button style="width:50px" onclick="buyStock('${stock.name}', ${stock.price})">Al</button>
        `;
        list.appendChild(div);
    });
}

function buyStock(name, price) {
    if (balance >= price) {
        balance -= price;
        document.getElementById('balance').innerText = balance.toFixed(2);
        alert(`${name} hissesi alındı!`);
    } else {
        alert("Yetersiz bakiye!");
    }
}

function cashOut() {
    document.getElementById('sector-modal').classList.remove('hidden');
}

function selectSector(sector) {
    alert(`${sector} sektörü seçildi! Artık bu alanda uzmanlaşacaksın.`);
    document.getElementById('sector-modal').classList.add('hidden');
    // Burada yeni sektöre özel level yüklenecek
}

setInterval(updateMarket, 2000); // 2 saniyede bir borsa güncellenir
updateMarket();
