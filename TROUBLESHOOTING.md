# Troubleshooting & FAQ

## Common Issues & Solutions

### 🚨 Generation Issues

#### Issue: Nothing happens when I click "Start Generation"

**Possible Causes**:
1. Empty input field
2. JavaScript not loaded
3. API key issue
4. Browser compatibility

**Solutions**:
```
✅ Enter a description before clicking
✅ Open browser console (F12) and check for errors
✅ Verify all .js files are loaded (check Network tab)
✅ Try a different browser (Chrome, Firefox, Edge)
✅ Check config.js has valid API key
```

#### Issue: "API Error" or "Request Failed"

**Causes**:
- Invalid API key
- No internet connection
- Rate limit exceeded
- OpenAI service down

**Solutions**:
```
✅ Verify API key in js/config.js
✅ Check internet connection
✅ Wait 60 seconds and retry
✅ Check OpenAI status: https://status.openai.com/
✅ Review browser console for detailed error
```

#### Issue: Generation stops at refinement/debate/generation step

**Causes**:
- API timeout
- Context too long
- Network interruption

**Solutions**:
```
✅ Refresh page and try again
✅ Use shorter, simpler description
✅ Check console for specific error
✅ Reduce DEBATE_ROUNDS in config.js
✅ Lower MAX_TOKENS in config.js
```

---

### 🎨 Preview Issues

#### Issue: Preview shows blank page

**Causes**:
- Generation incomplete
- JavaScript errors in generated code
- Iframe security restrictions

**Solutions**:
```
✅ Wait for generation to fully complete
✅ Open browser console and check for errors
✅ Check if files were actually generated (console logs)
✅ Try downloading and opening index.html directly
```

#### Issue: Preview looks broken or unstyled

**Causes**:
- CSS not generated properly
- File paths incorrect
- Partial generation

**Solutions**:
```
✅ Download the ZIP and check if CSS files exist
✅ Open downloaded index.html to verify
✅ Try generating again
✅ Check console for CSS loading errors
```

#### Issue: Preview doesn't show latest changes

**Causes**:
- Browser cache
- Multiple generations

**Solutions**:
```
✅ Click "Start Over" and regenerate
✅ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
✅ Clear browser cache
```

---

### 📦 Download Issues

#### Issue: ZIP download doesn't start

**Causes**:
- Popup blocker
- Browser security settings
- JSZip library not loaded

**Solutions**:
```
✅ Allow popups for this site
✅ Check browser downloads settings
✅ Open console and check for JSZip errors
✅ Verify JSZip CDN is accessible
```

#### Issue: ZIP file is corrupted or won't open

**Causes**:
- Generation incomplete
- JSZip error
- Partial download

**Solutions**:
```
✅ Wait for full generation before downloading
✅ Try different ZIP extraction tool
✅ Download again
✅ Check console for errors during ZIP creation
```

#### Issue: Files missing from ZIP

**Causes**:
- Generation errors
- File creation failed

**Solutions**:
```
✅ Check console logs during generation
✅ Verify all steps completed (green checkmarks)
✅ Try generating simpler project first
✅ Check file structure display before download
```

---

### ⚙️ Configuration Issues

#### Issue: Can't find config.js or API key field

**Location**:
```
js/config.js

Look for:
OPENAI_API_KEY: 'sk-proj-...'
```

#### Issue: Changed API key but still getting errors

**Solutions**:
```
✅ Save config.js after editing
✅ Hard refresh browser (Ctrl+Shift+R)
✅ Clear cache
✅ Check for typos in API key
✅ Ensure no extra spaces or quotes
```

#### Issue: Want to use different AI model

**How to Change**:
```javascript
// In js/config.js
MODEL: 'gpt-4o'      // Better quality
MODEL: 'gpt-4-turbo' // Best quality
```

---

### 🐛 Browser Compatibility

#### Recommended Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Recommended |
| Firefox | 88+ | ✅ Recommended |
| Safari | 14+ | ✅ Supported |
| Edge | 90+ | ✅ Recommended |
| Opera | 76+ | ✅ Supported |

#### Not Supported
- Internet Explorer (all versions)
- Very old browser versions
- Some mobile browsers (limited)

#### Issue: Features not working in Safari

**Solutions**:
```
✅ Update to latest Safari version
✅ Enable JavaScript
✅ Check privacy settings
✅ Try Chrome or Firefox instead
```

---

## Frequently Asked Questions

### General Questions

**Q: Is this free to use?**
A: The application is free, but you need an OpenAI API key. API usage costs money (very small amounts, ~$0.02 per generation).

**Q: Do I need to install anything?**
A: No installation needed! Just open index.html in a browser.

**Q: Can I use this offline?**
A: No, it requires internet to call the OpenAI API.

**Q: Where is my data stored?**
A: Nothing is stored. All processing happens in your browser and via OpenAI API. No databases, no servers.

**Q: Can I customize the generated code?**
A: Absolutely! Download the ZIP and edit any file you want.

---

### Technical Questions

**Q: What AI model does this use?**
A: By default, GPT-4o-mini. You can change it in config.js.

**Q: How long does generation take?**
A: Typically 1-2 minutes for a complete project.

**Q: How many files does it generate?**
A: Usually 5-12 files depending on project complexity:
- 1-2 HTML files
- 2-3 CSS files
- 3-7 JavaScript files

**Q: What languages/frameworks are supported?**
A: Currently generates vanilla HTML, CSS, and JavaScript. No frameworks yet (React, Vue, etc.).

**Q: Can it generate backend code?**
A: Not yet. Currently frontend only.

**Q: What's the file size limit?**
A: No hard limit, but complex projects may hit API token limits (~4000 tokens per file).

---

### Debate System Questions

**Q: What's the point of the debate?**
A: Two AI agents (Optimist & Pessimist) debate to find the optimal balance between innovation and practicality.

**Q: Can I skip the debate?**
A: Not directly, but you can set DEBATE_ROUNDS to 0 in config.js (not recommended).

**Q: How many debate rounds should I use?**
A: 2 rounds is optimal. More = better quality but slower and more expensive.

**Q: Can I add more agents?**
A: Yes! Modify debateEngine.js to add new agents with different perspectives.

---

### Cost Questions

**Q: How much does each generation cost?**
A: Approximately $0.02 USD using GPT-4o-mini.

**Q: How can I reduce costs?**
A:
- Use GPT-4o-mini (already configured)
- Reduce DEBATE_ROUNDS to 1
- Lower MAX_TOKENS
- Be more specific in prompts (requires fewer revisions)

**Q: What if I run out of API credits?**
A: Add more credits to your OpenAI account at platform.openai.com.

**Q: Is there a free tier?**
A: OpenAI offers $5 in free credits for new accounts. After that, you need to add payment.

---

### Output Quality Questions

**Q: Generated code doesn't match my expectations**
A:
- Be more specific in your description
- Include design preferences
- Mention specific features you want
- Try generating again with refined input

**Q: Code quality seems low**
A:
- Try using GPT-4 instead of GPT-4o-mini
- Increase debate rounds
- Provide more detailed specifications

**Q: Can I request specific styling?**
A: Yes! Mention colors, fonts, layouts in your description:
- "modern dark theme with purple accents"
- "minimalist design with lots of white space"
- "colorful and playful like a children's site"

**Q: Files are too simple/complex**
A: Adjust your description:
- Simpler: "basic landing page"
- More complex: "feature-rich dashboard with..."

---

### Customization Questions

**Q: Can I modify the system prompts?**
A: Yes! Edit the system prompts in:
- promptRefiner.js
- debateEngine.js
- codeGenerator.js

**Q: How do I change debate personalities?**
A: Edit the agent prompts in debateEngine.js:
```javascript
const optimistSystemPrompt = `Your custom prompt...`;
const pessimistSystemPrompt = `Your custom prompt...`;
```

**Q: Can I add preprocessing to user input?**
A: Yes! Modify the start() function in app.js before calling refinePrompt().

**Q: How do I change the UI appearance?**
A: Edit styles/main.css and styles/components.css.

---

### Deployment Questions

**Q: Can I deploy this to a website?**
A: Yes, but IMPORTANT: Move API calls to a backend server. Never expose API keys in frontend code on public sites!

**Q: How do I deploy safely?**
A:
1. Create backend (Node.js, Python, etc.)
2. Move API key to backend environment variables
3. Frontend calls your backend
4. Backend calls OpenAI API

**Q: Can multiple people use the same instance?**
A: Yes, but they'll all use the same API key (and your credits). Implement user authentication and separate API keys for production.

**Q: Can I integrate with Vercel/Netlify?**
A: Yes! Use serverless functions to proxy API calls securely.

---

### Advanced Questions

**Q: Can I add new file types (TypeScript, SCSS, etc.)?**
A: Yes! Modify codeGenerator.js:
1. Add new file types to structure planning
2. Create generation methods for new types
3. Update file manager to handle new extensions

**Q: Can I integrate with GitHub?**
A: Not built-in, but you can add GitHub API integration to push generated code to repositories.

**Q: Can I add template selection?**
A: Yes! Create a template library and inject template specs into the prompt refinement stage.

**Q: Can I make this work with other AI APIs?**
A: Yes! Modify api.js to support other APIs (Anthropic, Cohere, etc.). You'll need to adjust request/response formats.

---

## Debugging Tips

### Enable Verbose Logging

Add to app.js:
```javascript
const DEBUG = true;

if (DEBUG) {
    console.log('Step:', stepName);
    console.log('Data:', data);
}
```

### Check Network Activity

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Watch API calls in real-time

### Monitor API Responses

```javascript
// In api.js
async makeRequest(messages) {
    const response = await fetch(...);
    const data = await response.json();
    
    console.log('API Response:', data); // Add this
    
    return data.choices[0].message.content;
}
```

### Test Individual Components

```javascript
// In browser console
await promptRefiner.refine('test input');
await debateEngine.runDebate('test spec');
```

---

## Performance Tips

### Faster Generation

```javascript
// config.js
DEBATE_ROUNDS: 1        // Instead of 2
MAX_TOKENS: 2000        // Instead of 4000
MODEL: 'gpt-4o-mini'    // Fastest model
```

### Better Quality (Slower)

```javascript
// config.js
DEBATE_ROUNDS: 3
MAX_TOKENS: 4000
MODEL: 'gpt-4-turbo'
TEMPERATURE: 0.8
```

### Balanced (Recommended)

```javascript
// config.js
DEBATE_ROUNDS: 2
MAX_TOKENS: 3000
MODEL: 'gpt-4o-mini'
TEMPERATURE: 0.7
```

---

## Getting Help

### Check These First
1. Browser console (F12) - look for red errors
2. Network tab - check API calls
3. This README - search for your issue
4. ARCHITECTURE.md - understand how it works

### Still Stuck?

1. **Document the issue**:
   - What you tried to do
   - What actually happened
   - Error messages (if any)
   - Browser and version

2. **Check the logs**:
   - Browser console
   - Network activity
   - Step where it failed

3. **Try basic troubleshooting**:
   - Refresh browser
   - Clear cache
   - Try different browser
   - Check API key
   - Verify internet connection

### Developer Console

Essential commands:
```javascript
// Check configuration
console.log(CONFIG);

// Test API
await apiClient.testConnection();

// Check generated files
console.log(fileManager.files);

// View current state
console.log(app.refinedPrompt);
console.log(app.debateResult);
console.log(app.generatedProject);
```

---

## Error Messages Explained

### "Please enter a description"
- You clicked Start without typing anything
- Solution: Enter a description first

### "Failed to get response from AI"
- API call failed
- Check API key, internet, rate limits

### "Prompt refinement failed"
- Error during refinement step
- Check console for details
- Try simpler input

### "Debate failed"
- Error during debate
- Usually API-related
- Check rate limits

### "Code generation failed"
- Error creating files
- Check console logs
- May need simpler project

### "Failed to create ZIP file"
- JSZip error
- Check if all files exist
- Try again

---

## Best Practices

✅ **Do**:
- Be specific in descriptions
- Wait for each step to complete
- Check console if issues occur
- Download and verify output
- Keep API key secure

❌ **Don't**:
- Refresh during generation
- Click buttons multiple times
- Share API key publicly
- Expect perfect code (review and edit)
- Skip error messages

---

**Still have questions? Check the other documentation files:**
- README.md - Full documentation
- ARCHITECTURE.md - System design
- API_GUIDE.md - API details
- QUICK_START.md - Getting started
