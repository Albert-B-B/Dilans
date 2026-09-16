(function() {
    const { menuItems, vegetarIds, pescetarIds, udenOksekodIds, getCategoryForID } = window.DilanMenu;
    const { playTick, playWin, playBeerBong, toggleMute, getMuteState } = window.DilanAudio;
    const { triggerConfetti } = window.DilanConfetti;

    // DOM Elements
    const tvToggle = document.getElementById('tv-toggle');
    const muteToggle = document.getElementById('mute-toggle');
    const playerNameInput = document.getElementById('player-name');
    const vegToggle = document.getElementById('veg-toggle');
    const pesceToggle = document.getElementById('pesce-toggle');
    const nobeefToggle = document.getElementById('nobeef-toggle');
    const vegBadge = document.getElementById('veg-badge');
    const pesceBadge = document.getElementById('pesce-badge');
    const nobeefBadge = document.getElementById('nobeef-badge');

    const pendingQueueContainer = document.getElementById('pending-queue-container');
    const pendingQueueChips = document.getElementById('pending-queue-chips');

    const reelViewport = document.getElementById('reel-viewport');
    const reelStrip = document.getElementById('reel-strip');
    const spinBtn = document.getElementById('spin-btn');
    const choiceActions = document.getElementById('choice-actions');
    const btnAccept = document.getElementById('btn-accept');
    const btnBeerbong = document.getElementById('btn-beerbong');
    const beerbongActions = document.getElementById('beerbong-actions');
    const btnBeerbongDone = document.getElementById('btn-beerbong-done');
    const btnBeerbongPark = document.getElementById('btn-beerbong-park');
    const btnBeerbongCancel = document.getElementById('btn-beerbong-cancel');

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
    const tabPlayersBtn = document.getElementById('tab-players');
    const tabSummaryBtn = document.getElementById('tab-summary');

    let currentOrderTab = localStorage.getItem('dilans_order_tab') || 'players';

    // App State
    let orders = [];
    try {
        const saved = localStorage.getItem('dilans_orders');
        if (saved) orders = JSON.parse(saved);
    } catch (e) {
        orders = [];
    }

    let pendingPlayers = [];
    try {
        const savedPending = localStorage.getItem('dilans_pending_players');
        if (savedPending) pendingPlayers = JSON.parse(savedPending);
    } catch (e) {
        pendingPlayers = [];
    }

    let isSpinning = false;
    let currentBeerBongCount = 0;
    let currentWinner = null;

    // Initialize
    initSettings();
    renderInitialReel();
    renderPendingQueue();
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
                nobeefToggle.checked = false;
                nobeefBadge.classList.remove('checked');
            }
            vegBadge.classList.toggle('checked', vegToggle.checked);
            renderInitialReel();
        });

        pesceToggle.addEventListener('change', () => {
            if (pesceToggle.checked) {
                vegToggle.checked = false;
                vegBadge.classList.remove('checked');
                nobeefToggle.checked = false;
                nobeefBadge.classList.remove('checked');
            }
            pesceBadge.classList.toggle('checked', pesceToggle.checked);
            renderInitialReel();
        });

        nobeefToggle.addEventListener('change', () => {
            if (nobeefToggle.checked) {
                vegToggle.checked = false;
                vegBadge.classList.remove('checked');
                pesceToggle.checked = false;
                pesceBadge.classList.remove('checked');
            }
            nobeefBadge.classList.toggle('checked', nobeefToggle.checked);
            renderInitialReel();
        });

        // Order View Tabs
        updateTabButtons();
        tabPlayersBtn.addEventListener('click', () => {
            currentOrderTab = 'players';
            localStorage.setItem('dilans_order_tab', 'players');
            updateTabButtons();
            renderOrders();
        });

        tabSummaryBtn.addEventListener('click', () => {
            currentOrderTab = 'summary';
            localStorage.setItem('dilans_order_tab', 'summary');
            updateTabButtons();
            renderOrders();
        });
    }

    function updateTabButtons() {
        tabPlayersBtn.classList.toggle('active', currentOrderTab === 'players');
        tabSummaryBtn.classList.toggle('active', currentOrderTab === 'summary');
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
        if (nobeefToggle.checked) {
            return menuItems.filter(item => udenOksekodIds.includes(item.id));
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

    // -------------------------------------------------------------
    // Cryptographically Secure Hardware Randomness (Zero-Bias)
    // -------------------------------------------------------------
    function getSecureRandomIndex(max) {
        if (max <= 1) return 0;
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            const maxUint = 0xFFFFFFFF;
            const limit = maxUint - (maxUint % max);
            let rand;
            do {
                window.crypto.getRandomValues(array);
                rand = array[0];
            } while (rand >= limit);
            return rand % max;
        }
        return Math.floor(Math.random() * max);
    }

    function getRandomPoolItem(pool) {
        if (!pool || pool.length === 0) return null;
        return pool[getSecureRandomIndex(pool.length)];
    }

    function renderReelCenteredOn(targetItem) {
        if (!targetItem) return;
        reelStrip.innerHTML = '';
        const pool = getFilteredMenu();

        // Pick top neighbor (different from targetItem)
        let topNeighbor;
        do {
            topNeighbor = getRandomPoolItem(pool);
        } while (topNeighbor && topNeighbor.id === targetItem.id && pool.length > 1);

        // Pick bottom neighbor (different from targetItem)
        let bottomNeighbor;
        do {
            bottomNeighbor = getRandomPoolItem(pool);
        } while (bottomNeighbor && bottomNeighbor.id === targetItem.id && pool.length > 1);

        const trio = [topNeighbor, targetItem, bottomNeighbor];
        trio.forEach(item => reelStrip.appendChild(createItemElement(item)));

        reelStrip.style.transition = 'none';

        // Center targetItem in crosshair
        const itemHeight = getItemHeight();
        const viewportHeight = reelViewport.getBoundingClientRect().height || (itemHeight * 2.5);
        const targetScrollY = (1 * itemHeight) - (viewportHeight / 2) + (itemHeight / 2);
        reelStrip.style.transform = `translateY(-${targetScrollY}px)`;
    }

    function renderInitialReel() {
        const pool = getFilteredMenu();
        if (!pool.length) return;
        renderReelCenteredOn(getRandomPoolItem(pool));
    }

    // Spin execution
    function spinRoulette() {
        if (isSpinning) return;

        // If player name matches someone in the pending queue, resume their accumulated beerbongs!
        const enteredName = playerNameInput.value.trim();
        if (enteredName) {
            const pendingIndex = pendingPlayers.findIndex(p => p.name.toLowerCase() === enteredName.toLowerCase());
            if (pendingIndex >= 0) {
                currentBeerBongCount = pendingPlayers[pendingIndex].beerbongs;
                pendingPlayers.splice(pendingIndex, 1);
                savePendingPlayers();
                renderPendingQueue();
            }
        }

        const pool = getFilteredMenu();
        if (!pool.length) return;

        isSpinning = true;
        spinBtn.disabled = true;
        choiceActions.classList.remove('visible');
        beerbongActions.classList.remove('visible');
        outcomePanel.classList.remove('winner');
        outcomePanel.classList.remove('drinking-mode');

        outcomeTitle.textContent = '🎰 Spinner skæbnen...';
        outcomeDesc.textContent = 'Gør ølbongen klar hvis du rammer ved siden af!';
        outcomeCategory.textContent = 'ROULETTE';

        // Pick target winner using cryptographically secure hardware entropy
        const winningItem = getRandomPoolItem(pool);
        currentWinner = winningItem;

        // Build strip of 56 items leading up to the winner for an epic high-anticipation spin
        // Guarantee no two adjacent items on the reel tape are identical
        const totalReelItems = 56;
        const itemsSequence = [];

        let prevItem = null;
        for (let i = 0; i < totalReelItems - 2; i++) {
            let item;
            do {
                item = getRandomPoolItem(pool);
            } while (prevItem && item.id === prevItem.id && pool.length > 1);
            itemsSequence.push(item);
            prevItem = item;
        }

        // Ensure the item immediately before the winner is not the winner itself
        if (itemsSequence.length > 0 && itemsSequence[itemsSequence.length - 1].id === winningItem.id && pool.length > 1) {
            let replacement;
            const itemBeforeThat = itemsSequence.length > 1 ? itemsSequence[itemsSequence.length - 2] : null;
            do {
                replacement = getRandomPoolItem(pool);
            } while (
                (replacement.id === winningItem.id || (itemBeforeThat && replacement.id === itemBeforeThat.id)) &&
                pool.length > 2
            );
            itemsSequence[itemsSequence.length - 1] = replacement;
        }

        // Place winning item at index (totalReelItems - 2) so it centers in the crosshair
        const targetCenterIndex = totalReelItems - 2;
        itemsSequence.push(winningItem);

        // Add 1 extra trailing item for smooth viewport overflow, ensuring it's not the winner
        let trailingItem;
        do {
            trailingItem = getRandomPoolItem(pool);
        } while (trailingItem.id === winningItem.id && pool.length > 1);
        itemsSequence.push(trailingItem);

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

        // 7.2 seconds spin duration with an agonizing, suspenseful crawl over the final few dishes
        const spinDuration = 7200; // ms
        reelStrip.style.transition = `transform ${spinDuration}ms cubic-bezier(0.05, 0.92, 0.12, 1)`;
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

    // Mechanical ticking simulator with smooth organic deceleration
    function playDeceleratingClicks(totalDuration) {
        const startTime = performance.now();

        function scheduleNext() {
            if (performance.now() - startTime >= totalDuration - 250) return;
            playTick(1 + Math.random() * 0.15);

            const progress = (performance.now() - startTime) / totalDuration;
            // Starts as a gentle rolling rhythm (~60ms) and spaces out to ~750ms+ on the final crawl
            const delay = 60 + Math.pow(progress, 3.2) * 750;

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

    // 🍺 Tag Ølbong (Trin 1: Øl hældes op og bundes)
    btnBeerbong.addEventListener('click', () => {
        if (isSpinning) return;
        currentBeerBongCount++;
        playBeerBong();

        const rawName = playerNameInput.value.trim();
        const playerName = rawName || 'Spiller';

        choiceActions.classList.remove('visible');
        beerbongActions.classList.add('visible');
        outcomePanel.classList.add('drinking-mode');

        outcomeCategory.textContent = '🍺 ØLBONG';
        outcomeTitle.textContent = `🍺 Ølbong valgt (${playerName})`;
        outcomeDesc.textContent = `Tryk på 'Spin igen' når du er klar, eller sæt dig i køen så den næste kan spinne imens.`;
        beerbongTally.textContent = `🍺 Ølbongs taget denne runde: ${currentBeerBongCount}`;
    });

    // 🎰 Ølbong bundet - start spin igen (Trin 2)
    btnBeerbongDone.addEventListener('click', () => {
        if (isSpinning) return;
        beerbongActions.classList.remove('visible');
        outcomePanel.classList.remove('drinking-mode');
        spinRoulette();
    });

    // 👥 Parkér spiller i ølbong-køen og lad næste person spinne
    btnBeerbongPark.addEventListener('click', () => {
        parkCurrentPlayer();
    });

    // Fortryd ølbong og behold retten
    btnBeerbongCancel.addEventListener('click', () => {
        if (isSpinning) return;
        currentBeerBongCount = Math.max(0, currentBeerBongCount - 1);
        beerbongActions.classList.remove('visible');
        outcomePanel.classList.remove('drinking-mode');
        btnAccept.click();
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

        // Also remove player from pending queue if they were in it
        pendingPlayers = pendingPlayers.filter(p => p.name.toLowerCase() !== playerName.toLowerCase());
        savePendingPlayers();
        renderPendingQueue();

        // Reset turn for next person
        currentBeerBongCount = 0;
        currentWinner = null;
        playerNameInput.value = '';
        beerbongTally.textContent = '';
        choiceActions.classList.remove('visible');
        beerbongActions.classList.remove('visible');
        outcomePanel.classList.remove('drinking-mode');
        spinBtn.disabled = false;
        btnBeerbongDone.textContent = '🍻 Ølbong bundet! Spin igen 🎰';
        btnBeerbongCancel.textContent = 'Fortryd & behold retten';

        outcomePanel.classList.remove('winner');
        outcomeCategory.textContent = 'BESTILLING GEMT!';
        outcomeTitle.textContent = `🍕 ${playerName} har låst sin ret!`;
        outcomeDesc.textContent = 'Indtast næste navn og tryk Spin Hjulet for at fortsætte festen.';
    });

    // -------------------------------------------------------------
    // Pending Beerbong Queue Logic
    // -------------------------------------------------------------
    function savePendingPlayers() {
        localStorage.setItem('dilans_pending_players', JSON.stringify(pendingPlayers));
    }

    function renderPendingQueue() {
        pendingQueueChips.innerHTML = '';
        if (pendingPlayers.length === 0) {
            pendingQueueContainer.style.display = 'none';
            return;
        }

        pendingQueueContainer.style.display = 'block';
        pendingPlayers.forEach(p => {
            const chip = document.createElement('div');
            chip.className = 'pending-chip';
            chip.innerHTML = `
                <button class="pending-chip-btn" title="Genoptag spintur for ${escapeHtml(p.name)}">
                    <span>🍺 ${escapeHtml(p.name)}</span>
                    <span class="pending-chip-count">(${p.beerbongs} ølbong)</span>
                    <span class="pending-chip-arrow">➜ Spin igen</span>
                </button>
                <button class="pending-chip-remove" title="Fjern ${escapeHtml(p.name)} fra køen">✕</button>
            `;

            chip.querySelector('.pending-chip-btn').addEventListener('click', () => {
                if (isSpinning) return;
                resumePlayer(p.id);
            });

            chip.querySelector('.pending-chip-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                if (isSpinning) return;
                removePendingPlayer(p.id);
            });

            pendingQueueChips.appendChild(chip);
        });
    }

    function parkCurrentPlayer() {
        if (isSpinning) return;
        const rawName = playerNameInput.value.trim();
        const playerName = rawName || `Gæst ${pendingPlayers.length + 1}`;

        const existingIndex = pendingPlayers.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase());
        if (existingIndex >= 0) {
            pendingPlayers[existingIndex].beerbongs = currentBeerBongCount;
            if (currentWinner) pendingPlayers[existingIndex].lastItem = currentWinner;
        } else {
            pendingPlayers.push({
                id: Date.now(),
                name: playerName,
                beerbongs: currentBeerBongCount,
                lastItem: currentWinner
            });
        }

        savePendingPlayers();
        renderPendingQueue();

        // Reset board for next player
        currentBeerBongCount = 0;
        currentWinner = null;
        playerNameInput.value = '';
        choiceActions.classList.remove('visible');
        beerbongActions.classList.remove('visible');
        outcomePanel.classList.remove('drinking-mode');
        outcomePanel.classList.remove('winner');
        spinBtn.disabled = false;
        btnBeerbongDone.textContent = '🍻 Ølbong bundet! Spin igen 🎰';
        btnBeerbongCancel.textContent = 'Fortryd & behold retten';
        renderInitialReel();

        outcomeCategory.textContent = 'KLAR TIL NÆSTE';
        outcomeTitle.textContent = `🍺 ${playerName} sat i ølbong-køen!`;
        outcomeDesc.textContent = `Ølbong er registreret ovenfor. Hvem er den næste, der skal spinne?`;
        beerbongTally.textContent = '';
    }

    function resumePlayer(playerId) {
        if (isSpinning) return;
        const p = pendingPlayers.find(item => item.id === playerId);
        if (!p) return;

        // If current turn has unsaved progress or beerbongs, park it first
        if (currentBeerBongCount > 0) {
            parkCurrentPlayer();
        }

        // Set as active player
        playerNameInput.value = p.name;
        currentBeerBongCount = p.beerbongs;
        currentWinner = p.lastItem;

        // Restore wheel to show the dish this person rolled before taking the beerbong!
        if (p.lastItem) {
            renderReelCenteredOn(p.lastItem);
        }

        // Remove from pending queue
        pendingPlayers = pendingPlayers.filter(item => item.id !== playerId);
        savePendingPlayers();
        renderPendingQueue();

        // Show ready state for re-spin
        choiceActions.classList.remove('visible');
        beerbongActions.classList.add('visible');
        outcomePanel.classList.add('drinking-mode');
        outcomePanel.classList.remove('winner');
        spinBtn.disabled = true;

        if (p.lastItem) {
            const cat = getCategoryForID(p.lastItem.id);
            outcomeCategory.textContent = `🍺 ${p.name.toUpperCase()} (ØLBONG BUNDET)`;
            outcomeTitle.textContent = `#${p.lastItem.id} ${p.lastItem.name}`;
            outcomeDesc.textContent = `Tidligere rullet af ${p.name}. Klar til re-spin eller acceptér retten.`;
            btnBeerbongDone.textContent = `🍻 Ølbong bundet! Spin for ${p.name} 🎰`;
            btnBeerbongCancel.textContent = `Fortryd & behold #${p.lastItem.id} ${p.lastItem.name}`;
        } else {
            outcomeCategory.textContent = '🍺 ØLBONG BUNDET';
            outcomeTitle.textContent = `🍺 Velkommen tilbage, ${p.name}!`;
            outcomeDesc.textContent = `${p.name} har taget ${p.beerbongs} ølbong. Klar til re-spin!`;
            btnBeerbongDone.textContent = `🍻 Ølbong bundet! Spin for ${p.name} 🎰`;
            btnBeerbongCancel.textContent = 'Fortryd & behold retten';
        }
        beerbongTally.textContent = `🍺 Ølbongs taget af ${p.name}: ${currentBeerBongCount}`;
    }

    function removePendingPlayer(playerId) {
        const p = pendingPlayers.find(item => item.id === playerId);
        if (!p) return;
        if (confirm(`Vil du fjerne ${p.name} (${p.beerbongs} ølbong) fra køen?`)) {
            pendingPlayers = pendingPlayers.filter(item => item.id !== playerId);
            savePendingPlayers();
            renderPendingQueue();
        }
    }

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

        // 1. Standard View: Chronological order of each player's roll
        if (currentOrderTab === 'players') {
            orders.forEach((order, index) => {
                const li = document.createElement('li');
                li.className = 'order-row-item';

                const beerBadge = order.beerbongs > 0
                    ? `<span class="order-beer-tag">🍺 x${order.beerbongs} ølbong</span>`
                    : `<span class="order-beer-tag zero">🍺 0 ølbong</span>`;

                li.innerHTML = `
                    <div class="order-row-left">
                        <span class="order-row-num">${index + 1}.</span>
                        <span class="order-row-person">${escapeHtml(order.player)}:</span>
                        <span class="order-row-dish">#${escapeHtml(order.itemId)} ${escapeHtml(order.itemName)}</span>
                        ${order.category ? `<span class="order-row-category">(${escapeHtml(order.category)})</span>` : ''}
                    </div>
                    <div class="order-row-right">
                        ${beerBadge}
                        <button class="delete-order-btn" title="Fjern ${escapeHtml(order.player)}s bestilling" data-order-id="${order.id}">✕</button>
                    </div>
                `;

                li.querySelector('.delete-order-btn').addEventListener('click', () => {
                    orders = orders.filter(o => o.id !== order.id);
                    saveOrders();
                    renderOrders();
                });

                orderListEl.appendChild(li);
            });
            return;
        }

        // 2. Summary View: Aggregated by dish for calling Dilan
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
                const beerTag = entry.beerbongs > 0 
                    ? `<span class="buyer-beer">🍺 x${entry.beerbongs}</span>` 
                    : `<span class="buyer-beer" style="color: var(--text-muted); font-weight: normal;">0 ølbong</span>`;
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
        if (orders.length === 0 && pendingPlayers.length === 0) return;
        if (confirm('Er du sikker på, at du vil rydde hele køkkenets bestillingsliste og ølbong-køen?')) {
            orders = [];
            pendingPlayers = [];
            saveOrders();
            savePendingPlayers();
            renderOrders();
            renderPendingQueue();
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
