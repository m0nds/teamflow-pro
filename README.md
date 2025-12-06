# TeamFlow Pro

> **⚠️ Note: This project is still in active development. Features may be incomplete or subject to change.**

A modern, real-time task management and collaboration platform built with Next.js, designed to help teams organize projects, track tasks, and collaborate seamlessly.

## 🚀 Features

### Project Management
- **Create & Manage Projects**: Organize your work with custom projects
- **Project Cover Images**: Upload and manage project cover images via Cloudinary
- **Project Status Tracking**: Track projects with statuses (Active, Completed, On Hold, Cancelled)
- **Priority Management**: Set project priorities (Low, Medium, High, Urgent)
- **Due Date Tracking**: Keep track of project deadlines

### Task Management
- **Kanban Board**: Drag-and-drop task board with four columns:
  - To Do
  - In Progress
  - Review
  - Done
- **Task Assignment**: Assign tasks to team members
- **Priority Levels**: Set task priorities (Low, Medium, High, Urgent)
- **Due Dates**: Track task deadlines
- **Task Details**: Rich task descriptions and metadata

### Real-Time Collaboration
- **Live Updates**: Real-time task status changes using Socket.io
- **Online Presence**: See who's currently viewing the same project
- **Instant Notifications**: Get notified instantly when tasks are updated or assigned
- **Activity Feed**: Track all project and task activities in real-time

### Notifications System
- **Real-Time Notifications**: Receive instant notifications via WebSocket
- **Notification Center**: Centralized notification hub with unread counts
- **Notification Types**:
  - Task assigned
  - Task status changed
  - Task comments
  - Project created/updated
  - Team invites
  - Mentions
- **Mark as Read**: Individual and bulk mark-as-read functionality

### Analytics Dashboard
- **Project Metrics**: Track total projects, tasks, and completion rates
- **Visual Analytics**: 
  - Pie charts for task status distribution
  - Bar charts for priority analysis
  - Task completion trends
- **Top Projects**: View projects with the most tasks
- **Recent Activity**: Monitor recent workspace activities
- **Completion Rates**: Track team productivity metrics

### User Management
- **Authentication**: Secure authentication powered by Clerk
- **User Roles**: Role-based access control (Admin, Manager, Member)
- **User Profiles**: Customizable user profiles with avatars and bios
- **Team Management**: Invite and manage team members

### User Interface
- **Modern Design**: Beautiful, responsive UI built with Tailwind CSS
- **Component Library**: Radix UI components for accessible interactions
- **Drag & Drop**: Smooth drag-and-drop interactions with @dnd-kit
- **Toast Notifications**: User-friendly toast notifications with Sonner
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Database**: Prisma ORM with SQLite
- **Authentication**: Clerk
- **Real-Time**: Socket.io
- **File Upload**: Cloudinary
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI
- **Animations**: Framer Motion

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- A Clerk account (for authentication)
- A Cloudinary account (for image uploads)

## 🏃 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd teamflow-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Database
   DATABASE_URL="file:./prisma/dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
teamflow-pro/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── dev.db             # SQLite database
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   └── sign-in/       # Authentication pages
│   ├── components/        # React components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── notifications/ # Notification components
│   │   ├── projects/      # Project components
│   │   ├── tasks/         # Task components
│   │   └── ui/            # UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Current Capabilities

### ✅ Implemented Features
- User authentication and authorization
- Project creation and management
- Task creation with drag-and-drop Kanban board
- Real-time task updates via Socket.io
- Notification system with real-time delivery
- Analytics dashboard with charts and metrics
- Image uploads for project covers
- User presence indicators
- Activity tracking
- Responsive design

### 🚧 In Development
- Enhanced team collaboration features
- Advanced filtering and search
- Task comments and discussions
- File attachments
- Project templates
- Export/import functionality
- Mobile app
- Advanced reporting

## 🤝 Contributing

This project is currently in active development. Contributions, suggestions, and feedback are welcome!


## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Authentication by [Clerk](https://clerk.com)
- UI components from [Radix UI](https://www.radix-ui.com)
- Icons from [Lucide](https://lucide.dev)

---

**Note**: This project is a work in progress. Some features may be incomplete or subject to change. Use at your own discretion.
