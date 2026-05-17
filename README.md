# Curious Bob

**AI-Powered Repository Analysis & Engineering Ticket Generator**

Transform legacy codebases into actionable engineering plans. Curious Bob analyzes GitHub repositories using AI to identify modules, generate tickets, and assign work to your team—helping you turn ideas into impact faster.

**Built for IBM Bob Hackathon 2026**  


---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Functionalities](#-key-functionalities)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [How IBM Bob Was Used](#-how-ibm-bob-was-used-in-development)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Documentation](#-documentation)

---

## 🎯 Problem Statement

Engineering teams face significant challenges when working with legacy codebases:

- **Lack of Documentation**: Old repositories often have outdated or missing documentation
- **Unclear Ownership**: No clear assignment of responsibilities for different modules
- **Technical Debt**: Hidden vulnerabilities, performance issues, and code smells
- **Slow Onboarding**: New team members struggle to understand complex codebases
- **Manual Analysis**: Code reviews and refactoring planning are time-consuming

These issues slow down development, increase risk, and make it difficult to prioritize engineering work effectively.

---

## 💡 Solution

**Curious Bob** automates repository analysis using AI to:

1. **Understand Repository Structure**: Analyzes file organization, dependencies, and architecture patterns
2. **Identify Logical Modules**: Breaks down monolithic codebases into manageable, cohesive modules
3. **Generate Actionable Tickets**: Creates specific, assignable engineering tasks with code references
4. **Assign to Team Members**: Automatically assigns tickets based on expertise (Security Engineer, Senior SWE, etc.)
5. **Export Results**: Provides CSV exports for integration with project management tools

The solution uses a two-phase analysis approach to manage API constraints and provide focused insights:
- **Phase 1 (Overview)**: Analyzes repository structure to identify logical modules
- **Phase 2 (Deep Dive)**: Performs detailed analysis on selected modules to generate tickets

---

## ✨ Key Functionalities

### 🔍 Repository Analysis
- Accepts any public GitHub repository URL
- Fetches repository metadata, file structure, and configuration files
- Filters out binaries, node_modules, and irrelevant files
- Analyzes package.json, README.md, and other config files

### 🧩 Intelligent Module Detection
- Uses Google Gemini 3 Flash to identify logical modules
- Detects patterns: service-based, directory-based, bounded contexts
- Provides module descriptions and file counts
- Suggests relevant analysis modes per module

### 🎫 Ticket Generation
- Creates 3-10 actionable tickets per module
- Includes specific file references and line numbers
- Provides concrete action items and implementation steps
- Assigns tickets to appropriate team roles

### 👥 Team Assignment
- Default team roster with 10 common engineering roles
- Intelligent assignment based on ticket category
- Customizable team roster (future enhancement)

### 📊 Export & Integration
- CSV export with all ticket details
- Structured JSON responses for API integration
- Future: Jira, GitHub Issues, Notion integration

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Material UI (MUI) + shadcn/ui
- **Icons**: Material Icons

### Backend
- **Runtime**: Next.js API Routes (serverless)
- **AI/LLM**: Google Gemini 1.5 Flash
- **GitHub Integration**: Octokit REST API
- **Validation**: Zod

### Infrastructure
- **Hosting**: Vercel
- **Environment**: Vercel Environment Variables
- **Analytics**: Vercel Analytics (built-in)

### Key Dependencies
```json
{
  "@google/generative-ai": "^0.x.x",
  "@octokit/rest": "^20.x.x",
  "@mui/material": "^5.x.x",
  "next": "^14.x.x",
  "zod": "^3.x.x"
}
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js**: 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**: Package manager
- **Google AI Studio API Key**: [Get your key](https://aistudio.google.com/app/apikey)
- **GitHub Token** (optional): [Generate token](https://github.com/settings/tokens) for higher rate limits

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/diiegoq/curious-bob.git
   cd curious-bob
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Required: Google AI Studio API Key
   GOOGLE_AI_API_KEY=your-google-ai-studio-key-here
   
   # Optional: GitHub Personal Access Token (increases rate limit from 60 to 5000 req/hour)
   GITHUB_TOKEN=ghp_your_token_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Deploying to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Important**: Add environment variables in the Vercel dashboard under Project Settings → Environment Variables.

---

## 🤖 How IBM Bob Was Used in Development

Curious Bob was built **entirely using IBM Bob's multi-mode workflow**, demonstrating the power of AI-assisted development:

### 📝 Plan Mode: Strategic Planning
- **Created detailed technical specifications** in the [`plans/`](plans/) directory
- **Designed system architecture** with component interactions and data flow
- **Defined API contracts** with request/response schemas
- **Planned UI/UX** with component hierarchies and user flows
- **Optimized LLM prompts** for cost-effective analysis
- **Created implementation roadmap** with hourly breakdown for hackathon timeline

**Key Planning Documents**:
- [`01-technical-architecture.md`](plans/01-technical-architecture.md) - System design and tech stack
- [`02-api-specifications.md`](plans/02-api-specifications.md) - API endpoints and data schemas
- [`03-frontend-design.md`](plans/03-frontend-design.md) - UI components and user flows
- [`04-llm-prompt-strategy.md`](plans/04-llm-prompt-strategy.md) - Prompt engineering and optimization
- [`05-implementation-roadmap.md`](plans/05-implementation-roadmap.md) - 1-day hackathon timeline

### 💻 Code Mode: Implementation
- **Implemented GitHub API integration** for repository analysis
- **Built LLM integration** with Google Gemini 1.5 Flash
- **Created API routes** for overview and module analysis
- **Developed React components** with Material UI
- **Implemented CSV export** functionality
- **Added error handling** and loading states

### ❓ Ask Mode: Validation & Understanding
- **Clarified requirements** before implementation
- **Validated technical decisions** against best practices
- **Debugged issues** with AI assistance
- **Optimized code** based on feedback
- **Ensured alignment** with project goals

### 🔄 Iterative Development Workflow

```
Plan Mode → Create detailed specs
    ↓
Code Mode → Implement features
    ↓
Ask Mode → Validate & debug
    ↓
Plan Mode → Refine approach
    ↓
Code Mode → Iterate
```

This workflow enabled **rapid development** while maintaining **high code quality** and **clear documentation**.

---

## 📁 Project Structure

```
curious-bob/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Material UI theme
│   ├── page.tsx                 # Landing page + repository input
│   ├── analyze/page.tsx         # Module analysis page
│   ├── results/page.tsx         # Ticket results display
│   └── api/
│       ├── overview/route.ts    # Phase 1: Module detection API
│       └── module/route.ts      # Phase 2: Ticket generation API
├── components/                   # React components
│   ├── ui/                      # shadcn/ui base components
│   ├── PerspectiveSelector.tsx # Analysis mode selection
│   ├── PerspectiveCard.tsx     # Individual perspective card
│   └── MermaidDiagram.tsx      # Architecture diagram renderer
├── lib/                         # Core utilities
│   ├── github.ts               # GitHub API client (Octokit)
│   ├── llm.ts                  # Google Gemini integration
│   ├── types.ts                # TypeScript type definitions
│   └── perspectives.ts         # Analysis perspective configs
├── plans/                       # Detailed planning documents
│   ├── 01-technical-architecture.md
│   ├── 02-api-specifications.md
│   ├── 03-frontend-design.md
│   ├── 04-llm-prompt-strategy.md
│   └── 05-implementation-roadmap.md
├── .env.local                   # Environment variables (not in git)
├── AGENTS.md                    # AI agent development guidelines
└── README.md                    # This file
```

---

## 📖 Usage Guide

### 1. Analyze a Repository

1. **Navigate to the home page**
2. **Paste a GitHub repository URL**
   ```
   Example: https://github.com/vercel/next.js
   ```
3. **Click "Analyze Repository"**
4. **Wait 5-15 seconds** for module detection

### 2. Select a Module

1. **Review detected modules** (3-5 modules displayed)
2. **Click "Analyze Module"** on your chosen module
3. **Select analysis perspective** (optional):
   - Technical Debt & Code Quality
   - Security Vulnerabilities
   - Performance & Scalability
   - UI/UX Improvements
   - And more...

### 3. Review Generated Tickets

1. **View tickets** with priorities, assignments, and details
2. **Review code locations** and suggested actions
3. **Export to CSV** for project management tools

### Example Workflow

```
Input: https://github.com/facebook/react
   ↓
Detected Modules:
   • React Core (450 files)
   • React DOM (120 files)
   • React Reconciler (85 files)
   ↓
Select: React Core
   ↓
Generated Tickets:
   • CB-CORE-001: Optimize reconciliation algorithm [High]
   • CB-CORE-002: Add TypeScript strict mode [Medium]
   • CB-CORE-003: Update deprecated lifecycle methods [Low]
   ↓
Export: curious-bob-tickets-react-core.csv
```

---

## 📚 Documentation

### Planning Documents

Comprehensive technical specifications are available in the [`plans/`](plans/) directory:

- **[Technical Architecture](plans/01-technical-architecture.md)**: System design, component interactions, file structure
- **[API Specifications](plans/02-api-specifications.md)**: Endpoint contracts, data schemas, error handling
- **[Frontend Design](plans/03-frontend-design.md)**: Component hierarchy, user flows, Material UI patterns
- **[LLM Prompt Strategy](plans/04-llm-prompt-strategy.md)**: Prompt templates, token optimization, cost analysis
- **[Implementation Roadmap](plans/05-implementation-roadmap.md)**: Hackathon timeline with hourly breakdown
- **[Phase Implementation Guides](plans/)**: Step-by-step guides for each development phase

### Development Guidelines

See [`AGENTS.md`](AGENTS.md) for:
- Code patterns and best practices
- API usage examples
- Common issues and solutions
- Testing strategies
- Environment configuration

---

## 🎯 Hackathon Context

**Event**: IBM Bob Hackathon 2026  
**Theme**: Turn Idea into Impact Faster  

### Hackathon Priorities

✅ **Must Have** (Implemented):
- Accept GitHub repository URLs
- Detect logical modules
- Generate actionable tickets
- Export to CSV
- Basic error handling

⏳ **Nice to Have** (Future):
- Multiple analysis perspectives
- Custom team rosters
- Advanced filtering
- Dark mode
- Integration with Jira/GitHub Issues

---

## 🚧 Known Limitations

- **Public repositories only** (no authentication)
- **20 files per module** (API timeout constraints)
- **60-second timeout** per API call (Vercel limit)
- **No caching** (repeated analyses re-fetch data)
- **Single analysis mode** (multi-perspective in progress)
- **Default team roster** (custom rosters not yet supported)

---

## 🔮 Future Enhancements

### Phase 1: Core Improvements
- [ ] User authentication
- [ ] Private repository support
- [ ] Result caching (Redis)
- [ ] Custom team rosters
- [ ] Multiple analysis perspectives

### Phase 2: Integrations
- [ ] Jira export
- [ ] GitHub Issues export
- [ ] Notion export
- [ ] Slack notifications

### Phase 3: Advanced Features
- [ ] Historical analysis tracking
- [ ] Multi-module comparison
- [ ] Architecture diagram generation
- [ ] Database schema detection
- [ ] Custom analysis modes

---

## 🤝 Contributing

This is a hackathon MVP project. Contributions are welcome for post-hackathon development!

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **IBM Bob**: For enabling rapid, AI-assisted development
- **Google Gemini**: For cost-effective, high-quality code analysis
- **Vercel**: For seamless deployment and hosting
- **Material UI**: For beautiful, accessible components
- **Next.js**: For the powerful React framework

---

## 📞 Contact & Resources

- **Planning Documents**: [`plans/`](plans/) directory
- **Development Guidelines**: [`AGENTS.md`](AGENTS.md)
- **Original Idea**: [`idea.md`](idea.md)

---

**Built with ❤️ using IBM Bob | IBM Bob Hackathon 2026**
