(function() {
    const { menuItems, vegetarIds, pescetarIds, udenOksekodIds, getCategoryForID } = window.DilanMenu;
    const { warmAudio, playTick, playWin, playBeerBong, toggleMute, getMuteState } = window.DilanAudio;
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
    const freePickBtns = document.querySelectorAll('.btn-freepick');
    const freePickThresholdInput = document.getElementById('freepick-threshold');
    const freePickModal = document.getElementById('freepick-modal');
    const freePickClose = document.getElementById('freepick-close');
    const freePickSubtitle = document.getElementById('freepick-subtitle');
    const freePickSearch = document.getElementById('freepick-search');
    const freePickList = document.getElementById('freepick-list');

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
    const tabLeaderboardBtn = document.getElementById('tab-leaderboard');

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
    let currentSelfPicked = false;

    let freePickThreshold = parseInt(localStorage.getItem('dilans_freepick_threshold'), 10) || 3;

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

            // Re-align the reel so it's perfectly centered in the crosshair with the new height (140px vs 190px)
            if (currentWinner) {
                renderReelCenteredOn(currentWinner);
            } else {
                renderInitialReel();
            }
        });

        // Re-align reel on window resize or fullscreen change
        window.addEventListener('resize', () => {
            if (!isSpinning) {
                if (currentWinner) {
                    renderReelCenteredOn(currentWinner);
                } else {
                    renderInitialReel();
                }
            }
        });

        // Pressing Enter in player name input immediately spins
        playerNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!isSpinning && !spinBtn.disabled) {
                    spinBtn.click();
                }
            }
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

        // Free pick threshold (some people get a different number of ølbongs)
        freePickThresholdInput.value = freePickThreshold;
        freePickThresholdInput.addEventListener('change', () => {
            const value = parseInt(freePickThresholdInput.value, 10);
            freePickThreshold = Math.min(20, Math.max(1, value || 3));
            freePickThresholdInput.value = freePickThreshold;
            localStorage.setItem('dilans_freepick_threshold', freePickThreshold);
            updateFreePickButtons();
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

        tabLeaderboardBtn.addEventListener('click', () => {
            currentOrderTab = 'leaderboard';
            localStorage.setItem('dilans_order_tab', 'leaderboard');
            updateTabButtons();
            renderOrders();
        });
    }

    function updateTabButtons() {
        tabPlayersBtn.classList.toggle('active', currentOrderTab === 'players');
        tabSummaryBtn.classList.toggle('active', currentOrderTab === 'summary');
        tabLeaderboardBtn.classList.toggle('active', currentOrderTab === 'leaderboard');
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

    function getCurrentDiet() {
        if (vegToggle.checked) return 'veg';
        if (pesceToggle.checked) return 'pesce';
        if (nobeefToggle.checked) return 'nobeef';
        return 'none';
    }

    function setDiet(diet) {
        vegToggle.checked = (diet === 'veg');
        vegBadge.classList.toggle('checked', vegToggle.checked);

        pesceToggle.checked = (diet === 'pesce');
        pesceBadge.classList.toggle('checked', pesceToggle.checked);

        nobeefToggle.checked = (diet === 'nobeef');
        nobeefBadge.classList.toggle('checked', nobeefToggle.checked);
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

        // If player name matches someone in the pending queue, resume their accumulated beerbongs and diet!
        const enteredName = playerNameInput.value.trim();
        if (enteredName) {
            const pendingIndex = pendingPlayers.findIndex(p => p.name.toLowerCase() === enteredName.toLowerCase());
            if (pendingIndex >= 0) {
                currentBeerBongCount = pendingPlayers[pendingIndex].beerbongs;
                if (pendingPlayers[pendingIndex].diet) {
                    setDiet(pendingPlayers[pendingIndex].diet);
                }
                pendingPlayers.splice(pendingIndex, 1);
                savePendingPlayers();
                renderPendingQueue();
            }
        }

        const pool = getFilteredMenu();
        if (!pool.length) return;

        isSpinning = true;
        spinBtn.disabled = true;
        playerNameInput.disabled = true;
        vegToggle.disabled = true;
        pesceToggle.disabled = true;
        nobeefToggle.disabled = true;
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
            playerNameInput.disabled = false;
            vegToggle.disabled = false;
            pesceToggle.disabled = false;
            nobeefToggle.disabled = false;
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
            updateFreePickButtons();
            choiceActions.classList.add('visible');
        }, spinDuration + 100);
    }

    // Mechanical ticking simulator with smooth organic deceleration
    function playDeceleratingClicks(totalDuration) {
        warmAudio();
        const startTime = performance.now();

        // Fire the first tick immediately at 0ms so there is zero initial delay!
        playTick(1);

        function scheduleNext() {
            const elapsed = performance.now() - startTime;
            if (elapsed >= totalDuration - 250) return;

            playTick(1 + Math.random() * 0.15);

            const progress = elapsed / totalDuration;
            // Starts as a rapid mechanical flutter (~30ms) matching the explosive reel launch,
            // then decelerates smoothly into the tension-filled ~750ms+ crawl
            const delay = 30 + Math.pow(progress, 3.2) * 780;

            setTimeout(scheduleNext, delay);
        }

        setTimeout(scheduleNext, 30);
    }

    // -------------------------------------------------------------
    // Button Handlers (Spin, Beerbong, Accept)
    // -------------------------------------------------------------
    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;
        const enteredName = playerNameInput.value.trim();
        if (enteredName) {
            const existing = orders.find(o => o.player.toLowerCase() === enteredName.toLowerCase());
            if (existing && !confirm(`⚠️ ${existing.player} har allerede bestilt #${existing.itemId} ${existing.itemName}.\n\nVil du spinne for ${enteredName} igen alligevel?`)) {
                return;
            }
        }
        warmAudio();
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
        updateFreePickButtons();
    });

    // 🎰 Ølbong bundet - start spin igen (Trin 2)
    btnBeerbongDone.addEventListener('click', () => {
        if (isSpinning) return;
        warmAudio();
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
            selfPicked: currentSelfPicked,
            timestamp: new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })
        };

        orders.push(newOrder);
        saveOrders();
        renderOrders();

        // Also remove player from pending queue if they were in it
        pendingPlayers = pendingPlayers.filter(p => p.name.toLowerCase() !== playerName.toLowerCase());
        savePendingPlayers();
        renderPendingQueue();

        // Reset turn and dietary preferences to none for next person
        currentBeerBongCount = 0;
        currentWinner = null;
        currentSelfPicked = false;
        updateFreePickButtons();
        playerNameInput.value = '';
        setDiet('none');
        beerbongTally.textContent = '';
        choiceActions.classList.remove('visible');
        beerbongActions.classList.remove('visible');
        outcomePanel.classList.remove('drinking-mode');
        spinBtn.disabled = false;
        btnBeerbongDone.textContent = '🍻 Ølbong bundet! Spin igen 🎰';
        btnBeerbongCancel.textContent = 'Fortryd & behold retten';
        renderInitialReel();

        outcomePanel.classList.remove('winner');
        outcomeCategory.textContent = 'BESTILLING GEMT!';
        outcomeTitle.textContent = newOrder.selfPicked
            ? `🎯 ${playerName} valgte selv sin ret!`
            : `🍕 ${playerName} har låst sin ret!`;
        outcomeDesc.textContent = 'Indtast næste navn og tryk Spin Hjulet for at fortsætte festen.';
    });

    // -------------------------------------------------------------
    // Pending Beerbong Queue Logic
    // -------------------------------------------------------------
    function savePendingPlayers() {
        localStorage.setItem('dilans_pending_players', JSON.stringify(pendingPlayers));
        if (currentOrderTab === 'leaderboard') renderOrders();
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
            const dietBadge = p.diet === 'veg' ? ' • 🌱' : (p.diet === 'pesce' ? ' • 🐟' : (p.diet === 'nobeef' ? ' • 🥩' : ''));
            chip.innerHTML = `
                <button class="pending-chip-btn" title="Genoptag spintur for ${escapeHtml(p.name)}">
                    <span>🍺 ${escapeHtml(p.name)}</span>
                    <span class="pending-chip-count">(${p.beerbongs} ølbong${dietBadge})</span>
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

        const playerDiet = getCurrentDiet();
        const existingIndex = pendingPlayers.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase());
        if (existingIndex >= 0) {
            pendingPlayers[existingIndex].beerbongs = currentBeerBongCount;
            if (currentWinner) pendingPlayers[existingIndex].lastItem = currentWinner;
            pendingPlayers[existingIndex].diet = playerDiet;
        } else {
            pendingPlayers.push({
                id: Date.now(),
                name: playerName,
                beerbongs: currentBeerBongCount,
                lastItem: currentWinner,
                diet: playerDiet
            });
        }

        savePendingPlayers();
        renderPendingQueue();

        // Reset board and dietary preferences to none for next player
        currentBeerBongCount = 0;
        currentWinner = null;
        currentSelfPicked = false;
        updateFreePickButtons();
        playerNameInput.value = '';
        setDiet('none');
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

        // Restore player's saved dietary preference!
        setDiet(p.diet || 'none');

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
        updateFreePickButtons();
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
    // Free Pick (unlocked after enough ølbongs)
    // -------------------------------------------------------------
    function updateFreePickButtons() {
        const unlocked = currentBeerBongCount >= freePickThreshold;
        freePickBtns.forEach(btn => btn.classList.toggle('unlocked', unlocked));
    }

    function openFreePick() {
        if (isSpinning || currentBeerBongCount < freePickThreshold) return;
        const playerName = playerNameInput.value.trim() || 'Spiller';
        freePickSubtitle.textContent = `${playerName} har taget ${currentBeerBongCount} ølbong og må vælge frit fra hele menuen.`;
        freePickSearch.value = '';
        renderFreePickList();
        freePickModal.hidden = false;
        freePickSearch.focus();
    }

    function closeFreePick() {
        freePickModal.hidden = true;
    }

    function renderFreePickList() {
        const query = freePickSearch.value.trim().toLowerCase();
        const matches = menuItems.filter(item =>
            !query ||
            item.id.toLowerCase() === query ||
            item.name.toLowerCase().includes(query) ||
            (item.desc || '').toLowerCase().includes(query)
        );

        freePickList.innerHTML = '';
        if (matches.length === 0) {
            freePickList.innerHTML = '<li class="freepick-empty">Ingen retter matcher søgningen</li>';
            return;
        }

        matches.forEach(item => {
            const li = document.createElement('li');
            const category = getCategoryForID(item.id);
            li.innerHTML = `
                <button class="freepick-item">
                    <span class="freepick-item-num">#${escapeHtml(item.id)}</span>
                    <span class="freepick-item-text">
                        <span class="freepick-item-name">${escapeHtml(item.name)}</span>
                        ${item.desc ? `<span class="freepick-item-desc">${escapeHtml(item.desc)}</span>` : ''}
                    </span>
                    ${category ? `<span class="freepick-item-cat">${escapeHtml(category)}</span>` : ''}
                </button>
            `;
            li.querySelector('.freepick-item').addEventListener('click', () => selectFreePick(item));
            freePickList.appendChild(li);
        });
    }

    function selectFreePick(item) {
        closeFreePick();
        currentWinner = item;
        currentSelfPicked = true;
        renderReelCenteredOn(item);
        playWin();
        triggerConfetti();
        btnAccept.click();
    }

    freePickBtns.forEach(btn => btn.addEventListener('click', openFreePick));
    freePickClose.addEventListener('click', closeFreePick);
    freePickSearch.addEventListener('input', renderFreePickList);
    freePickSearch.addEventListener('keydown', (e) => {
        // Enter picks the first match (handy when typing a menu number)
        if (e.key === 'Enter') {
            const first = freePickList.querySelector('.freepick-item');
            if (first) first.click();
        }
    });
    freePickModal.addEventListener('click', (e) => {
        if (e.target === freePickModal) closeFreePick();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !freePickModal.hidden) closeFreePick();
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

        if (currentOrderTab === 'leaderboard') {
            renderLeaderboard();
            return;
        }

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
                        ${order.selfPicked ? '<span class="order-selfpick-tag" title="Valgt selv efter ølbongs">🎯 Selvvalgt</span>' : ''}
                        ${order.category ? `<span class="order-row-category">(${escapeHtml(order.category)})</span>` : ''}
                        ${renderChangeTags(order)}
                    </div>
                    <div class="order-row-right">
                        ${beerBadge}
                        <button class="edit-order-btn" title="Tag en ølbong og lav 1 ændring til ${escapeHtml(order.player)}s ret" data-order-id="${order.id}">🍺✏️ Ændring</button>
                        <button class="delete-order-btn" title="Fjern ${escapeHtml(order.player)}s bestilling" data-order-id="${order.id}">✕</button>
                    </div>
                `;

                li.querySelector('.delete-order-btn').addEventListener('click', () => {
                    orders = orders.filter(o => o.id !== order.id);
                    saveOrders();
                    renderOrders();
                });

                bindChangeButtons(li);

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
                        <span class="buyer-name">${escapeHtml(entry.player)}${entry.selfPicked ? ' 🎯' : ''}</span>
                        ${beerTag}
                        ${renderChangeTags(entry)}
                        <button class="edit-order-btn small" title="Tag en ølbong og lav 1 ændring til ${escapeHtml(entry.player)}s ret" data-order-id="${entry.id}">🍺✏️</button>
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

            bindChangeButtons(li);

            orderListEl.appendChild(li);
        });
    }

    // -------------------------------------------------------------
    // Order Changes (1 extra ølbong = 1 change, e.g. "uden tomat")
    // -------------------------------------------------------------
    function renderChangeTags(order) {
        if (!order.changes || order.changes.length === 0) return '';
        return order.changes.map((change, i) => `
            <span class="order-change-tag">
                ✏️ ${escapeHtml(change)}
                <button class="remove-change-btn" title="Fortryd ændring" data-order-id="${order.id}" data-change-index="${i}">✕</button>
            </span>
        `).join('');
    }

    function bindChangeButtons(container) {
        container.querySelectorAll('.edit-order-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                addOrderChange(Number(e.currentTarget.getAttribute('data-order-id')));
            });
        });
        container.querySelectorAll('.remove-change-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                removeOrderChange(
                    Number(e.currentTarget.getAttribute('data-order-id')),
                    Number(e.currentTarget.getAttribute('data-change-index'))
                );
            });
        });
    }

    function addOrderChange(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        const input = prompt(`🍺 ${order.player} tager en ølbong for at ændre #${order.itemId} ${order.itemName}.

Hvilken ændring? (f.eks. "uden tomat", "ekstra chili")`);
        const change = input ? input.trim() : '';
        if (!change) return;

        order.changes = order.changes || [];
        order.changes.push(change);
        order.beerbongs = (order.beerbongs || 0) + 1;
        playBeerBong();
        saveOrders();
        renderOrders();
    }

    function removeOrderChange(orderId, index) {
        const order = orders.find(o => o.id === orderId);
        if (!order || !order.changes || !order.changes[index]) return;
        if (!confirm(`Fortryd ændringen "${order.changes[index]}" for ${order.player}? (Ølbongen trækkes fra igen)`)) return;

        order.changes.splice(index, 1);
        order.beerbongs = Math.max(0, (order.beerbongs || 0) - 1);
        saveOrders();
        renderOrders();
    }

    // -------------------------------------------------------------
    // Ølbong Leaderboard
    // -------------------------------------------------------------
    function renderLeaderboard() {
        const totals = {};
        const addBongs = (name, bongs, stillDrinking) => {
            const key = name.toLowerCase();
            if (!totals[key]) totals[key] = { name, beerbongs: 0, stillDrinking: false };
            totals[key].beerbongs += bongs || 0;
            totals[key].stillDrinking = totals[key].stillDrinking || stillDrinking;
        };
        orders.forEach(o => addBongs(o.player, o.beerbongs, false));
        pendingPlayers.forEach(p => addBongs(p.name, p.beerbongs, true));

        const ranked = Object.values(totals)
            .filter(t => t.beerbongs > 0)
            .sort((a, b) => b.beerbongs - a.beerbongs);

        if (ranked.length === 0) {
            orderListEl.innerHTML = `
                <li class="empty-orders">
                    Ingen ølbongs endnu. Hvem tager den første? 🍺
                </li>
            `;
            return;
        }

        const medals = ['🥇', '🥈', '🥉'];
        let rank = 0;
        ranked.forEach((entry, index) => {
            // Players with the same number of ølbongs share a rank
            if (index === 0 || entry.beerbongs < ranked[index - 1].beerbongs) rank = index + 1;
            const li = document.createElement('li');
            li.className = 'order-row-item leaderboard-row' + (rank <= 3 ? ` rank-${rank}` : '');
            li.innerHTML = `
                <div class="order-row-left">
                    <span class="leaderboard-rank">${medals[rank - 1] || `${rank}.`}</span>
                    <span class="order-row-person">${escapeHtml(entry.name)}</span>
                    ${entry.stillDrinking ? '<span class="order-row-category">(drikker stadig 🍻)</span>' : ''}
                </div>
                <div class="order-row-right">
                    <span class="order-beer-tag">🍺 x${entry.beerbongs} ølbong</span>
                </div>
            `;
            orderListEl.appendChild(li);
        });
    }

    // Copy Order to Clipboard (Aggregated for pizzeria + Detailed per person)
    copyOrdersBtn.addEventListener('click', async () => {
        if (orders.length === 0 && pendingPlayers.length === 0) {
            alert('Der er ingen retter på bestillingslisten endnu.');
            return;
        }

        // Warn if anyone is still drinking in the ølbong queue
        if (pendingPlayers.length > 0) {
            const pendingNames = pendingPlayers.map(p => p.name).join(', ');
            const proceed = confirm(`⚠️ BEMÆRK: ${pendingNames} er stadig i ølbong-køen og mangler at låse deres ret!\n\nVil du kopiere bestillingen alligevel? (De inkluderes som ventende i bunden af teksten)`);
            if (!proceed) return;
        }

        // 1. Group items for pizzeria
        const groups = {};
        orders.forEach((o) => {
            if (!groups[o.itemId]) {
                groups[o.itemId] = {
                    itemId: o.itemId,
                    itemName: o.itemName,
                    desc: o.desc,
                    count: 0,
                    changes: []
                };
            }
            groups[o.itemId].count++;
            if (o.changes && o.changes.length > 0) {
                groups[o.itemId].changes.push(o.changes.join(', '));
            }
        });

        let text = `🍕 DILANS ROULETTE BESTILLING (RHK)\n`;
        text += `======================================\n`;
        text += `📋 BESTILLING TIL DILAN (SAMLET):\n`;
        if (Object.keys(groups).length > 0) {
            Object.values(groups).forEach((g) => {
                const descNote = g.desc ? ` (${g.desc})` : '';
                text += `• ${g.count}x #${g.itemId} ${g.itemName}${descNote}\n`;
                g.changes.forEach((change) => {
                    text += `    ↳ 1 stk: ${change}\n`;
                });
            });
        } else {
            text += `(Ingen låste retter endnu)\n`;
        }

        text += `\n👥 HVEM SKAL HAVE HVAD:\n`;
        orders.forEach((o, i) => {
            const beerNote = (o.beerbongs > 0 ? ` [${o.beerbongs}x 🍺 ølbong]` : '') + (o.selfPicked ? ' [🎯 selvvalgt]' : '');
            const changeNote = o.changes && o.changes.length > 0 ? ` (${o.changes.join(', ')})` : '';
            text += `${i + 1}. ${o.player}: #${o.itemId} ${o.itemName}${changeNote}${beerNote}\n`;
        });

        // Mention any players still in the queue so they aren't forgotten
        if (pendingPlayers.length > 0) {
            text += `\n⚠️ IKKE FÆRDIGE ENDNU (I ØLBONG-KØEN):\n`;
            pendingPlayers.forEach(p => {
                const lastDish = p.lastItem ? ` (sidst rullet #${p.lastItem.id} ${p.lastItem.name})` : ' (ikke rullet endnu)';
                text += `• ${p.name}: ${p.beerbongs}x 🍺 ølbong${lastDish}\n`;
            });
        }

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
