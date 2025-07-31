# Building Performance Dashboard - Documentation

This directory contains all the documentation for the Building Performance Dashboard project.

## Setup Guides

- **[VENV_SETUP.md](./VENV_SETUP.md)** - Virtual environment setup guide
- **[WINDOWS_SETUP.md](./WINDOWS_SETUP.md)** - Complete Windows setup instructions
- **[WINDOWS_OPTIMIZATIONS.md](./WINDOWS_OPTIMIZATIONS.md)** - Windows-specific optimizations and troubleshooting

## Project Structure

```
building-performance-dashboard/
├── backend/                 # Python Flask backend
│   ├── main.py             # Main Flask application
│   ├── database.py         # Database models and operations
│   ├── services.py         # Business logic services
│   ├── ai_models.py        # AI/ML model integration
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend-specific documentation
├── src/                    # Frontend React application
│   ├── dashboard.js        # Main dashboard component
│   ├── api.js             # API integration
│   └── index.js           # Application entry point
├── public/                 # Static assets
├── scripts/                # Setup and startup scripts
├── docs/                   # Documentation (this directory)
├── package.json           # Node.js dependencies
└── README.md              # Main project README
```

## Quick Start

1. **Backend Setup**: Follow the [VENV_SETUP.md](./VENV_SETUP.md) guide
2. **Frontend Setup**: Run `npm install` in the root directory
3. **Start Servers**: Use the scripts in the `scripts/` directory for your platform

## Platform-Specific Notes

- **Windows Users**: See [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) and [WINDOWS_OPTIMIZATIONS.md](./WINDOWS_OPTIMIZATIONS.md)
- **macOS/Linux Users**: Follow [VENV_SETUP.md](./VENV_SETUP.md)

## Troubleshooting

If you encounter issues:
1. Check the platform-specific documentation above
2. Ensure all dependencies are properly installed
3. Verify environment variables are correctly set
4. Check the backend logs for detailed error messages 