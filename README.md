# Personal Finance Planner for India

A comprehensive financial planning tool specifically designed for Indian families.

## Features

✅ Budget Allocation (50/30/20 Rule)
✅ Emergency Fund Calculator
✅ Insurance Planning (Term + Health)
✅ Investment Allocation (Age-based)
✅ Retirement Planning
✅ Financial Health Score
✅ Interactive Charts & Visualizations
✅ Mobile Responsive Design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: LocalStorage (no database required)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

### Method 1: Using Vercel CLI

```bash
npm i -g vercel
vercel
```

### Method 2: Using GitHub

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy"

That's it! Your app will be live in ~2 minutes.

### Method 3: Drag & Drop

1. Run `npm run build`
2. Go to [vercel.com](https://vercel.com)
3. Drag and drop the `.next` folder
4. Done!

## Project Structure

```
finance-planner-india/
├── app/
│   ├── components/      # React components
│   ├── lib/            # Calculation logic
│   ├── types/          # TypeScript types
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── public/             # Static assets
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind configuration
└── next.config.js      # Next.js configuration
```

## How It Works

1. **User Inputs**: Enter personal financial information
2. **Calculations**: All Excel formulas converted to TypeScript
3. **Results**: View detailed breakdown across 6 modules
4. **Storage**: Data saved locally in browser (no server needed)
5. **Export**: Download results as needed

## Key Calculations

- **Budget**: 50% Needs, 30% Wants, 20% Savings
- **Emergency Fund**: 6-12 months of essential expenses
- **Term Insurance**: 15-20x annual income
- **Health Insurance**: Based on city tier and family size
- **Investment Split**: (100 - Age) = Equity %
- **Retirement Corpus**: Inflation-adjusted with annuity calculation

## Environment Variables

None required! The app works entirely client-side.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

## Roadmap

- [ ] Product recommendations (Insurance & Mutual Funds)
- [ ] Goal-based planning (House, Education)
- [ ] Multi-user accounts
- [ ] PDF report export
- [ ] WhatsApp sharing
- [ ] Integration with AMCs for real-time NAV

---

Built with ❤️ for Indian families
