const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ---- TWORZYMY KOMENDĘ /ping ----
const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Bot odpowiada Pong!')
        .toJSON()
];

// ---- REJESTRACJA KOMEND NA SERWERZE ----
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

// ---- OBSŁUGA KOMEND ----
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.login(process.env.TOKEN);
