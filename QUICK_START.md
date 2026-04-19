# 🚀 Quick Start Guide

## Get Started in 3 Steps

### Step 1: Open the Application
Simply double-click on `index.html` or open it in your browser.

### Step 2: Describe Your Vision
Enter what you want to build, for example:
- "A landing page for a bakery with menu and contact form"
- "A portfolio website showcasing my photography"
- "A dashboard with charts and data tables"
- "An e-commerce product page"

### Step 3: Generate!
Click "Start Generation" and watch the AI:
1. ✨ Refine your prompt
2. 💬 Debate the best approach
3. ⚙️ Generate structured code
4. 🎨 Show live preview
5. 📦 Package for download

## What Makes This Special?

### 🎯 Intelligent Prompt Refinement
Your casual description becomes a professional specification.

### 🤖 AI Debate System
Two AI agents (Optimist & Pessimist) debate to find the optimal solution:
- **Optimist**: "Let's add animations and modern features!"
- **Pessimist**: "Keep it simple and maintainable"
- **Result**: Perfect balance

### 📁 Structured Code Output
Unlike other AI generators that dump everything in one file, this creates:
```
project/
├── index.html           # Clean HTML
├── css/
│   ├── main.css        # Layout & core styles
│   └── components.css  # Component styles
└── js/
    ├── api.js          # API logic
    ├── utils.js        # Utilities
    ├── components.js   # Components
    └── main.js         # Main app
```

**Every module in its own file!** Easy to maintain, extend, and understand.

## Example Workflow

```
You: "landing page for a coffee shop"
    ↓
AI Refiner: Enhances to professional spec
    ↓
Optimist: "Add animations, hero section, menu showcase!"
Pessimist: "Keep it simple, fast-loading, accessible"
    ↓
Final Plan: Balanced, optimal solution
    ↓
Generator: Creates 8 well-organized files
    ↓
Preview: Live website ready!
    ↓
Download: Complete ZIP with README
```

## Pro Tips

### 💡 For Better Results
- Be specific about your target audience
- Mention key features you need
- Specify a style if you have one in mind
- Include any must-have sections

### ⚡ For Faster Generation
- Reduce debate rounds in `js/config.js`
- Keep descriptions focused
- Use `gpt-4o-mini` model (already configured)

### 🎨 For More Creative Output
- Increase temperature in config
- Add more debate rounds
- Be open with your description

## What Can You Build?

✅ Landing pages
✅ Portfolio websites
✅ Product pages
✅ Dashboards
✅ Forms & surveys
✅ Galleries
✅ Blogs
✅ Documentation sites
✅ Single-page apps
✅ Marketing pages

## Common Use Cases

### For Developers
- Quick prototypes
- Starting templates
- Learning structured code
- Client mockups

### For Designers
- Interactive prototypes
- Design explorations
- Client presentations
- Proof of concepts

### For Entrepreneurs
- MVP landing pages
- Product showcases
- Quick experiments
- Pitch materials

## Need Help?

1. **Check the console**: Press F12 in browser
2. **Review README.md**: Full documentation
3. **Verify API key**: In `js/config.js`
4. **Check internet**: API calls need connection

## Next Steps

After generation:
1. **Preview**: See your site live
2. **Download**: Get ZIP file
3. **Customize**: Edit any file
4. **Deploy**: Upload to hosting

## File Structure Explained

### HTML Files
- Semantic, accessible markup
- Proper meta tags
- Linked to CSS and JS

### CSS Files
- `main.css`: Layout, typography, core styles
- `components.css`: Specific component styles
- Modern features: Grid, Flexbox, Variables

### JavaScript Files
- `config.js`: Configuration
- `api.js`: OpenAI API communication
- `promptRefiner.js`: Prompt enhancement
- `debateEngine.js`: AI debate system
- `codeGenerator.js`: Code generation
- `fileManager.js`: Preview & download
- `ui.js`: UI control
- `app.js`: Main orchestrator

Each module has ONE job - clean and maintainable!

## Why File Structure Matters

❌ **Bad**: Everything in one file
```html
<style>/* 500 lines of CSS */</style>
<script>/* 1000 lines of JS */</script>
```

✅ **Good**: Organized files
```
css/layout.css      ← Easy to find
css/components.css  ← Easy to update
js/api.js           ← Easy to test
js/ui.js            ← Easy to debug
```

## Advanced Usage

### Change AI Model
Edit `js/config.js`:
```javascript
MODEL: 'gpt-4'  // Higher quality (more expensive)
```

### Adjust Debate
```javascript
DEBATE_ROUNDS: 3  // More thorough (slower)
```

### Customize Temperature
```javascript
TEMPERATURE: 0.9  // More creative
```

## Keyboard Shortcuts

- **Ctrl+Enter** in textarea: Start generation
- **F12**: Open browser console
- **Ctrl+Shift+I**: Developer tools

---

**Ready? Open `index.html` and start building!** 🚀
