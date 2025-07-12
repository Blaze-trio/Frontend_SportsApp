# Sporting Club Management App

A modern, responsive sporting club management application built with React, TypeScript, Vite, and Tailwind CSS. Features include member management, sports management, and subscription tracking with local IndexedDB storage.

## 🚀 Live Demo

**[View Live App](https://Blaze-trio.github.io/Frontend_SportsApp/)**

## ✨ Features

- **Sports Management**: Add, view, and delete sports with descriptions
- **Member Management**: Add, view, and delete club members with status tracking
- **Subscription Management**: Subscribe members to sports, prevent duplicates, and view by member
- **Responsive Design**: Modern UI that works on desktop, tablet, and mobile
- **Local Storage**: Uses IndexedDB for offline data persistence
- **TypeScript**: Full type safety and enhanced developer experience
- **Form Validation**: Comprehensive form validation with error handling

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui + Radix UI
- **Routing**: React Router DOM
- **Database**: IndexedDB (via idb library)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 📱 Screenshots

The app features a clean, modern interface with:
- Dashboard navigation with active page highlighting
- Responsive card layouts for sports and members
- Interactive forms with validation
- Status badges and action buttons
- Mobile-optimized design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Blaze-trio/Frontend_SportsApp.git
cd Frontend_SportsApp/sporting-club-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

### Deploying to GitHub Pages

1. Update your GitHub username in `package.json` and this README ✅ (Done!)
2. Push your code to GitHub
3. Run the deployment command:
```bash
npm run deploy
```

Or use the automated GitHub Actions workflow by pushing to the main branch.

## 🏗️ Project Structure

```
sporting-club-app/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Main app layout with navigation
│   │   └── ui/                 # shadcn/ui components
│   ├── pages/
│   │   ├── SportsPage.tsx      # Sports management
│   │   ├── MembersPage.tsx     # Member management
│   │   └── SubscriptionsPage.tsx # Subscription management
│   ├── hooks/
│   │   └── useSportingClub.ts  # Custom hooks for data management
│   ├── lib/
│   │   ├── db.ts              # IndexedDB setup and utilities
│   │   └── utils.ts           # Utility functions
│   └── App.tsx                # Main app component
├── public/                    # Static assets
└── dist/                     # Built files (generated)
```

## 🎯 Usage

### Sports Management
- Navigate to "Sports" to view all available sports
- Click "Add Sport" to create a new sport with name and description
- Use the delete button to remove sports (with confirmation)

### Member Management  
- Navigate to "Members" to view all club members
- Click "Add Member" to register a new member
- View member status (Active/Inactive) and manage member information

### Subscription Management
- Navigate to "Subscriptions" to manage member-sport relationships
- Select a member and sport to create a new subscription
- View existing subscriptions grouped by member
- Cancel subscriptions as needed (prevents duplicates)

## 🔧 Configuration

### GitHub Pages Setup

1. In `package.json`, update the homepage URL:
```json
"homepage": "https://Blaze-trio.github.io/Frontend_SportsApp"
```

2. The app is configured with the correct base path for GitHub Pages in `vite.config.ts`

### Environment Variables

No environment variables are required - the app uses local IndexedDB storage.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Vite](https://vitejs.dev/) for the fast build tool
- [React](https://reactjs.org/) for the component framework
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
