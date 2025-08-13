# Overview

This is a modern full-stack web application for Iglo-bus.rent, a Polish refrigerated vehicle rental service. The application serves as a business website showcasing three Toyota ProAce vehicle types (City, ProAce, and Maxi) with detailed pricing and booking functionality. Built with React on the frontend and Express.js on the backend, the application features a clean, professional design with comprehensive vehicle information, pricing tables, FAQ section, and contact forms.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Design System**: Custom brand colors (blue theme) with light/dark mode support

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Development**: Hot module replacement via Vite integration in development mode
- **Build**: ESBuild for server-side bundling

## Data Layer
- **Database**: PostgreSQL configured via Neon serverless connection
- **Schema**: Drizzle schema with user authentication table structure
- **Migrations**: Drizzle Kit for database schema management
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Component Architecture
- **Component Structure**: Modular components organized by feature (header, hero, fleet, FAQ, footer)
- **Reusable UI**: Comprehensive UI component library with consistent styling
- **Form Components**: Dedicated booking form with validation and mailto integration
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities

## Development Workflow
- **Hot Reload**: Vite development server with HMR
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Code Organization**: Shared types and schemas between client and server
- **Asset Management**: Static asset handling with proper imports and optimization

# External Dependencies

## Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect

## UI & Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Framer Motion**: Animation library for smooth transitions

## Development Tools
- **Vite**: Fast build tool with HMR capabilities
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast JavaScript bundler for production builds

## Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation via Drizzle Zod integration

## Communication
- **Mailto Integration**: Direct email booking system without external email service
- **Phone Integration**: Direct calling functionality via tel: links

## Hosting & Deployment
- **Replit**: Development and hosting platform with integrated tooling
- **Static Assets**: Local asset management for vehicle images