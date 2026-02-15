# 💬 Twitch Chat Commands Guide

## Available Commands for Your Viewers

When your platform is integrated with Twitch, your viewers can use these commands in chat:

### 🎮 Game Commands

#### `!join`
**Description:** Join the current game  
**Usage:** `!join`  
**Response:** ✅ username joined the game!  
**When to use:** When you start a new game on the platform

**Example:**
```
streamer: Starting Questions game! Type !join to play
viewer: !join
bot: ✅ viewer joined the game! 🎮
```

---

#### `!answer [answer text]`
**Description:** Submit an answer to the current question  
**Usage:** `!answer your answer here`  
**Response:** 📝 Your answer has been recorded  
**When to use:** During the Questions game

**Example:**
```
streamer: What is the capital of Egypt?
viewer: !answer Cairo
bot: 📝 Your answer has been recorded: "Cairo"
```

---

#### `!score`
**Description:** Check your current score  
**Usage:** `!score`  
**Response:** ⭐ username: 50 points  
**When to use:** Anytime during the game

**Example:**
```
viewer: !score
bot: ⭐ viewer: 120 points
```

---

#### `!players`
**Description:** See current players and leaderboard  
**Usage:** `!players`  
**Response:** List of players sorted by score  
**When to use:** Check who's winning

**Example:**
```
viewer: !players
bot: 
👥 Current Players:
🥇 player1 (500 points)
🥈 player2 (350 points)
🥉 player3 (200 points)
→ player4 (100 points)
```

---

#### `!help`
**Description:** Show available commands  
**Usage:** `!help`  
**Response:** List of all commands with descriptions  
**When to use:** New viewers want to know what they can do

**Example:**
```
viewer: !help
bot: Shows list of all available commands
```

---

#### `!commands`
**Description:** Alias for !help  
**Usage:** `!commands`  
**Response:** Same as !help  

---

## 🎯 How Commands Work

### From Your Perspective (Streamer)
1. Viewer types command in your Twitch chat
2. Platform receives and processes the command
3. Bot responds in chat with result
4. Player's action is recorded in the game

### Technical Flow:
```
Viewer Types "!join" in chat
          ↓
Twitch Chat API receives message
          ↓
Your Platform processes command
          ↓
Player is added to current game
          ↓
Bot responds: "✅ player joined!"
          ↓
Player appears in game leaderboard
```

---

## 📊 Example Game Session

### Setup
```
Streamer: Welcome to iRozQ8! Starting a Questions game with 20 questions!
Streamer: Type !join to play, !help for commands
```

### During Game
```
Viewer1: !join
Bot: ✅ Viewer1 joined the game! 🎮

Viewer2: !join
Bot: ✅ Viewer2 joined the game! 🎮

Streamer: First question: What is 2+2?

Viewer1: !answer 4
Bot: 📝 Your answer has been recorded: "4"

Viewer2: !answer 5
Bot: 📝 Your answer has been recorded: "5"

Streamer: Correct answer is 4! Viewer1 gets 10 points!

Viewer1: !score
Bot: ⭐ Viewer1: 10 points

Viewer2: !score
Bot: ⭐ Viewer2: 0 points

Viewer1: !players
Bot: 
👥 Current Players:
🥇 Viewer1 (10 points)
🥈 Viewer2 (0 points)
```

---

## 🔧 Customizing Commands

You can add custom commands by editing:
**File:** `src/lib/twitch-commands.ts`

### Add New Command
```typescript
registerCommand({
  command: 'mycommand',
  description: 'What my command does',
  usage: '!mycommand [optional args]',
  execute: async (args: string[], username: string) => {
    // Your command logic here
    return 'Response to send to chat';
  }
});
```

### Example: Add a "!stop" command
```typescript
registerCommand({
  command: 'stop',
  description: 'Vote to stop the game',
  usage: '!stop',
  execute: async (args: string[], username: string) => {
    // Trigger game stop
    return `🛑 ${username} voted to stop the game!`;
  }
});
```

---

## 💡 Best Practices

### For Streamer
✅ **DO:**
- Explain commands at the start of stream
- Remind viewers about `!help` command
- Acknowledge command responses
- Use commands to make chat more interactive

❌ **DON'T:**
- Spam commands in chat
- Have conflicting command names
- Forget to explain the game rules
- Ignore viewers who use commands

### For Viewers
✅ **DO:**
- Use `!help` to see available commands
- Type exact command format
- Wait for bot response before retyping
- Help other viewers with commands

❌ **DON'T:**
- Use commands in wrong context
- Spam commands repeatedly
- Create custom commands without permission
- Use commands to spam chat

---

## 🎬 Making It Interactive

### Engagement Strategies
1. **Start with `!join`** - Let viewers opt-in
2. **Announce scores** - "Type `!score` to see your points!"
3. **Show leaderboard** - "Type `!players` to see who's winning!"
4. **Celebrate victories** - "Viewer1 wins with 500 points!"
5. **Next game hype** - "New game coming up! Type `!join` when ready!"

### Example Streamer Script
```
"Alright chat, new game starting! 

If you want to play, type !join right now!
When I ask a question, type !answer followed by your response.
Want to check your score? Type !score
Want to see the leaderboard? Type !players
Need help? Type !help

Let's go! First question in 3... 2... 1..."
```

---

## 📚 More Resources

- **Command Reference:** See `src/lib/twitch-commands.ts`
- **Chat Integration:** See `src/lib/twitch-chat.ts`
- **API Routes:** See `src/app/api/twitch/`
- **Dashboard:** See `src/app/twitch/dashboard/page.tsx`

---

## 🆘 Troubleshooting Commands

### Commands Not Working?
1. Check spelling exactly matches
2. Use correct format: `!command [args]`
3. Make sure platform is online
4. Verify Twitch chat is connected
5. Check environment variables are set

### Command Not Responding?
- Wait 2-3 seconds for bot response
- Check if game is running
- Verify you're in the right context (e.g., !answer only works during game)
- Check for any error messages

---

## 🚀 Advanced: Custom Commands

Want to add features like:
- `!emote` - Show custom emote
- `!subscribe` - Subscribe reminders
- `!tip` - Donation alerts
- `!vote` - Voting system

Edit `src/lib/twitch-commands.ts` and add them!

**Have fun streaming! 🎮✨**
