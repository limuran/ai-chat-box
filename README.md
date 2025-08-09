# AI Chat Box

A modern AI chat interface built with React + TypeScript, powered by Claude AI.

## 🚀 Features

- 🎨 Modern chat interface design
- 💬 Real-time messaging
- 🤖 Claude AI integration
- 📱 Responsive design
- 🎯 TypeScript type safety
- ⚡ Fast response experience
- 🔐 Secure API key management

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Type System**: TypeScript
- **Styling**: Tailwind CSS
- **AI Service**: Claude AI (Anthropic)
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Icons**: Lucide React

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/limuran/ai-chat-box.git
cd ai-chat-box
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

Create a `.env` file and add your Claude API key:

```env
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```

Get your API key from [Anthropic Console](https://console.anthropic.com/).

### 4. Start development server

```bash
npm run dev
```

## 📁 Project Structure

```
ai-chat-box/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatBox.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── InputBox.tsx
│   │   └── TypingIndicator.tsx
│   ├── services/
│   │   └── claude-api.ts
│   ├── types/
│   │   └── chat.ts
│   ├── hooks/
│   │   └── useChat.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🔧 Configuration

You can adjust AI parameters in `src/services/claude-api.ts`:

- `max_tokens`: Maximum response length
- `temperature`: Response creativity level
- `model`: Claude model version

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable `VITE_CLAUDE_API_KEY`
4. Deploy automatically

### Netlify
1. Build project: `npm run build`
2. Upload `dist` folder to Netlify
3. Set environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com/) - For providing Claude AI service
- [React](https://reactjs.org/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type system
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

⭐ If this project helps you, please give it a star!
