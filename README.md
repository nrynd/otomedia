# React Native CRUD User App

[![React Native](https://img.shields.io/badge/React_Native-0.71.10-blue?style=flat-square)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A simple **React Native** CRUD app for managing users, with **Light/Dark theme support**, **Redux state management**, and **SQLite database**.

---

## 📸 Screenshots / Demo

<!-- You can replace these with actual images or GIFs -->
![Splash Screen](docs/splash%20screen.png)
![Form Screen](docs/form%20screen.png.png)
![List Screen](docs/list%20screen.png)

---

## ⭐ Features

- Create, Read, Update, Delete, Search users
- Persistent **SQLite local database**
- State management with **Redux Toolkit**
- **Light / Dark / System theme toggle**
- Responsive UI with **React Native Paper**
- Animated transitions for buttons and theme switching
- Input validation for user forms

---

## 🛠 Tech Stack

- **React Native** + **TypeScript**
- **Redux Toolkit** (state management)
- **React Navigation** (Native Stack)
- **SQLite** (local database)
- **React Native Paper** (UI components)
- **AsyncStorage** (theme persistence)

---

## 📁 Folder Structure

```text
src/
 ├─ assets         # image, icon
 ├─ components/    # Reusable UI components (e.g. UserItem)
 ├─ hooks/         # Custom hooks (e.g. useUsers)
 ├─ navigation/    # React Navigation setup
 ├─ screens/       # Splash, Form, List
 ├─ store/         # Redux slices (users, theme)
 ├─ db/            # SQLite database helpers
 ├─ utils          # Brand Color default
 └─ theme/         # Light/Dark theme palettes
