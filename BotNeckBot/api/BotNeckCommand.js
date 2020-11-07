const { DiscordClientMessage } = require('./DiscordAPI');

module.exports = class BotNeckCommand {
    /**
     * The command that has to be written into after the prefix to execute the command
     * @returns {String}
     */
    get Command() { return ''; }
    /**
     * The description of the command
     * @returns {String}
     */
    get Description() { return ''; }
    /**
     * The usage of the command
     * @returns {String}
     */
    get Usage() { return ''; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {}
}