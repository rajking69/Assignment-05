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
