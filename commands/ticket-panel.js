const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-panel')
        .setDescription('Tworzy panel ticketów z menu wyboru')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🎫 VNV-SHOP × STWÓRZ TICKET')
            .setDescription(
                'Masz problem, chcesz złożyć zamówienie lub masz jakieś pytania?\n' +
                '━━━━━━━━━━━━━━━━━━━━\n' +
                '📩 × Aby utworzyć ticket wybierz odpowiednią kategorię!'
            )
            .setFooter({ text: 'VNV-SHOP — Profesjonalny system ticketów' });

        const menu = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('Wybierz typ ticketu')
            .addOptions(
                {
                    label: 'Zamówienia',
                    value: 'zamowienia',
                    description: 'Otwórz ticket dotyczący zamówienia'
                },
                {
                    label: 'Support',
                    value: 'support',
                    description: 'Uzyskaj pomoc techniczną'
                },
                {
                    label: 'Współpraca',
                    value: 'wspolpraca',
                    description: 'Nawiąż współpracę'
                },
                {
                    label: 'Problem z zamówieniem',
                    value: 'problem_zamowienie',
                    description: 'Zgłoś problem z zamówieniem'
                }
            );

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
