# Epic 4: Export & Integration

## Story 4.1: Export to CSV (P0)

**As a** user  
**I want** to export selected tickets to a CSV file  
**So that** I can import them into my project management tool

### Acceptance Criteria
- [ ] "Export to CSV" button is prominent and accessible
- [ ] Button is disabled when no tickets selected
- [ ] Clicking triggers immediate CSV download
- [ ] CSV includes all ticket fields: title, description, priority, hours, team, tags, files
- [ ] Filename format: `curious-bob-tickets-[repo-name]-[date].csv`
- [ ] Success message appears after download

### UI/UX Considerations
- **Button Design**: Large, blue, with download icon
- **Position**: Fixed at bottom-right of screen (floating action button)
- **Disabled State**: Gray, cursor-not-allowed, tooltip explains why
- **Loading State**: Spinner while generating CSV (for large exports)
- **Success Toast**: Green notification "CSV exported successfully!"
- **Mobile**: Full-width button at bottom on mobile

### Technical Notes
```typescript
const exportToCSV = (tickets: Ticket[]) => {
  const headers = ['Title', 'Description', 'Priority', 'Estimated Hours', 'Team', 'Tags', 'Files'];
  const rows = tickets.map(ticket => [
    ticket.title,
    ticket.description,
    ticket.priority,
    ticket.estimatedHours,
    ticket.assignedTeam,
    ticket.tags.join('; '),
    ticket.files.join('; ')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `curious-bob-tickets-${repoName}-${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
  URL.revokeObjectURL(url);
};
```

### Dependencies
- Story 3.8 (ticket selection exists)

---

## Story 4.2: Export Preview Modal (P1)

**As a** user  
**I want** to preview the CSV content before downloading  
**So that** I can verify the export is correct

### Acceptance Criteria
- [ ] "Preview Export" button appears next to "Export to CSV"
- [ ] Clicking opens modal showing CSV preview
- [ ] Preview displays first 10 rows in table format
- [ ] Shows total row count: "Showing 10 of X tickets"
- [ ] "Download CSV" button in modal
- [ ] "Edit Export Settings" option to customize fields

### UI/UX Considerations
- **Modal Design**: Large (90% viewport), white background
- **Table**: Striped rows, fixed header, scrollable body
- **Header Row**: Bold, gray background
- **Cell Truncation**: Long text truncates with ellipsis, tooltip shows full text
- **Download Button**: Prominent, green, at bottom of modal
- **Settings**: Collapsible section with checkboxes for fields to include

### Technical Notes
```typescript
const [showPreview, setShowPreview] = useState(false);
const [exportFields, setExportFields] = useState({
  title: true,
  description: true,
  priority: true,
  hours: true,
  team: true,
  tags: true,
  files: true
});

const PreviewModal = ({ tickets }: { tickets: Ticket[] }) => {
  const previewTickets = tickets.slice(0, 10);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90vw] h-[90vh] p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Export Preview</h2>
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                {Object.entries(exportFields).filter(([_, enabled]) => enabled).map(([field]) => (
                  <th key={field} className="p-2 text-left">{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewTickets.map(ticket => (
                <tr key={ticket.id} className="border-b">
                  {/* Render cells based on exportFields */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Showing 10 of {tickets.length} tickets
        </p>
      </div>
    </div>
  );
};
```

### Dependencies
- Story 4.1 (CSV export logic exists)

---

## Story 4.3: Export to JSON (P1)

**As a** user  
**I want** to export tickets as JSON  
**So that** I can integrate with custom tools or APIs

### Acceptance Criteria
- [ ] Export format dropdown: "CSV" or "JSON"
- [ ] JSON export includes full ticket objects with all metadata
- [ ] JSON is formatted (pretty-printed) for readability
- [ ] Filename format: `curious-bob-tickets-[repo-name]-[date].json`
- [ ] JSON structure includes metadata: repo name, export date, ticket count

### UI/UX Considerations
- **Format Selector**: Radio buttons or dropdown next to export button
- **Default**: CSV (more common)
- **JSON Preview**: Show formatted JSON in preview modal
- **Syntax Highlighting**: Color-code JSON in preview
- **Copy Button**: Allow copying JSON to clipboard

### Technical Notes
```typescript
const exportToJSON = (tickets: Ticket[], repoName: string) => {
  const exportData = {
    metadata: {
      repository: repoName,
      exportDate: new Date().toISOString(),
      ticketCount: tickets.length,
      generatedBy: 'Curious Bob'
    },
    tickets: tickets
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `curious-bob-tickets-${repoName}-${new Date().toISOString().split('T')[0]}.json`);
  link.click();
  URL.revokeObjectURL(url);
};
```

### Dependencies
- Story 4.1 (export functionality exists)

---

## Story 4.4: Copy Tickets to Clipboard (P2)

**As a** user  
**I want** to copy ticket data to clipboard  
**So that** I can paste it into other tools quickly

### Acceptance Criteria
- [ ] "Copy to Clipboard" button appears in export options
- [ ] Copies tickets in markdown table format
- [ ] Success toast: "Copied X tickets to clipboard"
- [ ] Works on all modern browsers
- [ ] Fallback for browsers without clipboard API

### UI/UX Considerations
- **Button Design**: Secondary style, clipboard icon
- **Format Options**: Dropdown to choose format (Markdown, Plain Text, HTML)
- **Success Feedback**: Green toast notification, 3 second duration
- **Error Handling**: Show error if clipboard access denied
- **Mobile**: Use native share API on mobile devices

### Technical Notes
```typescript
const copyToClipboard = async (tickets: Ticket[], format: 'markdown' | 'text' | 'html') => {
  let content = '';
  
  if (format === 'markdown') {
    content = '| Title | Priority | Hours | Team |\n';
    content += '|-------|----------|-------|------|\n';
    tickets.forEach(ticket => {
      content += `| ${ticket.title} | ${ticket.priority} | ${ticket.estimatedHours} | ${ticket.assignedTeam} |\n`;
    });
  }

  try {
    await navigator.clipboard.writeText(content);
    showToast('Copied to clipboard!', 'success');
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Copied to clipboard!', 'success');
  }
};
```

### Dependencies
- Story 3.8 (ticket selection exists)

---

## Story 4.5: Share Analysis Link (P2)

**As a** user  
**I want** to share a link to my analysis results  
**So that** my team can view the same tickets

### Acceptance Criteria
- [ ] "Share" button generates shareable URL
- [ ] URL includes repository and module information
- [ ] Tickets are stored temporarily (24 hours) for sharing
- [ ] Clicking shared link loads the same analysis
- [ ] Copy link button with success feedback
- [ ] QR code option for mobile sharing

### UI/UX Considerations
- **Share Button**: Icon button in header, opens modal
- **Modal Content**: Generated URL in input field, copy button
- **URL Display**: Read-only input, full-width, monospace font
- **QR Code**: Optional, generated on demand, downloadable
- **Expiration Notice**: "This link expires in 24 hours"
- **Social Share**: Optional buttons for email, Slack, Teams

### Technical Notes
```typescript
const generateShareLink = async (tickets: Ticket[], repoName: string, moduleName: string) => {
  // Store tickets in temporary storage (localStorage or API)
  const shareId = generateUniqueId();
  const shareData = {
    tickets,
    repoName,
    moduleName,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  
  // For MVP: Use localStorage
  localStorage.setItem(`share-${shareId}`, JSON.stringify(shareData));
  
  // For production: POST to API
  // await fetch('/api/share', { method: 'POST', body: JSON.stringify(shareData) });
  
  const shareUrl = `${window.location.origin}/share/${shareId}`;
  return shareUrl;
};
```

### Dependencies
- Story 3.2 (tickets exist)
- Requires new `/share/[id]` route

---

## Story 4.6: GitHub Issues Integration (P3)

**As a** user  
**I want** to create GitHub issues directly from tickets  
**So that** I can add them to my repository without manual copying

### Acceptance Criteria
- [ ] "Create GitHub Issues" button appears when authenticated
- [ ] OAuth flow to authenticate with GitHub
- [ ] Select target repository from dropdown
- [ ] Bulk create issues for selected tickets
- [ ] Progress indicator during creation
- [ ] Success message with links to created issues

### UI/UX Considerations
- **Auth Button**: "Connect GitHub" button, GitHub logo
- **OAuth Flow**: Popup window or redirect, clear permissions explanation
- **Repo Selector**: Dropdown with search, shows user's repos
- **Progress**: Progress bar showing "Creating issue X of Y"
- **Success**: List of created issues with clickable links
- **Error Handling**: Show which issues failed, allow retry

### Technical Notes
```typescript
// GitHub OAuth flow
const authenticateGitHub = () => {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/github/callback`;
  const scope = 'repo';
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
};

// Create issues
const createGitHubIssues = async (tickets: Ticket[], repo: string, token: string) => {
  const results = [];
  for (const ticket of tickets) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: ticket.title,
          body: ticket.description,
          labels: [ticket.priority, ticket.assignedTeam, ...ticket.tags]
        })
      });
      const issue = await response.json();
      results.push({ success: true, url: issue.html_url });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  return results;
};
```

### Dependencies
- Story 3.8 (ticket selection exists)
- Requires GitHub OAuth setup
- Requires backend API route for token exchange

---

## Story 4.7: Jira Integration (P3)

**As a** user  
**I want** to export tickets to Jira  
**So that** I can track them in my existing project management system

### Acceptance Criteria
- [ ] "Export to Jira" button appears
- [ ] Jira authentication flow (API token)
- [ ] Map ticket fields to Jira fields
- [ ] Select target Jira project
- [ ] Bulk create Jira issues
- [ ] Handle Jira-specific fields (story points, epic links)

### UI/UX Considerations
- **Auth**: Input for Jira domain, email, API token
- **Field Mapping**: Visual mapper showing Curious Bob → Jira fields
- **Project Selector**: Dropdown with Jira projects
- **Custom Fields**: Optional mapping for custom Jira fields
- **Preview**: Show how tickets will appear in Jira
- **Batch Size**: Create in batches to avoid rate limits

### Technical Notes
```typescript
const exportToJira = async (tickets: Ticket[], jiraConfig: JiraConfig) => {
  const { domain, email, apiToken, projectKey } = jiraConfig;
  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

  for (const ticket of tickets) {
    const jiraIssue = {
      fields: {
        project: { key: projectKey },
        summary: ticket.title,
        description: ticket.description,
        issuetype: { name: 'Task' },
        priority: { name: mapPriority(ticket.priority) },
        labels: ticket.tags,
        customfield_10016: ticket.estimatedHours // Story points
      }
    };

    await fetch(`https://${domain}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jiraIssue)
    });
  }
};
```

### Dependencies
- Story 3.8 (ticket selection exists)
- Requires Jira API credentials

---

## Story 4.8: Email Export (P2)

**As a** user  
**I want** to email tickets to my team  
**So that** I can share results without requiring tool access

### Acceptance Criteria
- [ ] "Email Tickets" button opens email composer
- [ ] Pre-filled subject: "Curious Bob Analysis: [Repo Name]"
- [ ] Email body includes formatted ticket list
- [ ] Attachments: CSV and/or JSON files
- [ ] CC/BCC fields for team members
- [ ] HTML formatted email with styling

### UI/UX Considerations
- **Email Modal**: Form with To, CC, Subject, Message fields
- **Ticket Preview**: Show how tickets will appear in email
- **Formatting Options**: Plain text or HTML email
- **Attachment Options**: Checkboxes for CSV, JSON
- **Send Button**: Blue, prominent, with sending state
- **Success**: Confirmation message after sending

### Technical Notes
```typescript
const sendEmail = async (emailData: EmailData) => {
  // Use mailto: link for simple implementation
  const subject = encodeURIComponent(emailData.subject);
  const body = encodeURIComponent(formatTicketsForEmail(emailData.tickets));
  window.location.href = `mailto:${emailData.to}?subject=${subject}&body=${body}`;

  // For production: Use email API (SendGrid, AWS SES)
  // await fetch('/api/send-email', {
  //   method: 'POST',
  //   body: JSON.stringify(emailData)
  // });
};

const formatTicketsForEmail = (tickets: Ticket[]): string => {
  let html = '<h2>Generated Tickets</h2>';
  tickets.forEach(ticket => {
    html += `
      <div style="border: 1px solid #ccc; padding: 16px; margin: 16px 0;">
        <h3>${ticket.title}</h3>
        <p><strong>Priority:</strong> ${ticket.priority}</p>
        <p><strong>Team:</strong> ${ticket.assignedTeam}</p>
        <p><strong>Hours:</strong> ${ticket.estimatedHours}</p>
        <p>${ticket.description}</p>
      </div>
    `;
  });
  return html;
};
```

### Dependencies
- Story 3.8 (ticket selection exists)

---

## Story 4.9: Print-Friendly View (P2)

**As a** user  
**I want** to print tickets in a clean format  
**So that** I can have physical copies for meetings

### Acceptance Criteria
- [ ] "Print" button triggers print dialog
- [ ] Print view removes navigation and unnecessary UI
- [ ] Tickets display in clean, readable format
- [ ] Page breaks between tickets (optional)
- [ ] Header with repo name and date
- [ ] Footer with page numbers

### UI/UX Considerations
- **Print Button**: Icon button in header
- **Print Styles**: CSS media query `@media print`
- **Layout**: Single column, black text on white
- **Typography**: Serif font for better readability
- **Margins**: Appropriate margins for printing
- **Color**: Convert colored badges to grayscale

### Technical Notes
```typescript
// Print styles in CSS
@media print {
  .no-print {
    display: none !important;
  }
  
  .ticket-card {
    page-break-inside: avoid;
    border: 1px solid #000;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  body {
    font-family: Georgia, serif;
    color: #000;
    background: #fff;
  }
}

// Trigger print
const handlePrint = () => {
  window.print();
};
```

### Dependencies
- Story 3.2 (tickets display)

---

## Story 4.10: Export History & Templates (P3)

**As a** user  
**I want** to save export configurations as templates  
**So that** I can reuse them for future analyses

### Acceptance Criteria
- [ ] "Save as Template" option in export settings
- [ ] Name and save field selections, format preferences
- [ ] "Load Template" dropdown in export modal
- [ ] Edit and delete saved templates
- [ ] Export history shows past exports with timestamps
- [ ] Re-download previous exports

### UI/UX Considerations
- **Template Manager**: Modal or sidebar for managing templates
- **Template List**: Cards showing template name, fields, format
- **Quick Actions**: Edit, Delete, Duplicate buttons
- **History View**: Table with date, repo, ticket count, download link
- **Storage**: Use localStorage for MVP, database for production

### Technical Notes
```typescript
interface ExportTemplate {
  id: string;
  name: string;
  fields: string[];
  format: 'csv' | 'json';
  createdAt: string;
}

const saveTemplate = (template: Omit<ExportTemplate, 'id' | 'createdAt'>) => {
  const newTemplate: ExportTemplate = {
    ...template,
    id: generateUniqueId(),
    createdAt: new Date().toISOString()
  };
  
  const templates = JSON.parse(localStorage.getItem('exportTemplates') || '[]');
  templates.push(newTemplate);
  localStorage.setItem('exportTemplates', JSON.stringify(templates));
};

const loadTemplate = (templateId: string): ExportTemplate | null => {
  const templates = JSON.parse(localStorage.getItem('exportTemplates') || '[]');
  return templates.find((t: ExportTemplate) => t.id === templateId) || null;
};
```

### Dependencies
- Story 4.1 (export functionality exists)
- Story 4.2 (export settings exist)