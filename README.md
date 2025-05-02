# Streamer Options

Streamer Options was a web-based interaction platform designed to enhance the connection between content creators and their audiences—primarily on Twitch.This project is no longer maintained but is made public for educational and archival purposes.

## 🔧 What It Did

Streamer Options allowed Twitch streamers to create dynamic in-game events triggered by their viewers.By watching a streamer’s content, viewers would passively earn points, which they could spend to trigger real-time effects during gameplay—either helpful or chaotic.

## 🧹 Features
- Twitch Integration:
  Viewers and creators could link their Twitch accounts. Viewers earned 10 points per minute while active in chat, tracked via the Twitch API.
- Modular System: Creators could enable or disable modules—custom actions or in-game effects—and set point costs for redeeming them.
- Game Integration: The platform supported various clients written in different languages to support integration with games like Minecraft.

## 🎮 Game Clients
Streamer Options supported client-side integrations via custom plugins:
- [Minecraft Server Plugin](https://github.com/Qetrox/streameroptions-minecraft-plugin)
   - Written in Java
   - Built on the Spigot API

## 🛠 Tech Stack
- Backend: Node.js with Express
- Twitch Integration: Twitch OAuth + API
- Game Clients: Java-based plugins for Spigot
- MariaDB for storage

## 🗂 Entity Relationship Diagram (ERD)
Below is a simplified ERD showing how the core entities in Streamer Options were related:
![image](https://github.com/user-attachments/assets/9ebcce66-8140-446b-a862-032ed9c0c601)


# 🔗 Related Projects
Streamer Options was supported by additional repositories that provided platform extensions:
- [Streamer Options Twitch Extension Panel](https://github.com/Qetrox/streameroptions-twitch-extension-panel): Twitch panel extension for viewer interaction
- [Streamer Options Discord Bot](https://github.com/Qetrox/streameroptions-discord-bot): Discord integration for command and notification support
- [Streamer Options Minecraft Server Plugin](https://github.com/Qetrox/streameroptions-minecraft-plugin): Minecraft plugin which activated in-game events

## 📦 Status
This project is archived and no longer receives updates.
