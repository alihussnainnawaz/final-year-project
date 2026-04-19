# System Architecture

## Overview

The AI Frontend Generator is built with a modular, pipeline-based architecture where each component has a specific responsibility.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                         (index.html)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     UI CONTROLLER (ui.js)                       │
│  • Step management                                              │
│  • Animations & transitions                                     │
│  • Error/success notifications                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 MAIN ORCHESTRATOR (app.js)                      │
│  • Pipeline coordination                                        │
│  • Error handling                                               │
│  • State management                                             │
└─────┬──────┬──────┬──────┬──────┬────────────────────────────────┘
      │      │      │      │      │
      ▼      ▼      ▼      ▼      ▼
┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐
│ Prompt  │ │  Debate  │ │   Code    │ │   File   │ │    API     │
│ Refiner │ │  Engine  │ │ Generator │ │  Manager │ │   Client   │
└─────────┘ └──────────┘ └───────────┘ └──────────┘ └────────────┘
     │            │              │             │             │
     └────────────┴──────────────┴─────────────┴─────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  OpenAI API    │
                    │  (GPT-4-mini)  │
                    └────────────────┘
```

## Component Details

### 1. User Interface (index.html)
**Purpose**: Present information and gather user input

**Features**:
- Step-by-step wizard interface
- Input form for user prompts
- Real-time progress indicators
- Debate visualization
- Live preview iframe
- Download controls

**Styling**:
- `styles/main.css`: Core layout, typography, colors
- `styles/components.css`: Debate agents, alerts, badges

### 2. UI Controller (ui.js)
**Purpose**: Manage UI state and interactions

**Responsibilities**:
- Show/hide steps
- Loader management
- Notifications
- Button state control
- Animations

**Key Methods**:
```javascript
showStep(stepNumber)      // Navigate between steps
showLoader(loaderId)      // Display loading indicator
showNotification(msg)     // Toast notifications
animateIn(element)        // Entrance animations
```

### 3. Main Orchestrator (app.js)
**Purpose**: Coordinate the entire pipeline

**Pipeline Flow**:
```
start() 
  ↓
refinePrompt()
  ↓
runDebate()
  ↓
generateCode()
  ↓
showPreview()
```

**State Management**:
```javascript
this.refinedPrompt   // Stores refined specification
this.debateResult    // Stores debate history & conclusion
this.generatedProject // Stores all generated files
```

### 4. Prompt Refiner (promptRefiner.js)
**Purpose**: Transform casual input into professional specs

**Process**:
1. Receive user's raw input
2. Send to OpenAI with expert system prompt
3. Extract key requirements
4. Format and display results

**Output**:
```javascript
{
  originalPrompt: "user's input",
  refinedPrompt: "detailed specification",
  timestamp: "ISO date"
}
```

### 5. Debate Engine (debateEngine.js)
**Purpose**: Run multi-agent debate to find optimal solution

**Agents**:
- **Optimist**: Innovative, feature-rich approach
- **Pessimist**: Practical, maintainable approach

**Debate Flow**:
```
Round 1:
  Optimist proposes → Pessimist critiques

Round 2:
  Optimist refines → Pessimist validates

Conclusion:
  Synthesize both perspectives
```

**Key Methods**:
```javascript
runDebate(refinedPrompt)           // Execute full debate
getAgentResponse(agent, context)   // Get single response
generateConclusion()               // Create final plan
displayDebate()                    // Animate in UI
```

### 6. Code Generator (codeGenerator.js)
**Purpose**: Generate structured, modular code files

**Process**:
```
planFileStructure()
  ↓
Generate HTML files
  ↓
Generate CSS files
  ↓
Generate JavaScript files
```

**File Structure Planning**:
- Analyzes requirements
- Determines optimal structure
- Creates module breakdown
- Ensures separation of concerns

**Generation Strategy**:
- HTML: Semantic markup, accessibility
- CSS: Modern features, responsiveness
- JavaScript: ES6+, modularity, documentation

**Output**:
```javascript
{
  structure: {
    files: [
      {path, type, description},
      ...
    ]
  },
  files: Map<path, content>
}
```

### 7. File Manager (fileManager.js)
**Purpose**: Handle preview and download

**Capabilities**:
- Combine files for preview
- Create blob URLs for iframe
- Generate ZIP archives
- Create README
- Display statistics

**Key Methods**:
```javascript
createPreviewHTML()   // Combine all files
displayPreview()      // Show in iframe
downloadZip()         // Create & download ZIP
getStatistics()       // Project metrics
```

### 8. API Client (api.js)
**Purpose**: Communicate with OpenAI API

**Features**:
- Standard requests
- Streaming support (for future use)
- Error handling
- Connection testing

**Methods**:
```javascript
makeRequest(messages, temp, maxTokens)
streamRequest(messages, onChunk)
testConnection()
```

### 9. Configuration (config.js)
**Purpose**: Central configuration

**Settings**:
```javascript
OPENAI_API_KEY    // API authentication
MODEL             // GPT model to use
MAX_TOKENS        // Response length limit
TEMPERATURE       // Creativity level
DEBATE_ROUNDS     // Number of debate cycles
```

## Data Flow

### Complete Pipeline

```
User Input
    ↓
[promptRefiner.refine()]
    ↓
Refined Specification
    ↓
[debateEngine.runDebate()]
    ↓
    ┌─────────────────┐
    │  Debate Cycle   │
    │  (2 rounds)     │
    │                 │
    │ Optimist →      │
    │    ↓            │
    │ Pessimist →     │
    │    ↓            │
    │ Optimist →      │
    │    ↓            │
    │ Pessimist       │
    └────────┬────────┘
             ↓
    Final Conclusion
             ↓
[codeGenerator.generateProject()]
    ↓
    ┌──────────────────────────┐
    │  File Generation         │
    │                          │
    │  1. Plan structure       │
    │  2. Generate HTML        │
    │  3. Generate CSS         │
    │  4. Generate JS          │
    └──────────┬───────────────┘
               ↓
    Map<path, content>
               ↓
[fileManager.setFiles()]
    ↓
    ┌──────────────────┐
    │  Preview         │
    │  & Download      │
    └──────────────────┘
```

## Communication Pattern

### API Communication
```
Component → apiClient → OpenAI API
              ↓
         Response
              ↓
Component.processResponse()
```

### Error Handling
```
try {
  Component.operation()
} catch (error) {
  uiController.showError()
  console.error()
  throw new Error()
}
```

## State Management

### Global State
- `app.refinedPrompt`: Current specification
- `app.debateResult`: Debate outcome
- `app.generatedProject`: Generated files

### UI State
- `uiController.currentStep`: Active step (1-5)
- Button states (enabled/disabled)
- Loader visibility

### File State
- `fileManager.files`: Map of generated files
- Cached preview HTML
- Statistics

## Module Dependencies

```
app.js
  ├─ ui.js
  ├─ promptRefiner.js
  │   └─ api.js
  ├─ debateEngine.js
  │   └─ api.js
  ├─ codeGenerator.js
  │   └─ api.js
  └─ fileManager.js

All modules depend on:
  └─ config.js
```

## Extensibility Points

### Adding New Agents
```javascript
// In debateEngine.js
const newAgentPrompt = "...";
const newAgentResponse = await this.getAgentResponse(
  'newAgent',
  newAgentPrompt,
  context,
  round
);
```

### Adding New File Types
```javascript
// In codeGenerator.js
async generateNewFileType(fileInfo, conclusion) {
  // Generation logic
}
```

### Custom Refinement
```javascript
// In promptRefiner.js
async customRefine(userPrompt, options) {
  // Custom refinement logic
}
```

## Performance Considerations

### API Calls
- Prompt refinement: 1 call (~5s)
- Debate: 4-6 calls (~30s)
- Code generation: 6-10 calls (~60s)
- **Total**: ~12-17 API calls

### Optimization Strategies
- Reduce debate rounds
- Use faster model (gpt-4o-mini)
- Implement caching (future)
- Batch similar requests (future)

### Token Usage
- Prompt refinement: ~500 tokens
- Each debate round: ~1000 tokens
- Code generation: ~3000 tokens
- **Total**: ~8000-10000 tokens per run

## Security

### Current Implementation
- Client-side API key (development only)
- No data persistence
- No user authentication

### Production Recommendations
- Move API calls to backend
- Implement API key management
- Add rate limiting
- Implement user authentication
- Sanitize all inputs

## Testing Strategy

### Unit Testing (Recommended)
```javascript
// Test prompt refinement
test('refines simple prompt', async () => {
  const result = await promptRefiner.refine('landing page');
  expect(result.refinedPrompt).toBeDefined();
});

// Test file structure
test('generates valid structure', async () => {
  const structure = await codeGenerator.planFileStructure(spec);
  expect(structure.files.length).toBeGreaterThan(0);
});
```

### Integration Testing
- Test complete pipeline
- Verify file generation
- Check preview rendering
- Validate ZIP creation

## Future Enhancements

### Planned Features
- Template library
- Framework support (React, Vue)
- Backend generation
- Database schema
- API endpoint generation
- Deployment integration
- Version control
- Collaborative editing

### Architecture Evolution
```
Current: Single-user, client-side
    ↓
Next: Multi-user, hybrid
    ↓
Future: Cloud-native, scalable
```

---

This architecture is designed for:
✅ Modularity
✅ Maintainability  
✅ Extensibility
✅ Clear separation of concerns
✅ Easy testing
✅ Future growth
