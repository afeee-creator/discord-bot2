const fs = require('fs');
const path = require('path');
const {
    Client,
    GatewayIntentBits,
    Collection,
    REST,
    Routes
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// ====== ŁADOWANIE KOMEND Z FOLDERU "commands" ======

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// ====== REJESTRACJA KOMEND NA SERWERZE ======

client.once('ready', async () => {
    console.log(`Zalogowano jako ${client.user.tag}`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
            { body: commands }
        );
        console.log("Slash commands zarejestrowane!");
    } catch (error) {
        console.error(error);
    }
});

// ====== OBSŁUGA INTERAKCJI ======

client.on('interactionCreate', async interaction => {
    // Komendy slash
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Wystąpił błąd podczas wykonywania komendy!',
                ephemeral: true
            });
        }
    }

    // Przyciski
    if (interaction.isButton()) {
        for (const cmd of client.commands.values()) {
            if (cmd.button) {
                await cmd.button(interaction, client);
            }
        }
    }
});

client.login(process.env.TOKEN);
