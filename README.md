# Green Hydrogen Infrastructure India 🌿⚡

An interactive mapping and optimization platform for green hydrogen infrastructure development in India. This tool visualizes existing and planned hydrogen production facilities, storage systems, renewable energy sources, and demand centers to guide strategic investment decisions.

## 🚀 Features

- **Interactive Map**: OpenStreetMap-based visualization of India's hydrogen infrastructure
- **Multi-Layer Infrastructure**: Plants, storage, pipelines, renewable energy, demand centers, and transport hubs
- **AI-Powered Recommendations**: Site optimization based on renewable access, demand proximity, and logistics
- **Investment Analysis**: Cost projections and capacity planning in INR
- **Real-time Data**: Live infrastructure tracking and project status updates
- **Export Capabilities**: Data export for further analysis and reporting

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Mapping**: Leaflet.js + React-Leaflet + OpenStreetMap
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 🎨 Design System

The platform uses a professional color scheme optimized for infrastructure visualization:
- **Primary**: Dark Green (#166534) - Hydrogen production
- **Secondary**: Navy Blue (#1e3a8a) - Storage and pipelines  
- **Accent**: Green (#16a34a) - Renewable energy
- **Supporting**: White backgrounds with strategic color highlights

## 📊 Infrastructure Coverage

### Current Data Includes:
- **4 Major Hydrogen Plants** (Reliance, Adani, NTPC, ONGC)
- **3 Storage Facilities** (Kandla, Mumbai, Chennai)
- **3 Renewable Energy Projects** (2,000+ MW capacity)
- **3 Industrial Demand Centers** (Steel, Refining, Fertilizers)
- **2 Transport Hubs** (Mumbai, Delhi NCR)
- **2 Pipeline Corridors** (West Coast, Eastern Network)

### Investment Scope:
- **Total Investment**: ₹2.8+ Lakh Crores
- **Target Capacity**: 5.3+ MTPA by 2030
- **Renewable Integration**: 8.5+ GW dedicated power

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd green-hydrogen-india

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:8080
```

### Building for Production
```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🌐 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment
1. Push changes to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Site will be available at: `https://yourusername.github.io/green-hydrogen-india/`

### Manual Setup
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Set source to "GitHub Actions"
4. The workflow will handle the rest!

### Configuration Files
- `.github/workflows/deploy.yml` - Deployment automation
- `public/.nojekyll` - Ensures proper GitHub Pages routing
- `vite.config.github.ts` - Production build configuration

## 🗺️ Map Features

### Infrastructure Layers
- 🏭 **Hydrogen Plants**: Production facilities with capacity and status
- 🛢️ **Storage Facilities**: Strategic storage locations and terminals  
- 🔗 **Pipeline Network**: Transmission corridors and distribution
- ⚡ **Renewable Energy**: Solar and wind farms dedicated to hydrogen
- 🏢 **Demand Centers**: Industrial consumers and applications
- 🚛 **Transport Hubs**: Refueling stations and distribution points

### Interactive Elements
- **Layer Controls**: Toggle visibility of different infrastructure types
- **Status Indicators**: Operational, under construction, or planned
- **Investment Data**: Detailed cost and capacity information
- **Site Recommendations**: AI-generated optimal locations for new projects

## 🔍 Site Optimization Algorithm

The platform evaluates potential sites based on:
- **Renewable Energy Access** (35% weight)
- **Demand Proximity** (25% weight)  
- **Transport Connectivity** (20% weight)
- **Land Availability** (10% weight)
- **Regulatory Support** (10% weight)

## 📈 Business Impact

- **Capital Efficiency**: Direct investments to high-yield projects
- **Risk Reduction**: Avoid redundant infrastructure development  
- **Network Optimization**: Enable coordinated hydrogen ecosystem growth
- **Policy Support**: Data-driven insights for regulatory decisions

## 🤝 Contributing

We welcome contributions to improve the platform:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 Data Sources

Infrastructure data is compiled from:
- Ministry of New and Renewable Energy (MNRE)
- Central Electricity Authority (CEA)
- National Hydrogen Mission reports
- Industry announcements and regulatory filings

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions, suggestions, or collaboration opportunities:
- **Project Lead**: [Your Name]
- **Email**: [your.email@domain.com]
- **LinkedIn**: [Your LinkedIn Profile]

---

**Built with ❤️ for India's Green Hydrogen Future**

*Supporting the National Hydrogen Mission and India's net-zero ambitions*
