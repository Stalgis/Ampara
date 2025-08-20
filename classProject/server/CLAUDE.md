# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development
- `npm run build` - Compile the NestJS application
- `npm run start` - Start the application in production mode
- `npm run start:dev` - Start in development mode with file watching
- `npm run start:debug` - Start in debug mode with file watching

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests

### Code Quality
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

## Architecture Overview

This is a NestJS TypeScript application with MongoDB integration for user management functionality.

### Core Structure
- **Framework**: NestJS with TypeScript, targeting ES2023
- **Database**: MongoDB via Mongoose ODM
- **Configuration**: Uses @nestjs/config with environment-based configuration
- **Main Entry**: `src/main.ts` - bootstraps the application on port 3000 (or PORT env var)

### Module Architecture
- **AppModule** (`src/app.module.ts`): Root module that configures MongoDB connection and imports feature modules
- **UsersModule** (`src/modules/users/`): Feature module for user management with controller, service, and schema
- **Database Config** (`src/config/database.config.ts`): Centralized database configuration using MONGO_URI environment variable

### User Entity Structure
The User schema includes fields for:
- `name` (required)
- `phone`, `age`, `medicalConditions` (array)
- `aiProfile` (AI prompt template identifier)
- Automatic timestamps via Mongoose

### Key Dependencies
- **Core**: @nestjs/core, @nestjs/common, @nestjs/mongoose
- **Database**: mongoose for MongoDB integration
- **External Services**: OpenAI API, Twilio SMS
- **Security**: bcrypt, passport with JWT authentication
- **Validation**: class-validator, class-transformer

### Test Configuration
- Jest configured for unit tests with TypeScript support
- E2E tests configured separately with jest-e2e.json
- Tests located alongside source files with `.spec.ts` extension

### Environment Requirements
- `MONGO_URI` - MongoDB connection string (required for database connectivity)

## Database Schema

The application implements a comprehensive MongoDB data model for an elder care AI system:

### Collections
- **users** - Family members, nurses, and visitors with role-based access
- **elderUsers** - Elder profiles with medical info, emergency contacts, and caregiver relationships  
- **calls** - AI phone call records with transcripts, mood analysis, and instruction references
- **moods** - Automated and manual mood tracking with confidence scores
- **adviceRequests** - Visitor questions and AI responses
- **aiInstructions** - Family/staff tuning instructions for AI behavior (PENDING/APPLIED/SKIPPED)

### Key Relationships
- `users.linkedElders[]` ↔ `elderUsers.caregivers[]` (many-to-many)
- `calls.elderId` → `elderUsers._id` (call history)
- `calls.instructions[]` ↔ `aiInstructions.callId` (instruction application tracking)
- `aiInstructions.elderId` → `elderUsers._id` (instruction targeting)

### AI Instruction Flow
1. Family member creates instruction via chat → `aiInstructions` collection (status: PENDING)
2. Before next call → fetch pending instructions for context
3. During call → apply instructions to AI prompt
4. After call → mark instructions as APPLIED with callId reference

### Database Features
- Automatic index creation on module initialization
- Optimized queries for phone lookups, call history, mood timelines
- Referential integrity via ObjectId relationships