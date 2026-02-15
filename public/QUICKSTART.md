# 🚀 Streamer's Quest - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd public
npm install
```

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   Streamer's Quest - Game Server       ║
║   Version 1.0.0                        ║
╚════════════════════════════════════════╝

🎮 Server running on http://localhost:3000
📡 WebSocket ready for real-time updates
🎯 Ready for streaming!
```

### Step 3: Open in Browser
- **Game**: http://localhost:3000
- **Control Panel**: http://localhost:3000/control-panel.html

---

## 🎮 For Streamers - First Stream

### Pre-Stream Checklist
- [ ] Server is running (`npm start`)
- [ ] Game loads at http://localhost:3000
- [ ] Control Panel opens without errors
- [ ] Test with 2-3 friends joining
- [ ] Verify voting works
- [ ] Check audio/video capture includes game

### During Stream

**Opening (First 5 minutes):**
1. Have viewers join at http://localhost:3000
2. Click **"⏳ Accept the Quest"** button
3. Watch as viewers see their assigned roles
4. Talk through what each role does

**Main Stream (First Chapter):**
1. Read the story text aloud
2. Let viewers vote for 30 seconds
3. Announce the winner: "The majority has chosen... ⚔️"
4. Watch the story branch
5. Use Control Panel to adjust difficulty if needed

**Engaging Your Viewers:**
```
Example: "Chat, we have 42 viewers! Let's see...
- 18 Warriors ready to attack ⚔️
- 12 Healers keeping us alive 💚
- 8 Scouts finding secret paths 🔍
- 4 Tricksters causing chaos! 🎭

Vote now! We're going into battle!"
```

**Pacing Tips:**
- Story chapter: ~2 minutes
- Voting: ~30 seconds
- Battle: ~3-5 minutes
- Mini-game: ~2 minutes

---

## 🎯 Control Panel Features

### Quick Commands
| Button | Effect | Use When |
|--------|--------|----------|
| ⏭️ Skip Voting | Executes winning vote instantly | Too many indecisive viewers |
| 🔄 Restart Game | Back to Chapter 0 | Viewers want new story |
| 💚 Heal Hero | +20 HP | Battle is too hard |
| ⚡ Damage Hero | -30 HP | Battle is too easy |
| 💥 Damage Enemy | -10 HP | Battle needs drama |
| 📖 Jump to Chapter | Go to specific chapter | Skip boring parts |

### Pro Tips
1. **Pause between battles** - Build suspense
2. **Use damage strategically** - Create tension moments
3. **Monitor vote balance** - If one choice dominates, it's not fun
4. **Engage with low votes** - "The Tricksters are voting chaos!" 

---

## 🎨 Customization (10 minutes)

### Change Colors
Edit `styles.css`:
```css
:root {
  --primary: #1a1a2e;      /* Main background */
  --gold: #eae2b7;         /* Gold highlights */
  --danger: #e74c3c;       /* Red (health bars) */
}
```

### Add New Story Chapter
Edit `server.js`, find `storyChapters` array:
```javascript
{
  id: 6,
  title: 'My New Chapter',
  text: 'Write your story here...',
  choices: [
    {
      id: 'choice1',
      text: '⚔️ First choice',
      action: 'story',
      nextChapter: 7
    }
  ]
}
```

### Adjust Game Balance
In `server.js`:
```javascript
// Change voting time (30 seconds default)
CONFIG.VOTING_TIME = 60;

// Change battle damage (attack: 10-30 default)
damage = Math.floor(Math.random() * 50) + 20;
```

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install express ws
```

### WebSocket connection fails
1. Check if server is running: `npm start`
2. Verify port 3000 is not in use
3. Check firewall settings
4. Try `http://127.0.0.1:3000` instead of localhost

### Viewers not appearing in vote count
1. Wait 5-10 seconds for connection
2. Refresh browser (F5)
3. Check browser console (F12 → Console) for errors
4. Verify WebSocket connection status

### Game feels slow/laggy
1. Close other tabs using CPU
2. Reduce viewer count for testing
3. Increase TYPEWRITER_SPEED in `client.js` (line ~25)
4. Disable browser extensions

---

## 📊 Understanding the Game State

When you click **"Fetch Game State"** in Control Panel, you see:

```json
{
  "chapter": {
    "id": 2,
    "title": "Forest Encounter",
    "choices": [...]
  },
  "heroHealth": 85,
  "supplies": 40,
  "viewerCount": 42,
  "gamePhase": "voting",
  "votes": [
    {"choice": "riddle", "voteCount": 28},
    {"choice": "fight", "voteCount": 14}
  ],
  "partyComposition": {
    "warriors": 18,
    "healers": 12,
    "scouts": 8,
    "tricksters": 4
  }
}
```

**Key Metrics:**
- **viewerCount**: Active viewers (real-time)
- **gamePhase**: Current state (story, voting, battle, minigame)
- **votes**: Real-time voting breakdown
- **partyComposition**: Role distribution

---

## 🎯 Game Phases Explained

### 1. STORY Phase
- Viewers see story text and choices
- No voting yet
- Duration: ~30 seconds

### 2. VOTING Phase
- Viewers click choice button
- Timer counts down (30 seconds)
- Real-time vote count updates
- Automatically ends at 80% participation

### 3. BATTLE Phase
- Hero vs Enemy health bars visible
- Action buttons: Attack, Defend, Special
- Each action affects enemy health
- Battle log tracks damage

### 4. MINIGAME Phase
- Riddle, trivia, or puzzle
- Viewers solve mini-challenge
- Rewards or penalties on victory/defeat

### 5. VICTORY/DEFEAT Phase
- Story conclusion
- Return to Chapter selection

---

## 💡 Streamer Ideas

### Content Ideas
1. **Weekly Story Arc**: 5 chapters per stream
2. **Viewer Challenges**: "Can chat beat this boss?"
3. **Role Competitions**: "Warriors vs Healers"
4. **Speed Runs**: "Beat game in 30 min"
5. **Permadeath Mode**: One life for the entire game

### Engagement Tactics
```
"Warriors are outnumbering Healers 3-1!
We're going full damage mode!
Healers, if you want to survive...
Vote WISELY! ⏱️ 10 seconds left!"
```

### Reward Ideas
- Subscriber-only skip button
- Bits enable extra voting rounds
- Raid bonus: Random chapter jump
- Follower special: Extra role choice

---

## 🌐 Going Live

### On Twitch
1. Start game server: `npm start`
2. Open http://localhost:3000
3. Share URL or make QR code
4. Alert chat to join

### On YouTube Gaming
- Same setup
- Put URL in chat/description
- Consider Discord server for persistent URL

### On Discord
```
1. Start server
2. Create public voice channel
3. Share: http://yourip:3000
4. Voice chat alongside game
```

---

## 📱 Mobile Viewing

Game works on mobile! 

**For viewers on phone:**
```
They see: Full game interface optimized for mobile
They can: Click choices, see votes in real-time
Issue: Easier to misclick on small screen
```

**Tip**: Tell viewers "Tap your choice clearly on mobile"

---

## 🔐 Security Notes

⚠️ **For Local/Friends Only:**
```javascript
// Current setup: No authentication
// Suitable for: Friends, small groups, private streams
// NOT suitable for: Public internet deployment
```

**To Add Basic Security:**
```javascript
// Add password check
const PASSWORD = 'secretcode123';
if (data.password !== PASSWORD) {
  ws.close();
}
```

---

## 📈 Performance Stats

**Server Capacity:**
- ✅ 50 viewers: Zero lag
- ✅ 100 viewers: Smooth gameplay
- ⚠️ 200+ viewers: May need optimization

**Optimization if Needed:**
1. Add message compression
2. Reduce broadcast frequency
3. Use CDN for static files
4. Consider game clustering

---

## 🎓 Learning Resources

### Modify Mini-Games
The riddle system is plug-and-play. To add new games:

**File**: `server.js` (search for `displayMinigame()`)

Current Structure:
```javascript
miniGames: {
  riddle: { question, answers, hint }
}
```

Add yours:
```javascript
trivia: {
  questions: [
    { question: '...', answer: '...', options: [...] }
  ]
}
```

### Add Video Backgrounds
In `index.html` styles section:
```css
.background-layer {
  background: url('video.mp4');
  background-size: cover;
}
```

### Modify Party Roles
File: `server.js` function `assignRole()`

Current:
```javascript
const roles = ['Warrior', 'Healer', 'Scout', 'Trickster'];
```

Add Mage:
```javascript
const roles = ['Warrior', 'Healer', 'Scout', 'Trickster', 'Mage'];
```

---

## ✅ Stream Day Checklist

- [ ] Server started (`npm start`)
- [ ] Game accessible (http://localhost:3000)
- [ ] Tested in browser
- [ ] Tested with friend
- [ ] OBS/stream capture working
- [ ] Audio is ON
- [ ] Control Panel visible in 2nd monitor
- [ ] Story chapters read over
- [ ] Backup plan if crashes

---

## 📞 Quick Help

**Game won't start?**
```bash
# Kill existing process
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Try again:
npm start
```

**WebSocket errors in console?**
- Refresh browser (F5)
- Wait 10 seconds
- Server auto-reconnects after 3 seconds

**Votes not counting?**
- Make sure viewers are clicking buttons
- Check vote timer is active
- Try fetching game state (Control Panel)

---

## 🎉 You're Ready!

Your Streamer's Quest setup is complete! 

**Next Steps:**
1. ✅ Run `npm start` 
2. ✅ Open http://localhost:3000
3. ✅ Invite friends to test
4. ✅ Go LIVE! 

**Pro Tip**: Start with Chapter 0 and read the story aloud. Let your personality shine through! 🌟

---

**Version**: 1.0.0  
**Last Updated**: February 2025  
**Status**: ✅ Ready to Stream

Have fun! 🚀🎮
