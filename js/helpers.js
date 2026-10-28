/* Helper UI, modal, dan pencarian game */
// HELPER QUICK ACTIONS & UI
function quickSelectMLBB() {
    selectGame('mlbb');
}

function resetView() {
    document.getElementById('topupFormSection').classList.add('hidden');
    selectedGameKey = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// SEARCH GAME FILTER
function handleSearch() {
    const val = document.getElementById('searchInput').value.toLowerCase();
    filterGames(val);
}

function handleSearchMobile() {
    const val = document.getElementById('mobileSearchInput').value.toLowerCase();
    filterGames(val);
}

function filterGames(query) {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        if(text.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
