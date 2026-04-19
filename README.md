# AI Frontend Generator

An intelligent system that transforms rough user ideas into production-ready frontend code through AI-powered prompt refinement, agent debate, and structured code generation.

## 🌟 Features

### 1. **Prompt Refinement**
- Takes casual user input and transforms it into professional specifications
- Identifies key features, design elements, and technical requirements
- Ensures clarity and completeness before generation

### 2. **AI Debate Mechanism**
- **Optimist Agent**: Proposes innovative, feature-rich solutions
- **Pessimist Agent**: Identifies practical constraints and potential issues
- Multiple rounds of debate to arrive at optimal decisions
- Balanced final conclusion combining both perspectives

### 3. **Structured Code Generation**
- **Modular file organization**: Each module gets its own file
- **Separation of concerns**: HTML, CSS, and JavaScript in separate files
- **Multiple JavaScript modules**: API, utilities, components, main logic
- **Multiple CSS files**: Layout, components, utilities
- Production-ready, clean, and maintainable code

### 4. **Live Preview & Download**
- Real-time preview of generated website
- Download complete project as ZIP file
- Includes README and proper file structure

## 📁 Project Structure

```
ai-frontend-generator/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Core styles and layout
│   └── components.css     # Component-specific styles
├── js/
│   ├── config.js          # Configuration and API key
│   ├── api.js             # OpenAI API communication
│   ├── promptRefiner.js   # Prompt refinement module
│   ├── debateEngine.js    # AI debate orchestration
│   ├── codeGenerator.js   # Code generation with file structure
│   ├── fileManager.js     # File management and ZIP creation
│   ├── ui.js              # UI controller
│   └── app.js             # Main application orchestrator
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (for OpenAI API calls)

### Installation

1. **Extract the files** to a directory on your computer

2. **Configure API Key**:
   - Your OpenAI API key is already configured in `js/config.js`
   - If you need to change it, edit the `OPENAI_API_KEY` value

3. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local server for better performance:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     
     # Using PHP
     php -S localhost:8000
     ```

4. **Start generating**:
   - Enter a description of the website you want to build
   - Click "Start Generation"
   - Watch the AI refine, debate, and generate your code!

## 💡 How It Works

### Pipeline Overview

```
User Input → Prompt Refinement → AI Debate → Code Generation → Preview & Download
```

### Detailed Flow

1. **User Input**: 
   - User describes their website idea in natural language
   - No technical knowledge required

2. **Prompt Refinement**:
   - AI analyzes and enhances the input
   - Creates detailed specifications
   - Identifies features, design, and technical requirements

3. **AI Debate**:
   - Optimist Agent proposes ambitious features
   - Pessimist Agent raises practical concerns
   - Multiple rounds of constructive debate
   - Final balanced implementation plan

4. **Code Generation**:
   - Plans optimal file structure
   - Generates HTML with semantic markup
   - Creates modular CSS files
   - Produces organized JavaScript modules
   - Each component in its own file

5. **Preview & Download**:
   - Live preview in iframe
   - Download complete project as ZIP
   - Includes README and file structure

## 🎯 Usage Examples

### Example 1: Simple Landing Page
**Input**: "landing page for a coffee shop"

**Output**: Complete project with:
- `index.html` - Semantic HTML structure
- `css/main.css` - Layout and typography
- `css/components.css` - Component styles
- `js/main.js` - Interactive elements
- `js/menu.js` - Menu functionality

### Example 2: Portfolio Website
**Input**: "portfolio website with projects gallery and contact form"

**Output**: Structured project with:
- Multiple HTML sections
- Separate CSS for layout, gallery, forms
- JavaScript modules for gallery, form validation, animations

### Example 3: Dashboard
**Input**: "admin dashboard with charts and data tables"

**Output**: Full project with:
- Dashboard HTML structure
- Separate CSS for layout, components, charts
- JavaScript modules for API, charts, tables, utilities

## ⚙️ Configuration

### API Settings (`js/config.js`)

```javascript
const CONFIG = {
    OPENAI_API_KEY: 'your-api-key-here',
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-4o-mini',  // Change model if needed
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.7,
    DEBATE_ROUNDS: 2  // Number of debate rounds (1-3 recommended)
};
```

### Customization Options

- **Debate Rounds**: Increase for more thorough analysis (costs more API tokens)
- **Temperature**: Higher = more creative, Lower = more focused
- **Model**: Use `gpt-4` for better quality (higher cost)

## 🏗️ Architecture

### Module Responsibilities

1. **config.js**: Central configuration
2. **api.js**: OpenAI API communication, streaming support
3. **promptRefiner.js**: Enhance user prompts
4. **debateEngine.js**: Orchestrate multi-agent debate
5. **codeGenerator.js**: Generate structured code files
6. **fileManager.js**: Handle previews and ZIP downloads
7. **ui.js**: Manage UI states and animations
8. **app.js**: Main orchestrator, ties everything together

### Key Design Principles

- **Modularity**: Each module has a single responsibility
- **Separation of Concerns**: HTML, CSS, JS kept separate
- **Scalability**: Easy to add new features or agents
- **Maintainability**: Clean, documented code
- **User Experience**: Smooth animations, clear feedback

## 🔧 Troubleshooting

### Common Issues

1. **API Errors**:
   - Check your API key in `config.js`
   - Verify you have OpenAI API credits
   - Check browser console for error details

2. **Preview Not Working**:
   - Check browser console for errors
   - Try refreshing the page
   - Ensure all files are in correct locations

3. **Download Issues**:
   - Make sure JSZip library loaded (check console)
   - Check browser download settings
   - Disable popup blockers

4. **Slow Generation**:
   - Normal for complex projects
   - Reduce `DEBATE_ROUNDS` for faster results
   - Use `gpt-4o-mini` instead of `gpt-4`

## 📊 Performance

- **Prompt Refinement**: ~5-10 seconds
- **Debate (2 rounds)**: ~20-30 seconds
- **Code Generation**: ~30-60 seconds (depends on complexity)
- **Total**: ~1-2 minutes for complete project

## 🎨 Generated Code Quality

The system generates:
- ✅ Semantic HTML5
- ✅ Modern CSS (Flexbox, Grid, Variables)
- ✅ ES6+ JavaScript
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Clean, documented code
- ✅ Modular architecture
- ✅ Best practices

## 🔐 Security Notes

- API key is stored in client-side JavaScript
- For production use, implement server-side API calls
- Never commit API keys to public repositories
- Consider rate limiting for public deployments

## 📝 License

This project is provided as-is for educational and development purposes.

## 🤝 Contributing

Ideas for improvements:
- Support for more frameworks (React, Vue, etc.)
- Template library
- Version control integration
- Collaborative editing
- More specialized agents
- Backend code generation

## 🙏 Credits

Built with:
- OpenAI GPT-4 API
- JSZip for file compression
- Modern web standards (HTML5, CSS3, ES6+)

## 📧 Support

For issues or questions:
1. Check browser console for errors
2. Verify API configuration
3. Review this README
4. Check OpenAI API status

---

**Made with ❤️ using AI**

Version: 1.0.0
Last Updated: April 2026
