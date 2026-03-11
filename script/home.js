const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';

// DOM references
const tabAllBtn    = document.getElementById('tabAll');
const tabOpenBtn   = document.getElementById('tabOpen');
const tabClosedBtn = document.getElementById('tabClosed');

const allSection    = document.getElementById('allIssuesSection');
const openSection   = document.getElementById('openIssuesSection');
const closedSection = document.getElementById('closedIssuesSection');
const searchSection = document.getElementById('searchResultsSection');

const allGrid    = document.getElementById('allIssuesGrid');
const openGrid   = document.getElementById('openIssuesGrid');
const closedGrid = document.getElementById('closedIssuesGrid');
const searchGrid = document.getElementById('searchResultsGrid');

const allSpinner    = document.getElementById('allSpinner');
const openSpinner   = document.getElementById('openSpinner');
const closedSpinner = document.getElementById('closedSpinner');

const allTotalLabel    = document.getElementById('allIssueTotal');
const openTotalLabel   = document.getElementById('openIssueTotal');
const closedTotalLabel = document.getElementById('closedIssueTotal');

const searchCountLabel = document.getElementById('searchResultsCount');
const issueSearchBox   = document.getElementById('issueSearchBox');
const issueDetailModal = document.getElementById('issueDetailModal');


// Build label badges HTML from a labels array
function buildLabelsHTML(labels) {
    if (!labels || labels.length === 0) {
        return '';
    }

    let labelsHTML = '';

    labels.forEach(function(label) {
        const labelLower = label.toLowerCase();
        let icon = '';
        let bg = '';
        let text = '';

        if (labelLower === 'bug') {
            icon = '🪲';
            bg   = 'bg-red-50';
            text = 'text-red-600';
        } else if (labelLower === 'help wanted') {
            icon = '⭕';
            bg   = 'bg-green-50';
            text = 'text-green-600';
        } else if (labelLower === 'enhancement') {
            icon = '✨';
            bg   = 'bg-purple-50';
            text = 'text-purple-600';
        } else if (labelLower === 'good first issue') {
            icon = '🖊️';
            bg   = 'bg-orange-50';
            text = 'text-orange-600';
        } else {
            icon = '🏷️';
            bg   = 'bg-yellow-50';
            text = 'text-yellow-700';
        }

        labelsHTML += `<span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${text} ${bg} rounded-full">
                    <span>${icon}</span>${label.toUpperCase()}
                </span>`;
    });

    return labelsHTML;
}

// Build a single issue card DOM element
function createIssueCard(issue) {
    let borderClass = '';
    let iconSrc = '';

    if (issue.status === 'open') {
        borderClass = 'border-t-green-500';
        iconSrc = 'assets/Open-Status.png';
    } else if (issue.status === 'closed') {
        borderClass = 'border-t-purple-500';
        iconSrc = 'assets/Closed- Status .png';
    } else {
        borderClass = 'border-t-gray-400';
        iconSrc = 'assets/Aperture.png';
    }

    const priority = issue.priority || '';
    let priorityBadge = '';

    if (priority.toLowerCase() === 'high') {
        priorityBadge = `<span class="px-2 py-1 text-xs font-semibold text-red-700 bg-red-50 rounded">${priority.toUpperCase()}</span>`;
    } else if (priority.toLowerCase() === 'medium') {
        priorityBadge = `<span class="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-50 rounded">${priority.toUpperCase()}</span>`;
    } else {
        priorityBadge = `<span class="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded">${priority.toUpperCase()}</span>`;
    }

    const labelsHTML = buildLabelsHTML(issue.labels);
    const author = issue.author || 'Unknown';
    const date = new Date(issue.createdAt).toLocaleDateString();

    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg border border-gray-200 border-t-4 ' + borderClass + ' p-4 shadow-sm';
    card.innerHTML = `
        <div onclick="openIssueDetail(${issue.id})" class="cursor-pointer">
            <div class="flex items-start justify-between mb-3">
                <img src="${iconSrc}" alt="Status Icon" class="w-6 h-6" />
                ${priorityBadge}
            </div>
            <h3 class="text-sm font-bold text-gray-900 mb-2">${issue.title}</h3>
            <p class="text-xs text-gray-600 mb-3 leading-relaxed">${issue.description || 'No description available.'}</p>
            <div class="flex flex-wrap gap-2 mb-3">${labelsHTML}</div>
            <div class="text-xs text-gray-500 pt-2 border-t border-gray-100">
                <p class="mb-0.5">#${issue.id} by ${author}</p>
                <p>${date}</p>
            </div>
        </div>`;

    return card;
}


// Append all issue cards into a grid container
function renderIssueCards(issueList, targetGrid) {
    issueList.forEach(function(issue) {
        targetGrid.appendChild(createIssueCard(issue));
    });
}


// Fetch all issues once, then separate into open and closed lists
fetch(API_BASE_URL + '/issues')
    .then(function(res) {
        return res.json();
    })
    .then(function(payload) {
        // Artificial delay so the loading spinner is visible
        return new Promise(function(resolve) {
            setTimeout(function() { resolve(payload); }, 2000);
        });
    })
    .then(function(payload) {
        const allIssues = payload.data;
        const openIssues = [];
        const closedIssues = [];

        allIssues.forEach(function(issue) {
            if (issue.status === 'open') {
                openIssues.push(issue);
            } else if (issue.status === 'closed') {
                closedIssues.push(issue);
            }
        });

        if (allSpinner) allSpinner.remove();
        if (openSpinner) openSpinner.remove();
        if (closedSpinner) closedSpinner.remove();

        allTotalLabel.textContent    = allIssues.length + ' Issues';
        openTotalLabel.textContent   = openIssues.length + ' Issues';
        closedTotalLabel.textContent = closedIssues.length + ' Issues';

        renderIssueCards(allIssues,    allGrid);
        renderIssueCards(openIssues,   openGrid);
        renderIssueCards(closedIssues, closedGrid);
    });


// selected tab and highlight its button
function switchTab(activeTabId) {
    tabAllBtn.classList.remove('btn-primary');
    tabAllBtn.classList.add('btn-outline');
    tabOpenBtn.classList.remove('btn-primary');
    tabOpenBtn.classList.add('btn-outline');
    tabClosedBtn.classList.remove('btn-primary');
    tabClosedBtn.classList.add('btn-outline');

    allSection.style.display    = 'none';
    openSection.style.display   = 'none';
    closedSection.style.display = 'none';

    if (activeTabId === 'tabAll') {
        tabAllBtn.classList.remove('btn-outline');
        tabAllBtn.classList.add('btn-primary');
        allSection.style.display = 'block';
    } else if (activeTabId === 'tabOpen') {
        tabOpenBtn.classList.remove('btn-outline');
        tabOpenBtn.classList.add('btn-primary');
        openSection.style.display = 'block';
    } else if (activeTabId === 'tabClosed') {
        tabClosedBtn.classList.remove('btn-outline');
        tabClosedBtn.classList.add('btn-primary');
        closedSection.style.display = 'block';
    }
}

// Live search
let searchDebounceTimer = null;

issueSearchBox.addEventListener('input', function() {
    const query = issueSearchBox.value.trim();

    if (!query) {
        searchSection.style.display = 'none';
        document.getElementById('tabContainer').style.display = 'flex';
        switchTab('tabAll');
        return;
    }

    document.getElementById('tabContainer').style.display = 'none';
    allSection.style.display    = 'none';
    openSection.style.display   = 'none';
    closedSection.style.display = 'none';
    searchSection.style.display = 'block';

    searchCountLabel.textContent = 'Searching...';
    searchGrid.innerHTML = '';

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(function() {
        fetch(API_BASE_URL + '/issues/search?q=' + encodeURIComponent(query))
            .then(function(res) {
                return res.json();
            })
            .then(function(payload) {
                const results = payload.data;

                if (results.length === 0) {
                    searchCountLabel.textContent = 'No results for "' + query + '"';
                    searchGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-10">No issues found.</p>';
                    return;
                }

                searchCountLabel.textContent = results.length + ' result' + (results.length > 1 ? 's' : '') + ' for "' + query + '"';
                renderIssueCards(results, searchGrid);
            });
    }, 300);
});






// show detailed info of an issue in a modal when its card is clicked
function openIssueDetail(issueId) {
    fetch(API_BASE_URL + '/issue/' + issueId)
        .then(function(res) {
            return res.json();
        })
        .then(function(payload) {
            const issue = payload.data;

            document.getElementById('detailTitle').textContent = issue.title;

            const statusEl = document.getElementById('detailStatus');
            if (issue.status === 'open') {
                statusEl.textContent = 'Opened';
                statusEl.className = 'px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full';
            } else {
                statusEl.textContent = 'Closed';
                statusEl.className = 'px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full';
            }

            document.getElementById('detailAuthor').textContent = issue.author || 'Unknown';
            document.getElementById('detailDate').textContent = new Date(issue.createdAt).toLocaleDateString('en-GB');

            document.getElementById('detailLabels').innerHTML = buildLabelsHTML(issue.labels);

            document.getElementById('detailDescription').textContent = issue.description || 'No description available.';

            document.getElementById('detailAssignee').textContent = issue.assignee || issue.author || 'Not assigned';

            const priorityEl = document.getElementById('detailPriority');
            const issuePriority = issue.priority || 'n/a';

            if (issuePriority.toLowerCase() === 'high') {
                priorityEl.className = 'inline-block px-4 py-1 text-xs font-bold text-white bg-red-500 rounded-full uppercase';
            } else if (issuePriority.toLowerCase() === 'medium') {
                priorityEl.className = 'inline-block px-4 py-1 text-xs font-bold text-white bg-yellow-500 rounded-full uppercase';
            } else {
                priorityEl.className = 'inline-block px-4 py-1 text-xs font-bold text-white bg-gray-500 rounded-full uppercase';
            }

            priorityEl.textContent = issuePriority.toUpperCase();

            issueDetailModal.showModal();
        });
}