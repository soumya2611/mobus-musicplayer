# 🚌 Mo Bus

> **Your journey, your music.**

**Mo Bus** is a bus playlist web application designed to make everyday bus journeys more enjoyable with continuous music playback.

Users can listen to a curated collection of songs while travelling, control playback, switch between themes, and choose their preferred language. An admin panel allows administrators to manage which songs are available to passengers.

---

## ✨ Features

### 🎵 Music Player

* ▶️ Play and pause songs
* ⏭️ Change to the next song
* ⏮️ Go back to the previous song
* 🔄 Continuous, non-stop music playback
* 🎶 Play specific songs from the playlist
* 📋 View available songs
* Automatically continue playing the next selected song

### 🌐 Multi-Language Support

Mo Bus supports multiple languages:

* 🇮🇳 **Odia**
* 🇮🇳 **Hindi**
* 🇬🇧 **English**

Users can switch the application language according to their preference.

### 🎨 Theme Support

Users can customize their experience by changing the application theme.

* 🌞 Light Theme
* 🌙 Dark Theme

### 🛠️ Admin Section

The admin section provides control over the music playlist.

Administrators can:

* View available songs
* Select songs for users
* Deselect songs from the playlist
* Control which songs are currently available
* Manage the playlist according to their requirements

This allows the passenger-facing playlist to stay curated instead of turning into the digital equivalent of someone's uncle's 2007 pen drive.

---

## 🚌 How It Works

### User Flow

```text
User Opens Mo Bus
        │
        ▼
Select Language
        │
        ▼
Select Theme
        │
        ▼
View Available Playlist
        │
        ▼
Play a Song
        │
        ▼
Play / Pause / Next / Previous
        │
        ▼
Continuous Music Playback
```

### Admin Flow

```text
Admin Login
     │
     ▼
View Music Library
     │
     ├── Select Song
     │
     └── Deselect Song
     │
     ▼
Update User Playlist
     │
     ▼
Selected Songs Available to Users
```

---

## 🎧 Playlist Management

The playlist is controlled from the admin section.

A song can be:

| Status       | Description                   |
| ------------ | ----------------------------- |
| ✅ Selected   | Available to users            |
| ❌ Deselected | Hidden from the user playlist |

This gives the administrator complete control over the songs that passengers can listen to.

---

## 🌍 Language Support

The application provides localized content for:

| Language | Support |
| -------- | ------- |
| ଓଡ଼ିଆ    | ✅       |
| हिन्दी   | ✅       |
| English  | ✅       |

The language selector allows users to switch languages without changing the overall application experience.

---

## 🎨 Theme

Mo Bus provides theme customization so users can choose the appearance they prefer.

```text
🌞 Light Mode
🌙 Dark Mode
```

The selected theme can be applied throughout the application for a consistent user experience.

---

## 📁 Project Structure

A typical project structure can be organized as:

```text
mo-bus/
│
├── public/
│   ├── music/
│   ├── horns/
│   ├── images/
│   └── icons/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── utils/
│   └── assets/
│
├── admin/
│   └── ...
│
├── README.md
└── package.json
```

> Update the structure above according to the actual folders in your project.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the Project

```bash
cd mo-bus
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available on the local development server.

---

## 🔐 Admin Panel

The admin panel is intended for playlist management.

Administrators can decide which songs should be visible and playable for users.

### Admin Capabilities

* Manage available songs
* Select songs
* Deselect songs
* Maintain the active playlist
* Control the music experience for passengers

---

## 🎯 Project Goal

The goal of **Mo Bus** is to create a simple and enjoyable entertainment experience for passengers during their bus journey.

Instead of passengers having to manually search for songs or manage their own playlist, the application provides a controlled, continuous music experience.

---

## 💡 Future Improvements

Potential future enhancements include:

* 🔊 Volume control
* ❤️ Favorite songs
* 📱 Mobile-friendly PWA support
* 🔀 Shuffle mode
* 🔁 Repeat mode
* 🎼 Playlist categories
* 📊 Admin music analytics
* 👥 Multiple admin roles
* 🔔 Notifications for newly added songs
* 🎙️ Now-playing display
* 🎚️ Audio equalizer

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push the branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

## 📄 License

This project is currently intended for educational and project purposes.

Add your preferred license here if the project is released publicly.

---

## 🚌 Mo Bus

**Listen. Travel. Enjoy the Journey.**

> 🎵 *Your bus. Your journey. Your playlist.*
with love from soumya ❤️
