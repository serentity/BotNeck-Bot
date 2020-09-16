class av {
	constructor() {
		this.permissions = [ 'get_target_user_info', 'authorized_request' ];
		this.command = 'av';
		this.description = 'Returns the profile picture of the target user.';
		this.usage = 'av <tagged user> [png/gif]';
    }

    errorMessage(id, message) {
        $.ajax({
            type: 'PATCH',
            url: 'https://discordapp.com/api/v6/channels/' + BotNeckAPI.getCurrentChannelId() + '/messages/' + id,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                embed: BotNeckAPI.generateError(message)
            }),
            beforeSend: function (xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function (data) { },
        });
    }
    sendImage(id, embed) {
        $.ajax({
            type: 'PATCH',
            url: 'https://discordapp.com/api/v6/channels/' + BotNeckAPI.getCurrentChannelId() + '/messages/' + id,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ embed }),
            beforeSend: function(xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function(data) {},
        });
    }
    runAfterId(id, func) {
        if (!id) {
            BotNeckAPI.nextMessagePost(() => {
                func();
            })
        } else func();
    }

	execute(message, args) {
        delete message['content'];
        
        // Validate input
        console.log('Command args:', args);
        console.log('Args size', BotNeckAPI.getArgumentNumber(args));
        if(BotNeckAPI.getArgumentNumber(args) < 1)
            return message['embed'] = BotNeckAPI.generateError('You need at least 1 argument for this command!');

        // Find user id
        let userId = BotNeckAPI.getMentionUserId(args[0]);
        if(!userId) return message['embed'] = BotNeckAPI.generateError('Failed to find the specified user id!');

        // Find if using gif of png
        let imgExtension = 'png';
        if(BotNeckAPI.getArgumentNumber(args) > 1)
            if(args[1].toLowerCase() === 'gif')
                imgExtension = 'gif';

        // Setup message Id
        let messageId = null;
        BotNeckAPI.nextMessagePost(() => {
            messageId = BotNeckAPI.getLastUserMessageId();
        });

        // Create initial embed
        let embed = {
            title: 'Avatar',
            type: 'rich',
            color: 0x00FF00,
            description: 'Loading please wait...'
        }
        message['embed'] = embed;

        // Get user information
        BotNeckAPI.getTargetUser(APIKey, userId, user => {
            if(!user) return this.runAfterId(messageId, () => { this.errorMessage(messageId, 'Failed to get user information!') });

            // Print out user information
            this.runAfterId(messageId, () => {
                delete embed['description'];
                delete embed['title'];
                embed['image'] = {
                    url: `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.${imgExtension}`
                }

                this.sendImage(messageId, embed);
            });
        });
	}
}
