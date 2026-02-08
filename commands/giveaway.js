const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

// pamięć giveawayów
const giveaways = new Map();

// funkcja parsowania czasu (10s, 5m, 1h, 2d)
function parseTime(input) {
    const match = input.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Tworzy giveaway z przyciskiem')
        .addStringOption(option =>
            option.setName('czas')
                .setDescription('Czas trwania (np. 10s, 5m, 1h, 2d)')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('zwyciezcy')
                .setDescription('Liczba zwycięzców')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('nagroda')
                .setDescription('Nagroda w giveaway’u')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const czasInput = interaction.options.getString('czas');
        const zwyciezcy = interaction.options.getInteger('zwyciezcy');
        const nagroda = interaction.options.getString('nagroda');

        const duration = parseTime(czasInput);
        if (!duration) {
            return interaction.reply({
                content: '❌ Nieprawidłowy format czasu! Użyj np. `10s`, `5m`, `1h`, `2d`.',
                ephemeral: true
            });
        }

        if (zwyciezcy < 1) {
            return interaction.reply({
                content: '❌ Liczba zwycięzców musi być większa od 0.',
                ephemeral: true
            });
        }

        const endTimestamp = Date.now() + duration;

        const embed = new EmbedBuilder()
            .setTitle('🎉 KONKURS × VNV-SHOP 🎉')
            .setColor('#9b59b6')
            .addFields(
                { name: '🏆 Nagroda', value: nagroda },
                { name: '⏰ Czas trwania', value: czasInput, inline: true },
                { name: '👑 Zwycięzców', value: `${zwyciezcy}`, inline: true },
                { name: '👥 Uczestnicy', value: '0', inline: true },
            )
            .setFooter({ text: 'Kliknij przycisk poniżej, aby wziąć udział!' });

        const button = new ButtonBuilder()
            .setCustomId('join_giveaway')
            .setLabel('Weź udział 🎉')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        const message = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        giveaways.set(message.id, {
            users: new Set(),
            zwyciezcy,
            nagroda,
            channelId: message.channel.id,
            messageId: message.id,
            endTimestamp
        });

        // timer losowania
        setTimeout(async () => {
            const data = giveaways.get(message.id);
            if (!data) return;

            const usersArray = Array.from(data.users);

            const channel = await client.channels.fetch(data.channelId).catch(() => null);
            if (!channel) return;

            if (usersArray.length === 0) {
                await channel.send('🎉 Giveaway zakończony — brak uczestników, konkurs anulowany.');
                giveaways.delete(message.id);
                return;
            }

            const winners = [];
            const pool = [...usersArray];

            for (let i = 0; i < data.zwyciezcy && pool.length > 0; i++) {
                const index = Math.floor(Math.random() * pool.length);
                winners.push(pool.splice(index, 1)[0]);
            }

            const winnersMention = winners.map(id => `<@${id}>`).join(', ');

            const resultEmbed = new EmbedBuilder()
                .setTitle('🎉 WYNIKI GIVEAWAY’A × VNV-SHOP 🎉')
                .setColor('#9b59b6')
                .addFields(
                    { name: '🏆 Nagroda', value: data.nagroda },
                    { name: '👑 Zwycięzcy', value: winnersMention },
                    { name: '👥 Uczestnicy', value: `${usersArray.length}` },
                );

            await channel.send({ content: '🎉 Giveaway zakończony!', embeds: [resultEmbed] });

            giveaways.delete(message.id);
        }, duration);
    },

    // obsługa kliknięcia przycisku
    async button(interaction) {
        if (interaction.customId !== 'join_giveaway') return;

        const data = giveaways.get(interaction.message.id);
        if (!data) {
            return interaction.reply({
                content: '❌ Ten giveaway już się zakończył.',
                ephemeral: true
            });
        }

        const userId = interaction.user.id;

        if (data.users.has(userId)) {
            return interaction.reply({
                content: '❌ Już bierzesz udział w tym giveaway’u!',
                ephemeral: true
            });
        }

        data.users.add(userId);

        const embed = EmbedBuilder.from(interaction.message.embeds[0]);
        const fields = embed.data.fields;
        const participantsField = fields.find(f => f.name === '👥 Uczestnicy');
        participantsField.value = `${data.users.size}`;
        embed.setFields(fields);

        await interaction.update({ embeds: [embed], components: interaction.message.components });

        await interaction.followUp({
            content: '🎉 Dołączyłeś do giveaway’a!',
            ephemeral: true
        });
    }
};
