const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require('discord.js');

const LOG_CHANNEL = '1470491974560780408';

module.exports = {
    name: 'interactionCreate',

    async execute(interaction) {
        // ====== OTWIERANIE TICKETA ======
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
            const type = interaction.values[0];
            const user = interaction.user;

            const existing = interaction.guild.channels.cache.find(
                ch => ch.name.includes(user.id)
            );

            if (existing) {
                return interaction.reply({
                    content: '❌ Masz już otwarty ticket!',
                    ephemeral: true
                });
            }

            // Nazwy kanałów wg Twojej opcji C
            const names = {
                zamowienia: `zamowienie-${user.id}`,
                support: `support-${user.id}`,
                wspolpraca: `wspolpraca-${user.id}`,
                problem_zamowienie: `problem-${user.id}`
            };

            const channel = await interaction.guild.channels.create({
                name: names[type],
                type: 0,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ]
                    },
                    {
                        id: interaction.client.user.id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            });

            const embed = new EmbedBuilder()
                .setTitle('🎫 Ticket otwarty')
                .setDescription('Opisz swój problem lub sprawę, a administracja wkrótce odpowie.')
                .setColor('#2ecc71');

            const closeBtn = new ButtonBuilder()
                .setCustomId('close_ticket_confirm')
                .setLabel('Zamknij ticket')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(closeBtn);

            await channel.send({
                content: `<@${user.id}>`,
                embeds: [embed],
                components: [row]
            });

            return interaction.reply({
                content: `🎫 Ticket został otwarty: ${channel}`,
                ephemeral: true
            });
        }

        // ====== POTWIERDZENIE ZAMKNIĘCIA ======
        if (interaction.isButton() && interaction.customId === 'close_ticket_confirm') {
            const confirmBtn = new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Potwierdź zamknięcie')
                .setStyle(ButtonStyle.Danger);

            const cancelBtn = new ButtonBuilder()
                .setCustomId('cancel_close')
                .setLabel('Anuluj')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

            return interaction.reply({
                content: 'Czy na pewno chcesz zamknąć ticket?',
                components: [row],
                ephemeral: true
            });
        }

        // ====== ANULOWANIE ZAMKNIĘCIA ======
        if (interaction.isButton() && interaction.customId === 'cancel_close') {
            return interaction.update({
                content: '❎ Zamknięcie anulowane.',
                components: []
            });
        }

        // ====== ZAMYKANIE TICKETA ======
        if (interaction.isButton() && interaction.customId === 'close_ticket') {
            const channel = interaction.channel;

            const logEmbed = new EmbedBuilder()
                .setTitle('📁 Ticket zamknięty')
                .setDescription(`Ticket: ${channel.name}\nZamknięty przez: <@${interaction.user.id}>`)
                .setColor('#e74c3c')
                .setTimestamp();

            const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL);
            if (logChannel) logChannel.send({ embeds: [logEmbed] });

            await interaction.update({
                content: '🗑 Ticket zostanie zamknięty za 3 sekundy...',
                components: []
            });

            setTimeout(() => channel.delete(), 3000);
        }
    }
};
