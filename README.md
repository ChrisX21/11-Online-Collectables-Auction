# NautiLux Auctions

**NautiLux Auctions** is an online auction platform for collectible, high-end vessels. This project is designed to deliver a premium user experience for buyers and sellers of rare and expensive boats. The platform includes a backend built with **MSSQL**, **Entity Framework**, and **.NET 8**, and a frontend built with **Next.js** and **TypeScript**.

---

## 🚀 Features

### Core Features
- **User Authentication and Roles**: Secure login and user roles (e.g., admin, seller, buyer).
- **Auction System**: Create, bid on, and monitor auctions for collectible vessels.
- **Real-Time Updates**: Live bidding and notifications.
- **Search and Filters**: Advanced search and filtering for specific vessel types, price ranges, etc.
- **Dashboard**: Personalized dashboards for users to manage their auctions and bids.

### Planned Features
- **Payment Gateway Integration**: Secure payment processing for completed auctions.
- **Favorites System**: Allow users to bookmark auctions.
- **Responsive Design**: Mobile-friendly user interface.
- **Admin Management Tools**: Manage auctions, users, and platform policies.
- **Email Notifications**: Alerts for bid updates, auction results, and other events.

---

## 🛠️ Tech Stack

### Backend
- **.NET 8**
- **MSSQL**
- **Entity Framework Core**

### Frontend
- **Next.js**
- **TypeScript**
- **Tailwind**

---

## 📈 Project Status

### ✅ Completed
- Project Name and Concept
- Technology Stack Selection
- Initial Setup of Backend (MSSQL and .NET 8)
- Initial Setup of Frontend (Next.js and TypeScript)

### 🔄 In Progress
- User Authentication and Role Management
- Auction Model Implementation in Backend
- Base Frontend Components and Layout

### ⏳ To Do
- Connect Backend and Frontend
- Implement Real-Time Bidding System
- Develop Search and Filter Functionality
- Create User Dashboards
- Add Payment Gateway Integration
- Optimize for Mobile Devices
- Comprehensive Testing

---

## 💡 Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- .NET 8 SDK
- MSSQL Server

### Backend Setup
1. Clone the repository.
2. Navigate to the backend folder and restore NuGet packages:
   ```bash
   dotnet restore
   ```
3. Set up the MSSQL database and update the connection string in `appsettings.json`.
4. Run migrations:
   ```bash
   dotnet ef database update
   ```
5. Start the backend server:
   ```bash
   dotnet run
   ```

### Frontend Setup
1. Navigate to the frontend folder and install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📜 License
This project is licensed under the MIT License.

---

## 📧 Contact
For questions or feedback, reach out to the project creator.

