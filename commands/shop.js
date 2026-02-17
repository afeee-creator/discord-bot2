const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Wyświetla panel VNV-SHOP'),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor('#ff4d6d')
            .setTitle('<:heart~1:1470835571122376878> × VNV‑SHOP — CENNIK')
            .setDescription(
                '**W VNV‑SHOP oferujemy szeroki zakres usług:**\n' +
                'n1tr0, b00sty, social‑boostingi, streamingi, metody oraz wiele innych produktów.\n\n' +
                '**Każda kategoria została starannie przygotowana**, aby zapewnić Ci szybki dostęp do pełnej oferty i aktualnych cen.\n\n' +
                '**Przejrzyj dostępne sekcje poniżej i wybierz interesującą Cię kategorię.**\n' +
                'Pozwól, że przeprowadzimy Cię przez ofertę w sposób prosty, przejrzysty i profesjonalny.'
            );

        const menu = new StringSelectMenuBuilder()
            .setCustomId('shop_menu')
            .setPlaceholder('Wybierz kategorię…')
            .addOptions([
                {
                    label: ':1470835571122376878: Discord',
                    value: 'discord'
                },
                {
                    label: ':1470835571122376878: Social Boosting',
                    value: 'social'
                },
                {
                    label: ':1470835571122376878: VPN',
                    value: 'vpn'
                },
                {
                    label: ':1470835571122376878: League of Legends',
                    value: 'lol'
                },
                {
                    label: ':1470835571122376878: Streamingi',
                    value: 'streamingi'
                },
                {
                    label: ':1470835571122376878: Inne',
                    value: 'inne'
                },
                {
                    label: ':1470835571122376878: Metody / Dostawcy',
                    value: 'metody'
                }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};
