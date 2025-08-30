# Hydrogen Infrastructure Analysis Platform

## Overview

This is a full-stack web application for analyzing and optimizing hydrogen energy infrastructure deployment. The platform provides interactive mapping capabilities to visualize hydrogen assets (plants, storage, pipelines, hubs), renewable energy sources, and demand centers. Users can perform site optimization analysis to identify optimal locations for new hydrogen infrastructure based on various criteria like renewable energy proximity, market demand, and cost optimization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React with TypeScript and follows a modern component-based architecture:

- **UI Framework**: React with Vite as the build tool and development server
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Maps**: Leaflet for interactive mapping capabilities with custom markers and layers
- **Forms**: React Hook Form with Zod validation for type-safe form handling

The frontend uses a clean separation of concerns with dedicated folders for components (UI, map, modals, sidebar), hooks for reusable logic, and pages for route components. The component structure follows the shadcn/ui pattern with separate UI primitives and composed business components.

### Backend Architecture
The server is built using Express.js with TypeScript and follows a REST API pattern:

- **Framework**: Express.js with middleware for JSON parsing and request logging
- **Storage Layer**: Abstract storage interface (IStorage) with in-memory implementation for development, designed to be easily swapped with database implementations
- **API Design**: RESTful endpoints for CRUD operations on hydrogen assets, renewable sources, demand centers, and site recommendations
- **Development Setup**: Vite integration for development with HMR support and static file serving

The backend implements a clean architecture with separated concerns - route handlers in `/routes.ts`, business logic in `/storage.ts`, and server configuration in `/index.ts`.

### Data Layer
The application uses a flexible data modeling approach:

- **Schema Definition**: Shared schema definitions using Drizzle ORM with Zod validation
- **Database**: PostgreSQL configured through Drizzle (production ready, currently using in-memory storage for development)
- **Data Models**: Core entities include HydrogenAsset, RenewableSource, DemandCenter, and SiteRecommendation
- **Validation**: Type-safe data validation using Zod schemas derived from Drizzle table definitions

### Key Features and Design Decisions

**Interactive Mapping System**:
- Leaflet-based mapping with custom markers for different asset types
- Layer management system allowing users to toggle visibility of different infrastructure types
- Responsive design that works on both desktop and mobile devices

**Site Optimization Engine**:
- Multi-criteria optimization algorithm considering renewable proximity, market demand, cost factors, transport access, and regulatory compliance
- Configurable investment range filtering
- Real-time recommendation generation based on user-selected criteria

**Component Architecture**:
- Modular component design with clear separation between UI components and business logic
- Custom hooks for complex state management (map layers, optimization parameters)
- Reusable UI components following accessibility best practices

**Development Experience**:
- Hot module replacement in development
- Type safety throughout the stack with TypeScript
- Consistent code formatting and linting
- Component-based architecture for maintainability

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, TanStack React Query for data fetching
- **Build Tools**: Vite for development and building, with React plugin
- **Styling**: Tailwind CSS with PostCSS, shadcn/ui component system

### Database and ORM
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management

### UI and Interaction
- **Component Library**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Hookform Resolvers for validation
- **Maps**: Leaflet for interactive mapping capabilities
- **Notifications**: Built-in toast system using Radix UI Toast

### Development and Deployment
- **Runtime**: Node.js with Express.js server
- **Development**: TSX for TypeScript execution, Replit-specific plugins for development environment
- **Date Handling**: date-fns for date manipulation and formatting
- **Utilities**: clsx and tailwind-merge for conditional styling, nanoid for ID generation

### Replit Integration
- **Development Plugins**: Replit Vite plugins for error handling and cartographer integration
- **Environment**: Optimized for Replit deployment with specific configurations for the platform

The architecture prioritizes type safety, maintainability, and scalability while providing a rich user experience for hydrogen infrastructure analysis and planning.
