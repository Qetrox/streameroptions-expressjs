# Streamer Options

Streamer Options is a website/service that allows content creators to create interaction with their viewers more easily.

Creators and viewers link their twitch accounts to either become a creator or gather points by watching creators. These points can be spend by the viewer to activate effects in game, both positive and negative on the creators mood.

Creators are able to toggle 'modules' making them able to customize what they want their viewers to be able to do. They can also change the amount of points a viewer needs to be able to activate/redeem that 'module'.

A module is a in game effect/event etc. that can change or have effect on the gameplay of the creator.

A viewer receives 10 points every minute that Twitch registers that they are in a creators chat. Streamer Options uses the Twitch API to receive this information.

The website is build on Expressjs, and the 'clients' on different languages for the best compatibility. 
For example:
* Minecraft Server Plugin
    * Java as language
    * Spigot API for integration with the game
* Minecraft Client Plugin (Coming in future)
    * Java as language
    * Fabric API for integration with the game
