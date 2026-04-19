# API Integration Guide

## OpenAI API Configuration

This project uses the OpenAI API to power the AI-driven code generation. Here's everything you need to know about the API integration.

## Configuration

### Current Setup

Location: `js/config.js`

```javascript
const CONFIG = {
    OPENAI_API_KEY: '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',
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.7,
    DEBATE_ROUNDS: 2
};
```

### Changing the API Key

If you need to use a different API key:

1. Open `js/config.js`
2. Replace the value of `OPENAI_API_KEY`
3. Save the file
4. Refresh the browser

**⚠️ Security Warning**: Never commit API keys to public repositories!

## API Usage Breakdown

### Total API Calls Per Generation

| Stage | Calls | Avg Time | Purpose |
|-------|-------|----------|---------|
| Prompt Refinement | 1 | 5-10s | Enhance user input |
| Debate Round 1 | 2 | 10-15s | Optimist + Pessimist |
| Debate Round 2 | 2 | 10-15s | Optimist + Pessimist |
| Conclusion | 1 | 5-10s | Final decision |
| Structure Planning | 1 | 5-10s | File organization |
| HTML Generation | 1-2 | 10-20s | HTML files |
| CSS Generation | 2-3 | 10-20s | CSS files |
| JS Generation | 3-5 | 15-30s | JavaScript modules |

**Total**: 13-17 API calls, ~90-150 seconds

### Token Usage Estimates

| Operation | Input Tokens | Output Tokens | Total |
|-----------|--------------|---------------|-------|
| Prompt Refinement | ~300 | ~500 | ~800 |
| Each Debate Turn | ~500 | ~800 | ~1,300 |
| Conclusion | ~2,000 | ~1,000 | ~3,000 |
| Structure Plan | ~1,000 | ~500 | ~1,500 |
| Each File Gen | ~1,500 | ~2,000 | ~3,500 |

**Total Estimate**: 30,000-50,000 tokens per complete generation

### Cost Estimation

Using GPT-4o-mini pricing:
- Input: $0.150 per 1M tokens
- Output: $0.600 per 1M tokens

**Per Generation**:
- Input: ~20,000 tokens × $0.150 = $0.003
- Output: ~30,000 tokens × $0.600 = $0.018
- **Total**: ~$0.02 per generation

**Note**: Prices may vary. Check [OpenAI Pricing](https://openai.com/api/pricing/)

## API Implementation Details

### API Client (api.js)

```javascript
class APIClient {
    async makeRequest(messages, temperature, maxTokens) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
                temperature: temperature,
                max_tokens: maxTokens
            })
        });
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
}
```

### Request Format

Each API request follows this structure:

```javascript
{
    "model": "gpt-4o-mini",
    "messages": [
        {
            "role": "system",
            "content": "You are an expert web developer..."
        },
        {
            "role": "user",
            "content": "Create a landing page for..."
        }
    ],
    "temperature": 0.7,
    "max_tokens": 4000
}
```

### Response Format

```javascript
{
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "Generated content here..."
            }
        }
    ],
    "usage": {
        "prompt_tokens": 150,
        "completion_tokens": 500,
        "total_tokens": 650
    }
}
```

## System Prompts

### 1. Prompt Refinement

```javascript
const systemPrompt = `You are an expert UI/UX designer and web developer. 
Your task is to take a user's rough idea for a website or web application 
and refine it into a detailed, professional specification.

Analyze the user's input and provide:
1. A clear, enhanced description of what they want to build
2. Key features and functionality that should be included
3. Suggested design elements and style
4. Technical requirements
5. User experience considerations

Format your response as a structured specification that will be used 
to build the actual website.`;
```

### 2. Optimist Agent

```javascript
const optimistPrompt = `You are an optimistic AI agent in a debate about 
web development approaches. Your role is to:
- Emphasize possibilities and innovative features
- Suggest modern, cutting-edge solutions
- Focus on user delight and exceptional experiences
- Propose ambitious but achievable goals
- Be enthusiastic about new technologies and approaches

However, remain professional and practical. Don't suggest unrealistic 
features.`;
```

### 3. Pessimist Agent

```javascript
const pessimistPrompt = `You are a cautious, analytical AI agent in a 
debate about web development approaches. Your role is to:
- Identify potential problems and edge cases
- Emphasize practical constraints (time, complexity, compatibility)
- Suggest simpler, more maintainable solutions
- Focus on reliability and performance
- Question overly complex features
- Advocate for proven, stable technologies

Be constructive in your criticism - the goal is to arrive at the best 
solution, not to be negative.`;
```

### 4. Code Generation

```javascript
const codeGenPrompt = `You are an expert ${fileType} developer. 
Generate clean, modern ${fileType}.

Requirements:
- Follow best practices
- Write semantic, accessible code
- Use modern features
- Include proper documentation
- Ensure production-ready quality

Respond with ONLY the code, no explanations or markdown code blocks.`;
```

## Rate Limiting

### OpenAI Limits

Default limits for most users:
- **RPM** (Requests Per Minute): 60
- **TPM** (Tokens Per Minute): 200,000
- **RPD** (Requests Per Day): 10,000

### Handling Rate Limits

The API client includes basic error handling:

```javascript
try {
    const response = await apiClient.makeRequest(messages);
} catch (error) {
    if (error.message.includes('rate limit')) {
        // Wait and retry
        await delay(60000); // Wait 1 minute
        return await apiClient.makeRequest(messages);
    }
    throw error;
}
```

### Optimization Strategies

1. **Reduce Debate Rounds**
   ```javascript
   DEBATE_ROUNDS: 1  // Instead of 2
   ```

2. **Use Smaller Max Tokens**
   ```javascript
   MAX_TOKENS: 2000  // Instead of 4000
   ```

3. **Batch Requests** (Future Enhancement)
   - Queue multiple file generations
   - Process in parallel where possible

## Error Handling

### Common Errors

#### 1. Invalid API Key
```json
{
    "error": {
        "message": "Incorrect API key provided",
        "type": "invalid_request_error"
    }
}
```

**Solution**: Check `config.js` for correct API key

#### 2. Rate Limit Exceeded
```json
{
    "error": {
        "message": "Rate limit reached",
        "type": "rate_limit_error"
    }
}
```

**Solution**: Wait and retry, or upgrade plan

#### 3. Context Length Exceeded
```json
{
    "error": {
        "message": "Maximum context length exceeded",
        "type": "invalid_request_error"
    }
}
```

**Solution**: Reduce input length or max_tokens

#### 4. Network Error
```
Failed to fetch
```

**Solution**: Check internet connection

### Error Recovery

```javascript
async function robustAPICall(messages, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await apiClient.makeRequest(messages);
        } catch (error) {
            if (i === retries - 1) throw error;
            
            // Exponential backoff
            await delay(Math.pow(2, i) * 1000);
        }
    }
}
```

## Model Selection

### Available Models

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| gpt-4o-mini | ⚡⚡⚡ | ⭐⭐⭐ | $ | Production |
| gpt-4o | ⚡⚡ | ⭐⭐⭐⭐ | $$ | High quality |
| gpt-4-turbo | ⚡⚡ | ⭐⭐⭐⭐⭐ | $$$ | Best quality |
| gpt-4 | ⚡ | ⭐⭐⭐⭐⭐ | $$$$ | Maximum quality |

### Changing Models

Edit `js/config.js`:

```javascript
// For faster, cheaper results
MODEL: 'gpt-4o-mini'

// For better quality
MODEL: 'gpt-4o'

// For best quality (slower, expensive)
MODEL: 'gpt-4-turbo'
```

## Temperature Settings

### Understanding Temperature

- **0.0-0.3**: Focused, deterministic
- **0.4-0.7**: Balanced (recommended)
- **0.8-1.0**: Creative, varied

### Use Cases

```javascript
// Prompt refinement (more focused)
temperature: 0.5

// Debate (balanced)
temperature: 0.7

// Code generation (focused)
temperature: 0.6

// Creative content (more varied)
temperature: 0.9
```

## Streaming Support

The API client includes streaming support (currently unused):

```javascript
async streamRequest(messages, onChunk) {
    const response = await fetch(this.apiUrl, {
        // ... config
        stream: true
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        // Process chunk
        if (onChunk) onChunk(chunk);
    }
}
```

### Future Use

Could be used for:
- Real-time code display as it's generated
- Progress indicators
- User feedback during generation

## Testing API Connection

On startup, the app tests the connection:

```javascript
async testAPIConnection() {
    try {
        await apiClient.makeRequest([
            { role: 'user', content: 'Hello' }
        ], 0.5, 10);
        console.log('✓ API connection successful');
    } catch (error) {
        console.error('API connection failed:', error);
    }
}
```

## Best Practices

### 1. API Key Security

❌ **Don't**:
```javascript
// Hardcoded in public code
const API_KEY = 'sk-...';
```

✅ **Do** (for production):
```javascript
// Server-side proxy
const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt })
});
```

### 2. Error Messages

❌ **Don't**:
```javascript
alert('API error: ' + error.message);
```

✅ **Do**:
```javascript
uiController.showNotification(
    'Generation failed. Please try again.',
    'error'
);
console.error('API Error:', error);
```

### 3. Token Management

❌ **Don't**:
```javascript
// Unlimited tokens
max_tokens: 10000
```

✅ **Do**:
```javascript
// Reasonable limits
max_tokens: 4000  // For most files
max_tokens: 2000  // For simple responses
```

### 4. Request Optimization

❌ **Don't**:
```javascript
// Send entire history every time
messages: [...allPreviousMessages, newMessage]
```

✅ **Do**:
```javascript
// Only send relevant context
messages: [systemPrompt, refinedPrompt, conclusion]
```

## Production Deployment

### Recommended Architecture

```
Browser (UI)
    ↓
Backend Server (Node.js/Python)
    ↓ (API Key stored here)
OpenAI API
```

### Example Backend (Node.js)

```javascript
// server.js
const express = require('express');
const OpenAI = require('openai');

const app = express();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/refine', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ]
        });
        
        res.json({ 
            result: completion.choices[0].message.content 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Frontend Changes

```javascript
// api.js
async makeRequest(messages) {
    const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: messages 
        })
    });
    
    const data = await response.json();
    return data.result;
}
```

## Monitoring & Analytics

### Track Usage

```javascript
let totalAPICalls = 0;
let totalTokensUsed = 0;

async function trackedRequest(messages) {
    totalAPICalls++;
    
    const response = await apiClient.makeRequest(messages);
    
    // Log usage
    console.log(`API Call #${totalAPICalls}`);
    
    return response;
}
```

### Cost Tracking

```javascript
function estimateCost(inputTokens, outputTokens) {
    const inputCost = (inputTokens / 1000000) * 0.150;
    const outputCost = (outputTokens / 1000000) * 0.600;
    return inputCost + outputCost;
}
```

## Troubleshooting

### Issue: "API key not valid"
- Check config.js
- Verify key on OpenAI dashboard
- Check for extra spaces/characters

### Issue: "Rate limit exceeded"
- Wait 60 seconds
- Check usage on OpenAI dashboard
- Consider upgrading plan

### Issue: "Context too long"
- Reduce input length
- Lower max_tokens
- Simplify prompts

### Issue: "Network error"
- Check internet connection
- Verify API endpoint URL
- Check browser console

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/api/pricing/)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Best Practices](https://platform.openai.com/docs/guides/best-practices)

---

**Note**: Always keep your API key secure and never share it publicly!
