# UCarX Web Application

## Overview
UCarX is a comprehensive car management web application built with React. It helps Egyptian users track vehicle maintenance, find trusted service centers, and manage their car's entire lifecycle.

## Features
- **User Authentication**: Phone-based OTP login and Google sign-in
- **Vehicle Management**: Add and manage multiple vehicles with detailed information
- **Maintenance Tracking**: Record services, repairs, and inspections with cost and mileage
- **Fuel Tracking**: Monitor fuel consumption, costs, and efficiency with interactive charts
- **Traffic Fines Tracker**: Track and pay traffic violations via Fawry payment integration
- **Reminders System**: Set and manage maintenance reminders with due dates and notifications
- **Expense Analytics**: Interactive charts showing spending trends and cost breakdowns by service type
- **Service Centers**: Find and review trusted mechanics with search functionality
- **Marketplace**: Multi-step listing creation for buying, selling, or renting vehicles
- **Document Storage**: Store and manage vehicle-related documents with expiry tracking
- **Notifications Center**: Manage alerts, reminders, and system notifications
- **AI Assistant**: 24/7 chatbot for car maintenance advice and support
- **WhatsApp Integration**: Automated notification templates and reminders
- **Payment Integration**: Fawry payment gateway for fines and services
- **User Profiles**: Manage account settings, preferences, and view statistics

## Pages
- `index.html` - Landing page with features and hero section
- `login.html` - Phone authentication with OTP verification
- `register.html` - New user registration
- `dashboard.html` - Main dashboard with vehicle overview, quick actions, and floating AI button
- `vehicles.html` - Detailed vehicle management with maintenance timeline
- `add-maintenance.html` - Add maintenance records with service details
- `fuel-tracking.html` - Fuel consumption tracking with charts and statistics
- `traffic-fines.html` - Traffic violations tracker with Fawry payment
- `analytics.html` - Expense analytics with interactive charts
- `reminders.html` - Manage upcoming reminders and due dates
- `services.html` - Service center directory with search and ratings
- `marketplace.html` - Vehicle marketplace with price filters
- `create-listing.html` - Multi-step form for creating marketplace listings
- `documents.html` - Document storage and management
- `notifications.html` - Notifications center with read/unread status
- `ai-assistant.html` - AI chatbot for car maintenance support
- `whatsapp-settings.html` - WhatsApp notification templates management
- `profile.html` - User profile and settings management

## Technology Stack
- React 18 (Production CDN)
- TailwindCSS for styling
- Lucide icons (static font icons)
- Trickle Database for data persistence

## Database Structure
- `user` - User profiles and preferences
- `vehicle` - User vehicles with specifications
- `maintenance` - Maintenance records and service history
- `fuel_record` - Fuel fill-up records with consumption tracking
- `traffic_fine` - Traffic violations and payment status
- `service_center` - Service center directory with ratings
- `review` - User reviews for service centers
- `marketplace_listing` - Vehicle listings for sale/rent with detailed specs
- `reminder` - Maintenance and document reminders
- `notification` - In-app notifications with read status
- `document` - Vehicle-related document storage

## Getting Started
1. Visit the landing page at `index.html`
2. Click "Get Started" or register at `register.html`
3. Login with phone number (OTP verification)
4. Add your first vehicle from the dashboard
5. Start tracking maintenance and exploring features

## Key Components
- **Header/Navigation**: Shared navigation across all pages with notifications badge
- **Floating AI Button**: Quick access to AI assistant from any page
- **Vehicle Cards**: Display vehicle information with actions and animations
- **Maintenance Timeline**: Visual history of all services with cost tracking
- **Fuel Tracker**: Charts and statistics for fuel consumption
- **Traffic Fines List**: Payment management with Fawry integration
- **Service Center List**: Searchable directory with ratings and reviews
- **Marketplace Listings**: Multi-step creation with WhatsApp contact
- **Quick Actions**: Fast access to common tasks and features
- **AI Chat Widget**: Real-time car maintenance support
- **WhatsApp Templates**: Automated notification management
- **Profile Management**: User settings, statistics, and preferences

## Future Enhancements
- Real-time GPS tracking for vehicles
- Insurance renewal automation
- Service appointment booking system
- Vehicle valuation calculator
- Accident report filing
- Multi-language support (Arabic RTL)
- Dark mode theme toggle
- Mobile app (iOS/Android)
- Progressive Web App (PWA) features
- Community forum for car owners
- Parts marketplace
- Mechanic certification verification
