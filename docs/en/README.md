# APISIX Web UI

A modern Apache APISIX API Gateway Web User Interface built with Vue.js and Electron.

## Features

- 🚀 Modern Vue.js 3 interface
- 🖥️ Desktop application support via Electron
- 🔧 Route management
- 🛡️ SSL certificate management
- 🔄 Service configuration
- ⚖️ Upstream load balancing management
- 📋 Global rules configuration
- 🎨 Element Plus UI components

## Requirements

- Node.js (version 16 or higher)
- npm or pnpm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/apisix-web-ui.git
cd apisix-web-ui
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

## Development

Start the development server:
```bash
npm run dev
```

## Build

### Web Application
```bash
npm run build
```

### Electron Application
```bash
npm run electron:build
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run electron:serve` - Build and run Electron app
- `npm run electron:build` - Build Electron executable

## Project Structure

```
src/
├── components/     # Vue components
├── views/         # Page components
├── api/           # API modules
├── utils/         # Utility functions
├── route/         # Router configuration
└── style.css      # Global styles
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [create an issue](https://github.com/your-username/apisix-web-ui/issues).
