import { AnalysisPerspective, PERSPECTIVES } from './types';

interface FileContent {
  path: string;
  content: string;
}

export function getPerspectivePrompt(
  perspective: AnalysisPerspective,
  moduleName: string,
  files: FileContent[]
): string {
  const perspectiveInfo = PERSPECTIVES[perspective];
  const filesContent = files.map(f => `=== ${f.path} ===\n${f.content}`).join('\n\n');
  
  const basePrompt = `
You are analyzing a code module from the perspective of: ${perspectiveInfo.name}

MODULE: ${moduleName}
FILES ANALYZED: ${files.length}
TARGET ROLES: ${perspectiveInfo.targetRoles.join(', ')}

SOURCE CODE:
${filesContent}

`;

  switch (perspective) {
    case 'security':
      return getSecurityPrompt(basePrompt, perspectiveInfo.team);
    case 'business-logic':
      return getBusinessLogicPrompt(basePrompt, perspectiveInfo.team);
    case 'ui-ux':
      return getUIUXPrompt(basePrompt, perspectiveInfo.team);
    case 'technical-debt':
      return getTechnicalDebtPrompt(basePrompt, perspectiveInfo.team);
    case 'performance':
      return getPerformancePrompt(basePrompt, perspectiveInfo.team);
    case 'database':
      return getDatabasePrompt(basePrompt, perspectiveInfo.team);
    case 'testing':
      return getTestingPrompt(basePrompt, perspectiveInfo.team);
    case 'devops':
      return getDevOpsPrompt(basePrompt, perspectiveInfo.team);
    case 'api-design':
      return getAPIDesignPrompt(basePrompt, perspectiveInfo.team);
    case 'accessibility':
      return getAccessibilityPrompt(basePrompt, perspectiveInfo.team);
    default:
      return getDefaultPrompt(basePrompt, perspectiveInfo.team);
  }
}

function getSecurityPrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
SECURITY FOCUS AREAS:

1. Authentication & Authorization
   - JWT handling, session management
   - Password storage, RBAC
   - Token expiration and refresh
   - Multi-factor authentication

2. Input Validation & Injection
   - SQL injection, XSS, command injection
   - Path traversal, LDAP injection
   - NoSQL injection, XML injection

3. Sensitive Data Exposure
   - Hardcoded secrets, API keys, passwords
   - Exposed PII (Personal Identifiable Information)
   - Insecure storage, logging sensitive data
   - Unencrypted data transmission

4. Dependency Vulnerabilities
   - Outdated packages with known CVEs
   - Vulnerable dependencies
   - Supply chain security

5. Security Best Practices
   - HTTPS enforcement, CORS configuration
   - Rate limiting, security headers
   - Error handling (no stack traces in production)
   - Secure session management

TICKET CATEGORIES:
- Critical Vulnerability
- Authentication Flaw
- Data Exposure
- Injection Risk
- Dependency Vulnerability
- Security Best Practice

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 security-focused tickets with:
- CVE numbers if applicable
- OWASP Top 10 references (e.g., A02:2021)
- Exploit scenarios
- Specific security fixes with code examples
- Priority based on severity (Critical, High, Medium, Low)

RESPONSE FORMAT (JSON):
{
  "perspective": "security",
  "tickets": [
    {
      "id": "CB-[MODULE]-SEC-001",
      "title": "Descriptive security issue title",
      "category": "Critical Vulnerability | Authentication Flaw | Data Exposure | Injection Risk | Dependency Vulnerability | Security Best Practice",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with security impact",
      "files": ["file1.ts", "file2.ts"],
      "actions": ["Specific action 1", "Specific action 2"],
      "cveNumbers": ["CVE-2023-XXXXX"],
      "owaspReferences": ["A02:2021 - Cryptographic Failures"],
      "securityImpact": "Explanation of security impact",
      "exploitScenario": "How this could be exploited"
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall security assessment of the module",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "securityScore": "0-100",
      "criticalIssues": 0,
      "highIssues": 0,
      "mediumIssues": 0,
      "lowIssues": 0
    }
  }
}`;
}

function getBusinessLogicPrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
BUSINESS LOGIC FOCUS AREAS:

1. Business Rules Implementation
   - Correct implementation of business logic
   - Edge case handling
   - Validation completeness
   - Business constraint enforcement

2. Workflow Completeness
   - End-to-end workflow coverage
   - Missing workflow steps
   - Error scenario handling
   - State management

3. Feature Gaps
   - Partial implementations
   - Missing requirements
   - Inconsistencies with business requirements
   - Incomplete features

4. Data Validation
   - Business-level constraints
   - Data integrity rules
   - Validation at multiple layers
   - Input sanitization

5. Business Process Alignment
   - Alignment with business processes
   - Compliance with business rules
   - Domain model accuracy

TICKET CATEGORIES:
- Feature Gap
- Business Logic Bug
- Workflow Improvement
- Data Validation Issue
- Business Rule Violation

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 business-focused tickets with:
- Business impact explanation
- Concrete examples of issues
- Business-aligned solutions
- Stakeholder perspectives
- Priority based on business impact

RESPONSE FORMAT (JSON):
{
  "perspective": "business-logic",
  "tickets": [
    {
      "id": "CB-[MODULE]-BIZ-001",
      "title": "Descriptive business issue title",
      "category": "Feature Gap | Business Logic Bug | Workflow Improvement | Data Validation Issue | Business Rule Violation",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with business context",
      "files": ["file1.ts", "file2.ts"],
      "actions": ["Specific action 1", "Specific action 2"],
      "businessImpact": "Explanation of business impact"
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall business logic assessment",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "featureCompleteness": "0-100%",
      "businessRulesCovered": 0,
      "workflowGaps": 0
    }
  }
}`;
}

function getUIUXPrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
UI/UX FOCUS AREAS:

1. Accessibility (WCAG 2.1 AA)
   - Semantic HTML elements
   - ARIA labels and roles
   - Keyboard navigation support
   - Screen reader compatibility
   - Color contrast ratios
   - Focus indicators

2. Responsive Design
   - Mobile responsiveness
   - Breakpoint implementation
   - Touch target sizes (min 44x44px)
   - Viewport configuration
   - Flexible layouts

3. User Experience
   - Loading states and spinners
   - Error messages and feedback
   - Form validation feedback
   - Navigation clarity
   - User flow optimization

4. Performance
   - Image optimization
   - Lazy loading
   - Bundle size optimization
   - Render performance
   - Animation performance

5. Design Consistency
   - Component reusability
   - Design system adherence
   - Consistent spacing and typography
   - Color palette consistency
   - Icon usage

TICKET CATEGORIES:
- Accessibility Issue
- Responsive Design Bug
- UX Improvement
- Performance Optimization
- Design Inconsistency

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 UI/UX-focused tickets with:
- WCAG guideline references (e.g., 1.4.3 Contrast)
- Specific UI components affected
- Before/after examples
- Design patterns to follow
- Priority based on user impact

RESPONSE FORMAT (JSON):
{
  "perspective": "ui-ux",
  "tickets": [
    {
      "id": "CB-[MODULE]-UX-001",
      "title": "Descriptive UI/UX issue title",
      "category": "Accessibility Issue | Responsive Design Bug | UX Improvement | Performance Optimization | Design Inconsistency",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with UX impact",
      "files": ["file1.tsx", "file2.tsx"],
      "actions": ["Specific action 1", "Specific action 2"],
      "wcagGuidelines": ["1.4.3 Contrast (Minimum)", "2.1.1 Keyboard"]
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall UI/UX assessment",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "accessibilityScore": "0-100",
      "wcagViolations": 0,
      "responsiveIssues": 0,
      "uxImprovements": 0
    }
  }
}`;
}

function getTechnicalDebtPrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
TECHNICAL DEBT FOCUS AREAS:

1. Code Smells
   - Long methods/functions
   - Duplicate code
   - Complex conditionals
   - God objects/classes
   - Dead code

2. Refactoring Opportunities
   - Extract method/class
   - Simplify conditionals
   - Remove duplication
   - Improve naming
   - Reduce coupling

3. Maintainability Issues
   - Poor code organization
   - Lack of documentation
   - Inconsistent patterns
   - Hard-to-test code
   - Magic numbers/strings

4. Best Practices Violations
   - SOLID principles violations
   - DRY violations
   - Separation of concerns
   - Single responsibility
   - Dependency injection

5. Code Quality Metrics
   - Cyclomatic complexity
   - Code coverage
   - Technical debt ratio
   - Maintainability index

TICKET CATEGORIES:
- Code Smell
- Refactoring Needed
- Maintainability Issue
- Best Practice Violation
- Documentation Gap

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 technical debt tickets with:
- Specific code smells identified
- Refactoring suggestions with examples
- Impact on maintainability
- Estimated effort
- Priority based on technical impact

RESPONSE FORMAT (JSON):
{
  "perspective": "technical-debt",
  "tickets": [
    {
      "id": "CB-[MODULE]-DEBT-001",
      "title": "Descriptive technical debt issue title",
      "category": "Code Smell | Refactoring Needed | Maintainability Issue | Best Practice Violation | Documentation Gap",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with code examples",
      "files": ["file1.ts", "file2.ts"],
      "actions": ["Specific refactoring action 1", "Specific refactoring action 2"]
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall technical debt assessment",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "technicalDebtScore": "0-100",
      "codeSmells": 0,
      "refactoringOpportunities": 0,
      "averageComplexity": "Low | Medium | High"
    }
  }
}`;
}

function getPerformancePrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
PERFORMANCE & SCALABILITY FOCUS AREAS:

1. Performance Bottlenecks
   - Slow database queries
   - N+1 query problems
   - Inefficient algorithms
   - Memory leaks
   - CPU-intensive operations

2. Optimization Opportunities
   - Caching strategies
   - Query optimization
   - Algorithm improvements
   - Resource pooling
   - Lazy loading

3. Scalability Issues
   - Horizontal scaling limitations
   - Vertical scaling constraints
   - Load balancing needs
   - Database sharding opportunities
   - Microservices candidates

4. Resource Management
   - Memory usage
   - Connection pooling
   - File handle management
   - Thread/process management
   - Resource cleanup

5. Monitoring & Profiling
   - Performance metrics
   - Logging overhead
   - Monitoring gaps
   - Profiling opportunities

TICKET CATEGORIES:
- Performance Bottleneck
- Optimization Opportunity
- Scalability Issue
- Resource Management
- Monitoring Gap

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 performance-focused tickets with:
- Specific bottlenecks identified
- Performance metrics (if available)
- Optimization strategies
- Expected performance gains
- Priority based on performance impact

RESPONSE FORMAT (JSON):
{
  "perspective": "performance",
  "tickets": [
    {
      "id": "CB-[MODULE]-PERF-001",
      "title": "Descriptive performance issue title",
      "category": "Performance Bottleneck | Optimization Opportunity | Scalability Issue | Resource Management | Monitoring Gap",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with performance impact",
      "files": ["file1.ts", "file2.ts"],
      "actions": ["Specific optimization action 1", "Specific optimization action 2"]
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall performance assessment",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "performanceScore": "0-100",
      "bottlenecks": 0,
      "optimizationOpportunities": 0,
      "scalabilityRating": "Poor | Fair | Good | Excellent"
    }
  }
}`;
}

function getDatabasePrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
DATABASE & DATA MANAGEMENT FOCUS AREAS:

1. Query Optimization
   - Slow queries
   - Missing indexes
   - N+1 query problems
   - Inefficient joins
   - Query plan analysis

2. Schema Design
   - Normalization issues
   - Denormalization opportunities
   - Table relationships
   - Data types optimization
   - Constraint definitions

3. Data Integrity
   - Foreign key constraints
   - Unique constraints
   - Check constraints
   - Data validation
   - Referential integrity

4. Migration Management
   - Migration scripts
   - Rollback strategies
   - Data migration safety
   - Schema versioning
   - Backward compatibility

5. Database Performance
   - Connection pooling
   - Transaction management
   - Locking strategies
   - Partitioning opportunities
   - Caching strategies

TICKET CATEGORIES:
- Query Optimization
- Schema Design Issue
- Data Integrity Problem
- Migration Needed
- Database Performance

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 database-focused tickets with:
- Specific database issues
- Query examples
- Schema improvements
- Migration strategies
- Priority based on data impact

RESPONSE FORMAT (JSON):
{
  "perspective": "database",
  "tickets": [
    {
      "id": "CB-[MODULE]-DB-001",
      "title": "Descriptive database issue title",
      "category": "Query Optimization | Schema Design Issue | Data Integrity Problem | Migration Needed | Database Performance",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with database impact",
      "files": ["file1.ts", "file2.ts"],
      "actions": ["Specific database action 1", "Specific database action 2"]
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall database assessment",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "databaseScore": "0-100",
      "slowQueries": 0,
      "schemaIssues": 0,
      "integrityProblems": 0
    }
  }
}`;
}

function getTestingPrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
TESTING & QUALITY ASSURANCE FOCUS AREAS:

1. Test Coverage
   - Unit test coverage
   - Integration test coverage
   - E2E test coverage
   - Critical path coverage
   - Edge case coverage

2. Testing Strategy
   - Test pyramid adherence
   - Test organization
   - Test naming conventions
   - Test data management
   - Mock/stub usage

3. Edge Cases & Scenarios
   - Boundary conditions
   - Error scenarios
   - Race conditions
   - Concurrent access
   - Invalid inputs

4. Test Quality
   - Test maintainability
   - Test readability
   - Test independence
   - Test speed
   - Flaky tests

5. Automation Opportunities
   - Automated testing gaps
   - CI/CD integration
   - Regression testing
   - Performance testing
   - Security testing

TICKET CATEGORIES:
- Missing Tests
- Test Quality Issue
- Edge Case Not Covered
- Test Automation Gap
- Testing Strategy Improvement

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 testing-focused tickets with:
- Specific testing gaps
- Test scenarios to add
- Coverage improvements
- Testing best practices
- Priority based on risk

RESPONSE FORMAT (JSON):
{
  "perspective": "testing",
  "tickets": [
    {
      "id": "CB-[MODULE]-TEST-001",
      "title": "Descriptive testing issue title",
      "category": "Missing Tests | Test Quality Issue | Edge Case Not Covered | Test Automation Gap | Testing Strategy Improvement",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with testing impact",
      "files": ["file1.ts", "file2.ts"],
      "actions": ["Specific testing action 1", "Specific testing action 2"]
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall testing assessment",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "testCoverage": "0-100%",
      "missingTests": 0,
      "edgeCasesNotCovered": 0,
      "testQualityScore": "0-100"
    }
  }
}`;
}

function getDevOpsPrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
DEVOPS & INFRASTRUCTURE FOCUS AREAS:

1. CI/CD Pipeline
   - Build automation
   - Deployment automation
   - Pipeline optimization
   - Artifact management
   - Release strategies

2. Infrastructure as Code
   - Configuration management
   - Infrastructure provisioning
   - Environment consistency
   - Version control
   - Documentation

3. Monitoring & Observability
   - Application monitoring
   - Infrastructure monitoring
   - Log aggregation
   - Alerting setup
   - Metrics collection

4. Deployment Strategy
   - Blue-green deployment
   - Canary releases
   - Rollback procedures
   - Zero-downtime deployment
   - Feature flags

5. Security & Compliance
   - Secret management
   - Access control
   - Compliance requirements
   - Security scanning
   - Vulnerability management

TICKET CATEGORIES:
- CI/CD Improvement
- Infrastructure Issue
- Monitoring Gap
- Deployment Strategy
- Security Configuration

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 DevOps-focused tickets with:
- Specific infrastructure issues
- CI/CD improvements
- Monitoring enhancements
- Deployment optimizations
- Priority based on operational impact

RESPONSE FORMAT (JSON):
{
  "perspective": "devops",
  "tickets": [
    {
      "id": "CB-[MODULE]-OPS-001",
      "title": "Descriptive DevOps issue title",
      "category": "CI/CD Improvement | Infrastructure Issue | Monitoring Gap | Deployment Strategy | Security Configuration",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with operational impact",
      "files": ["file1.ts", "file2.ts"],
      "actions": ["Specific DevOps action 1", "Specific DevOps action 2"]
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall DevOps assessment",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "devopsScore": "0-100",
      "cicdMaturity": "Low | Medium | High",
      "monitoringCoverage": "0-100%",
      "deploymentFrequency": "Daily | Weekly | Monthly"
    }
  }
}`;
}

function getAPIDesignPrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
API DESIGN & DOCUMENTATION FOCUS AREAS:

1. API Consistency
   - Naming conventions
   - Response formats
   - Error handling patterns
   - HTTP status codes
   - RESTful principles

2. Documentation
   - API documentation completeness
   - Request/response examples
   - Error documentation
   - Authentication documentation
   - Changelog maintenance

3. Versioning Strategy
   - API versioning approach
   - Backward compatibility
   - Deprecation strategy
   - Version migration path
   - Breaking changes handling

4. API Standards
   - OpenAPI/Swagger compliance
   - GraphQL schema design
   - API security standards
   - Rate limiting
   - Pagination patterns

5. Developer Experience
   - API usability
   - Error messages clarity
   - SDK availability
   - Testing tools
   - Onboarding documentation

TICKET CATEGORIES:
- API Inconsistency
- Documentation Gap
- Versioning Issue
- Standards Violation
- Developer Experience

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 API-focused tickets with:
- Specific API issues
- Documentation improvements
- Consistency enhancements
- Standards compliance
- Priority based on API consumer impact

RESPONSE FORMAT (JSON):
{
  "perspective": "api-design",
  "tickets": [
    {
      "id": "CB-[MODULE]-API-001",
      "title": "Descriptive API issue title",
      "category": "API Inconsistency | Documentation Gap | Versioning Issue | Standards Violation | Developer Experience",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with API impact",
      "files": ["file1.ts", "file2.ts"],
      "actions": ["Specific API action 1", "Specific API action 2"]
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall API design assessment",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "apiConsistencyScore": "0-100",
      "documentationCompleteness": "0-100%",
      "standardsCompliance": "0-100%",
      "developerExperienceScore": "0-100"
    }
  }
}`;
}

function getAccessibilityPrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
ACCESSIBILITY COMPLIANCE FOCUS AREAS:

1. WCAG 2.1 Level AA Compliance
   - Perceivable (text alternatives, adaptable, distinguishable)
   - Operable (keyboard accessible, enough time, seizures, navigable)
   - Understandable (readable, predictable, input assistance)
   - Robust (compatible with assistive technologies)

2. Screen Reader Support
   - ARIA labels and roles
   - Semantic HTML
   - Alt text for images
   - Form labels
   - Heading hierarchy

3. Keyboard Navigation
   - Tab order
   - Focus indicators
   - Keyboard shortcuts
   - Skip links
   - Focus management

4. Visual Accessibility
   - Color contrast (4.5:1 for text, 3:1 for UI)
   - Text sizing and spacing
   - Visual focus indicators
   - No color-only information
   - Responsive text

5. Assistive Technology
   - Screen reader compatibility
   - Voice control support
   - Magnification support
   - High contrast mode
   - Reduced motion support

TICKET CATEGORIES:
- WCAG Violation
- Screen Reader Issue
- Keyboard Navigation Problem
- Color Contrast Issue
- Assistive Technology Gap

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 accessibility-focused tickets with:
- Specific WCAG guideline violations
- Accessibility testing results
- Remediation steps
- Impact on users with disabilities
- Priority based on accessibility impact

RESPONSE FORMAT (JSON):
{
  "perspective": "accessibility",
  "tickets": [
    {
      "id": "CB-[MODULE]-A11Y-001",
      "title": "Descriptive accessibility issue title",
      "category": "WCAG Violation | Screen Reader Issue | Keyboard Navigation Problem | Color Contrast Issue | Assistive Technology Gap",
      "priority": "Critical | High | Medium | Low",
      "assignedTeamMember": "Team member from roster",
      "description": "Detailed description with accessibility impact",
      "files": ["file1.tsx", "file2.tsx"],
      "actions": ["Specific accessibility action 1", "Specific accessibility action 2"],
      "wcagGuidelines": ["1.1.1 Non-text Content", "2.1.1 Keyboard"]
    }
  ],
  "perspectiveInsights": {
    "summary": "Overall accessibility assessment",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {
      "wcagComplianceScore": "0-100",
      "levelAViolations": 0,
      "levelAAViolations": 0,
      "levelAAAViolations": 0,
      "accessibilityScore": "0-100"
    }
  }
}`;
}

function getDefaultPrompt(basePrompt: string, team: string[]): string {
  return `${basePrompt}
GENERAL CODE ANALYSIS FOCUS AREAS:

1. Code Quality
2. Best Practices
3. Potential Issues
4. Improvement Opportunities

TEAM ROSTER: ${team.join(', ')}

Generate 3-10 actionable tickets with clear descriptions, file references, and specific actions.

RESPONSE FORMAT (JSON):
{
  "perspective": "technical-debt",
  "tickets": [...],
  "perspectiveInsights": {
    "summary": "Overall assessment",
    "keyFindings": ["Finding 1", "Finding 2"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "metrics": {}
  }
}`;
}