# ByDayGigs - Service Marketplace

ByDayGigs is a modern service marketplace platform that connects service providers with customers. Built with React, TypeScript, and Supabase, it offers a seamless experience for booking and managing services.

## Features

- User authentication (login, register, profile management)
- Service listings with detailed information
- Service search and filtering by category
- Booking system for services
- Reviews and ratings
- Provider profiles
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Context API
- **Routing**: React Router
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Supabase credentials
4. Connect to Supabase using the "Connect to Supabase" button in the StackBlitz interface
5. Start the development server:
   ```
   npm run dev
   ```

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations in the `supabase/migrations` folder
3. Enable email/password authentication in the Supabase dashboard
4. Copy your Supabase URL and anon key to the `.env` file

## Project Structure

- `/src/components` - Reusable UI components
- `/src/context` - React context providers
- `/src/pages` - Application pages
- `/src/services` - API service functions
- `/src/lib` - Utility functions and libraries
- `/src/types` - TypeScript type definitions
- `/supabase/migrations` - SQL migrations for Supabase

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.