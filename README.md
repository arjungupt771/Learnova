# Learning Management System (LMS) — Frontend

A responsive Learning Management System frontend built with React, Vite, Redux Toolkit, and Tailwind CSS. The application provides interfaces for user authentication, course browsing and management, lecture handling, profile management, and subscription checkout.

**Repository:** [lms-frontend](https://github.com/arjungupt771/lms-frontend)

## Features

### Authentication and Authorization
- User registration and sign-in forms with input validation.
- Redux-based authentication state management.
- Protected routes for authenticated users.
- Role-based access for course management.
- User-friendly loading and error feedback.

### Course Management
- Browse available courses.
- View course descriptions and details.
- Create courses with input validation and image previews.
- Handle loading, empty, and error states when fetching courses.

### Lecture Management
- Add lectures to courses.
- Validate video file types and file sizes.
- Preview selected video files.
- Display lectures with video playback.
- Delete lectures and refresh course lecture lists.

### User Profile
- View and edit profile information.
- Update profile images with validation and previews.
- Manage subscription-related actions through the interface.

### Payment Interface
- Razorpay checkout integration in the frontend.
- Payment preparation and verification request handling.
- Success and failure screens.
- User feedback and error handling during checkout.

> **Note:** Successful payment processing depends on a compatible backend and valid payment configuration. A successful frontend build does not confirm end-to-end payment functionality.

### User Experience and Reliability
- Responsive layouts for different screen sizes.
- Centralized API requests using Axios.
- Environment-based API configuration.
- Toast notifications for important actions.
- Improved form validation and duplicate-submission prevention.
- Custom 404 page and application navigation.

## Technology Stack

| Category | Technologies |
|---|---|
| UI | React 18, JSX |
| Development and Build | Vite |
| Styling | Tailwind CSS, DaisyUI |
| State Management | Redux Toolkit, React Redux |
| Routing | React Router DOM |
| API Requests | Axios |
| Notifications | React Hot Toast |
| Icons | React Icons |
| Charts | Chart.js, React Chart.js 2 |
| Code Quality | ESLint |

## Project Structure

```text
lms-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI and authentication components
│   ├── config/              # Axios configuration
│   ├── helpers/             # Validation helpers
│   ├── layouts/             # Shared application layouts
│   ├── pages/
│   │   ├── Course/          # Course listing, details and creation
│   │   ├── Dashboard/       # Lecture management
│   │   ├── Payment/         # Checkout and payment result screens
│   │   └── User/            # Profile and account management
│   └── redux/
│       └── slices/          # Authentication, course, lecture and payment state
├── .env.example             # Example environment configuration
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A compatible LMS backend API for features that require server-side data
- Payment provider configuration for checkout testing

### 1. Clone the repository

```bash
git clone https://github.com/arjungupt771/lms-frontend.git
cd lms-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

The example configuration is:

```env
VITE_API_BASE_URL=http://localhost:5014/api/v1
```

Update `VITE_API_BASE_URL` if your backend API uses a different address or port.

**Important:** Vite exposes variables prefixed with `VITE_` to client-side code. Do not store private API keys, payment secrets, or other sensitive credentials in frontend environment variables.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

### 5. Run the production build

```bash
npm run build
```

The generated production files are placed in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint checks |

## API Configuration

API requests are centralized through the Axios instance in `src/config/axiosInstance.js`.

The base URL is controlled by `VITE_API_BASE_URL`, allowing the frontend to be configured for different backend environments without hardcoding the API address throughout the application.

Authentication, course operations, lecture management, profile actions, and payment-related workflows require the corresponding backend endpoints and expected response formats.

This repository contains the frontend application; backend availability and endpoint compatibility must be configured separately.

## Validation and Quality Checks

Run the following commands before committing changes:

```bash
npm run lint
npm run build
git diff --check
```

The latest frontend improvement commit passed ESLint and the production build.

## Current Scope and Limitations

- This repository focuses on the frontend application.
- API-dependent functionality requires a compatible backend.
- Real payment processing and transaction verification require working backend integration and payment-provider configuration.
- A successful production build verifies compilation, not every runtime integration or complete user workflow.

## Future Improvements

Potential enhancements include:

- Automated component and integration tests.
- Accessibility improvements and keyboard-navigation testing.
- End-to-end testing of authentication, course management, and checkout.
- Additional UI refinements based on practical testing.

## License

No license has been specified in this repository. Add a `LICENSE` file if you intend to publish the project under a particular open-source license.
