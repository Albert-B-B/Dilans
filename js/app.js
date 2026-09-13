(function() {
    const { menuItems, vegetarIds, pescetarIds, getCategoryForID } = window.DilanMenu;
    const { playTick, playWin, playBeerBong, toggleMute, getMuteState } = window.DilanAudio;
    const { triggerConfetti } = window.DilanConfetti;

    // DOM Elements
    const tvToggle = document.getElementById('tv-toggle');
    const muteToggle = document.getElementById('mute-toggle');
    const playerNameInput = document.getElementById('player-name');
    const vegToggle = document.getElementById('veg-toggle');
    const pesceToggle = document.getElementById('pesce-toggle');
    const vegBadge = document.getElementById('veg-badge');
    const pesceBadge = document.getElementById('pesce-badge');

    const reelViewport = document.getElementById('reel-viewport');
    const reelStrip = document.getElementById('reel-strip');
    const spinBtn = document.getElementById('spin-btn');
    const choiceActions = document.getElementById('choice-actions');
    const btnAccept = document.getElementById('btn-accept');
    const btnBeerbong = document.getElementById('btn-beerbong');

    const outcomePanel = document.getElementById('outcome-panel');
    const outcomeCategory = document.getElementById('outcome-category');
    const outcomeTitle = document.getElementById('outcome-title');
    const outcomeDesc = document.getElementById('outcome-desc');
    const beerbongTally = document.getElementById('beerbong-tally');

    const orderListEl = document.getElementById('order-list');
    const statCountEl = document.getElementById('stat-count');
    const statBeersEl = document.getElementById('stat-beers');
    const copyOrdersBtn = document.getElementById('copy-orders-btn');
    const clearOrdersBtn = document.getElementById('clear-orders-btn');

    // App State
    let orders = [];
    try {
        const saved = localStorage.getItem('dilans_orders');
        if (saved) orders = JSON.parse(saved);
    } catch (e) {
        orders = [];
    }

    let isSpinning = false;
    let currentBeerBongCount = 0;
    let currentWinner = null;

    // Initialize
    initSettings();
    renderInitialReel();
    renderOrders();

    // -------------------------------------------------------------
    // Settings & Controls
    // -------------------------------------------------------------
    function initSettings() {
        // TV Mode
        const isTvMode = localStorage.getItem('dilans_tv_mode') === 'true';
        if (isTvMode) {
            document.body.classList.add('tv-mode');
            tvToggle.classList.add('active');
        }

        tvToggle.addEventListener('click', () => {
            const active = document.body.classList.toggle('tv-mode');
            tvToggle.classList.toggle('active', active);
            localStorage.setItem('dilans_tv_mode', active);
        });

        // Mute toggle
        updateMuteUI(getMuteState());
        muteToggle.addEventListener('click', () => {
            const muted = toggleMute();
            updateMuteUI(muted);
        });

        // Diet Filter mutual exclusivity
        vegToggle.addEventListener('change', () => {
            if (vegToggle.checked) {
                pesceToggle.checked = false;
                pesceBadge.classList.remove('checked');
            }
            vegBadge.classList.toggle('checked', vegToggle.checked);
            renderInitialReel();
        });

        pesceToggle.addEventListener('change', () => {
            if (pesceToggle.checked) {
                vegToggle.checked = false;
                vegBadge.classList.remove('checked');
            }
            pesceBadge.classList.toggle('checked', pesceToggle.checked);
            renderInitialReel();
        });
    }

    function updateMuteUI(muted) {
        muteToggle.innerHTML = muted ? '🔇 Lyd fra' : '🔊 Lyd til';
        muteToggle.classList.toggle('active', !muted);
    }

    // -------------------------------------------------------------
    // Menu Filtering
    // -------------------------------------------------------------
    function getFilteredMenu() {
        if (vegToggle.checked) {
            return menuItems.filter(item => vegetarIds.includes(item.id));
        }
        if (pesceToggle.checked) {
            return menuItems.filter(item => pescetarIds.includes(item.id));
        }
        return menuItems;
    }

    // -------------------------------------------------------------
    // Slot Reel Generation & Mechanics
    // -------------------------------------------------------------
    function createItemElement(item) {
        const div = document.createElement('div');
        div.className = 'reel-item';
        const category = getCategoryForID(item.id);
        div.innerHTML = `
            <span class="item-category-tag">${category || 'DILANS'}</span>
            <span class="item-number">#${item.id}</span>
            <span class="item-name">${escapeHtml(item.name)}</span>
            <span class="item-desc">${escapeHtml(item.desc) || '&nbsp;'}</span>
        `;
        return div;
    }

    function getItemHeight() {
        const firstItem = reelStrip.querySelector('.reel-item');
        return firstItem ? firstItem.getBoundingClientRect().height : (document.body.classList.contains('tv-mode') ? 190 : 140);
    }

    function renderInitialReel() {
        reelStrip.innerHTML = '';
        const pool = getFilteredMenu();
        const sample = [
            pool[Math.floor(Math.random() * pool.length)],
            pool[Math.floor(Math.random() * pool.length)],
            pool[Math.floor(Math.random() * pool.length)]
        ];
        sample.forEach(item => reelStrip.appendChild(createItemElement(item)));
        reelStrip.style.transition = 'none';
        reelStrip.style.transform = 'translateY(0px)';
    }

    // Spin execution
    function spinRoulette() {
        if (isSpinning) return;
        const pool = getFilteredMenu();
        if (!pool.length) return;

        isSpinning = true;
        spinBtn.disabled = true;
        choiceActions.classList.remove('visible');
        outcomePanel.classList.remove('winner');

        outcomeTitle.textContent = '🎰 Spinner skæbnen...';
        outcomeDesc.textContent = 'Gør ølbongen klar hvis du rammer ved siden af!';
        outcomeCategory.textContent = 'ROULETTE';

        // Pick target winner
        const winningItem = pool[Math.floor(Math.random() * pool.length)];
        currentWinner = winningItem;

        // Build strip of 28 items leading up to the winner
        const totalReelItems = 28;
        const itemsSequence = [];

        for (let i = 0; i < totalReelItems - 1; i++) {
            itemsSequence.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        // Place winning item at index (totalReelItems - 2) so it centers in the crosshair
        const targetCenterIndex = totalReelItems - 2;
        itemsSequence[targetCenterIndex] = winningItem;
        // Add 1 extra trailing item for smooth viewport overflow
        itemsSequence.push(pool[Math.floor(Math.random() * pool.length)]);

        reelStrip.innerHTML = '';
        itemsSequence.forEach(item => reelStrip.appendChild(createItemElement(item)));

        // Reset position instantly
        reelStrip.style.transition = 'none';
        reelStrip.style.transform = 'translateY(0px)';

        // Force layout reflow
        void reelStrip.offsetHeight;

        const itemHeight = getItemHeight();
        const viewportHeight = reelViewport.getBoundingClientRect().height;
        const targetScrollY = (targetCenterIndex * itemHeight) - (viewportHeight / 2) + (itemHeight / 2);

        const spinDuration = 3200; // ms
        reelStrip.style.transition = `transform ${spinDuration}ms cubic-bezier(0.12, 0.8, 0.28, 1)`;
        reelStrip.style.transform = `translateY(-${targetScrollY}px)`;

        // Audio clicks synchronized with deceleration
        playDeceleratingClicks(spinDuration);

        // After spin ends
        setTimeout(() => {
            isSpinning = false;
            outcomePanel.classList.add('winner');

            const category = getCategoryForID(winningItem.id);
            outcomeCategory.textContent = category || 'DILAN SPECIAL';
            outcomeTitle.textContent = `#${winningItem.id} ${winningItem.name}`;
            outcomeDesc.textContent = winningItem.desc || 'Ingen yderligere beskrivelse - bare spis!';

            if (currentBeerBongCount > 0) {
                beerbongTally.textContent = `🍺 Ølbongs taget denne runde: ${currentBeerBongCount}`;
            } else {
                beerbongTally.textContent = `Første spin for denne person`;
            }

            playWin();
            triggerConfetti();

            // Show choice actions
            choiceActions.classList.add('visible');
        }, spinDuration + 100);
    }

    // Mechanical ticking simulator with ease-out slowdown
    function playDeceleratingClicks(totalDuration) {
        const startTime = performance.now();

        function scheduleNext() {
            if (performance.now() - startTime >= totalDuration - 200) return;
            playTick(1 + Math.random() * 0.2);

            const progress = (performance.now() - startTime) / totalDuration;
            const delay = 45 + Math.pow(progress, 2.5) * 360;

            setTimeout(scheduleNext, delay);
        }
        scheduleNext();
    }

    // -------------------------------------------------------------
    // Button Handlers (Spin, Beerbong, Accept)
    // -------------------------------------------------------------
    spinBtn.addEventListener('click', () => {
        spinRoulette();
    });

    // 🍺 Tag Ølbong & Re-spin
    btnBeerbong.addEventListener('click', () => {
        if (isSpinning) return;
        currentBeerBongCount++;
        playBeerBong();

        outcomeTitle.textContent = `🍺 ØLBONG #${currentBeerBongCount} BUNDET!`;
        outcomeDesc.textContent = `Respin starter nu...`;
        beerbongTally.textContent = `🍺 Ølbongs taget denne runde: ${currentBeerBongCount}`;

        setTimeout(() => {
            spinRoulette();
        }, 500);
    });

    // 🍕 Accepter Ret
    btnAccept.addEventListener('click', () => {
        if (!currentWinner) return;

        const rawName = playerNameInput.value.trim();
        const playerName = rawName || `Gæst #${orders.length + 1}`;

        const newOrder = {
            id: Date.now(),
            player: playerName,
            itemId: currentWinner.id,
            itemName: currentWinner.name,
            category: getCategoryForID(currentWinner.id),
            desc: currentWinner.desc,
            beerbongs: currentBeerBongCount,
            timestamp: new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })
        };

        orders.push(newOrder);
        saveOrders();
        renderOrders();

        // Reset turn for next person
        currentBeerBongCount = 0;
        currentWinner = null;
        playerNameInput.value = '';
        beerbongTally.textContent = '';
        choiceActions.classList.remove('visible');
        spinBtn.disabled = false;

        outcomePanel.classList.remove('winner');
        outcomeCategory.textContent = 'BESTILLING GEMT!';
        outcomeTitle.textContent = `🍕 ${playerName} har låst sin ret!`;
        outcomeDesc.textContent = 'Indtast næste navn og tryk Spin Hjulet for at fortsætte festen.';
    });

    // -------------------------------------------------------------
    // Kitchen Order List Management
    // -------------------------------------------------------------
    function saveOrders() {
        localStorage.setItem('dilans_orders', JSON.stringify(orders));
    }

    function renderOrders() {
        orderListEl.innerHTML = '';
        statCountEl.textContent = `${orders.length} retter`;

        const totalBeers = orders.reduce((sum, o) => sum + (o.beerbongs || 0), 0);
        statBeersEl.textContent = `${totalBeers} ølbong`;

        if (orders.length === 0) {
            orderListEl.innerHTML = `
                <li class="empty-orders">
                    Ingen bestillinger endnu. Spin hjulet for at tilføje den første ret til køkkenlisten!
                </li>
            `;
            return;
        }

        // Aggregate by itemId
        const groups = {};
        orders.forEach((order) => {
            if (!groups[order.itemId]) {
                groups[order.itemId] = {
                    itemId: order.itemId,
                    itemName: order.itemName,
                    category: order.category,
                    desc: order.desc,
                    entries: []
                };
            }
            groups[order.itemId].entries.push(order);
        });

        // Render each dish group
        Object.values(groups).forEach((group) => {
            const li = document.createElement('li');
            li.className = 'order-group';

            const qty = group.entries.length;
            const qtyBadge = `<span class="order-qty-pill">${qty} stk</span>`;

            // Individual buyer chips
            const buyersHtml = group.entries.map((entry) => {
                const beerTag = entry.beerbongs > 0 ? `<span class="buyer-beer">🍺 x${entry.beerbongs}</span>` : '';
                return `
                    <span class="buyer-chip">
                        <span class="buyer-name">${escapeHtml(entry.player)}</span>
                        ${beerTag}
                        <button class="remove-buyer-btn" title="Fjern ${escapeHtml(entry.player)}s bestilling" data-order-id="${entry.id}">✕</button>
                    </span>
                `;
            }).join('');

            li.innerHTML = `
                <div class="order-group-header">
                    <div class="order-group-title">
                        <span class="order-dish-num">#${escapeHtml(group.itemId)}</span>
                        <span class="order-dish-name">${escapeHtml(group.itemName)}</span>
                        ${group.category ? `<span class="order-dish-category">${escapeHtml(group.category)}</span>` : ''}
                    </div>
                    ${qtyBadge}
                </div>
                <div class="order-buyers-list">
                    ${buyersHtml}
                </div>
            `;

            // Attach individual delete event listeners
            li.querySelectorAll('.remove-buyer-btn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const orderId = Number(e.currentTarget.getAttribute('data-order-id'));
                    orders = orders.filter(o => o.id !== orderId);
                    saveOrders();
                    renderOrders();
                });
            });

            orderListEl.appendChild(li);
        });
    }

    // Copy Order to Clipboard (Aggregated for pizzeria + Detailed per person)
    copyOrdersBtn.addEventListener('click', async () => {
        if (orders.length === 0) {
            alert('Der er ingen retter på bestillingslisten endnu.');
            return;
        }

        // 1. Group items for pizzeria
        const groups = {};
        orders.forEach((o) => {
            if (!groups[o.itemId]) {
                groups[o.itemId] = {
                    itemId: o.itemId,
                    itemName: o.itemName,
                    desc: o.desc,
                    count: 0
                };
            }
            groups[o.itemId].count++;
        });

        let text = `🍕 DILANS ROULETTE BESTILLING (RHK)\n`;
        text += `======================================\n`;
        text += `📋 BESTILLING TIL DILAN (SAMLET):\n`;
        Object.values(groups).forEach((g) => {
            const descNote = g.desc ? ` (${g.desc})` : '';
            text += `• ${g.count}x #${g.itemId} ${g.itemName}${descNote}\n`;
        });
        text += `\n👥 HVEM SKAL HAVE HVAD:\n`;
        orders.forEach((o, i) => {
            const beerNote = o.beerbongs > 0 ? ` [${o.beerbongs}x 🍺 ølbong]` : '';
            text += `${i + 1}. ${o.player}: #${o.itemId} ${o.itemName}${beerNote}\n`;
        });
        text += `======================================\n`;
        const totalBeers = orders.reduce((sum, o) => sum + (o.beerbongs || 0), 0);
        text += `I alt: ${orders.length} retter | ${totalBeers} ølbongs bundet 🍻\n`;

        try {
            await navigator.clipboard.writeText(text);
            const originalHtml = copyOrdersBtn.innerHTML;
            copyOrdersBtn.innerHTML = '✓ Kopieret!';
            setTimeout(() => {
                copyOrdersBtn.innerHTML = originalHtml;
            }, 2000);
        } catch (err) {
            prompt('Kopier bestilling herfra:', text);
        }
    });

    // Clear All Orders
    clearOrdersBtn.addEventListener('click', () => {
        if (orders.length === 0) return;
        if (confirm('Er du sikker på, at du vil rydde hele køkkenets bestillingsliste?')) {
            orders = [];
            saveOrders();
            renderOrders();
        }
    });

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
