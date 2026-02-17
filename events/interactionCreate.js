module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === 'shop_menu') {

            const value = interaction.values[0];

            if (value === 'discord') {
                return interaction.reply({
                    ephemeral: true,
                    content:
                        '**DISCORD — CENNIK**\n' +
                        'Nitro Classic — 8 zł\n' +
                        'Nitro Basic — 10 zł\n' +
                        'Nitro Full — 15 zł\n' +
                        'Boost 1x — 2 zł\n' +
                        'Boost 2x — 3 zł'
                });
            }

            if (value === 'social') {
                return interaction.reply({
                    ephemeral: true,
                    content:
                        '**SOCIAL BOOSTING — WYBIERZ PLATFORMĘ**\n' +
                        'Instagram / TikTok / Spotify / Twitch / YouTube / Kick\n' +
                        'Napisz na ticket, aby wybrać platformę.'
                });
            }

            if (value === 'vpn') {
                return interaction.reply({
                    ephemeral: true,
                    content:
                        '**VPN**\n' +
                        'Surfshark Lifetime — 7 zł'
                });
            }

            if (value === 'lol') {
                return interaction.reply({
                    ephemeral: true,
                    content:
                        '**LEAGUE OF LEGENDS — WYBIERZ PODKATEGORIĘ**\n' +
                        '• Cennik Skinów\n' +
                        '• Ceny Przepustek\n' +
                        '• Inne\n' +
                        'Napisz na ticket, aby wybrać sekcję.'
                });
            }

            if (value === 'streamingi') {
                return interaction.reply({
                    ephemeral: true,
                    content:
                        '**STREAMINGI**\n' +
                        'Disney+ — 7 zł\n' +
                        'Crunchyroll — 4 zł\n' +
                        'Molotov.tv — 5 zł\n' +
                        'HBO Max — 7 zł\n\n' +
                        'Szukasz innych? Zapytaj w tickecie ^^'
                });
            }

            if (value === 'inne') {
                return interaction.reply({
                    ephemeral: true,
                    content:
                        '**INNE**\n' +
                        '1 miesiąc ChatGPT+ — 7 zł\n' +
                        'Lifetime Duolingo Premium — 4 zł\n' +
                        'CapCut Pro — 5 zł'
                });
            }

            if (value === 'metody') {
                return interaction.reply({
                    ephemeral: true,
                    content:
                        '**METODY / DOSTAWCY**\n\n' +
                        '**Metody:**\n' +
                        '<:ubereats:1463242677498937399> Metoda na tanie jedzenie UE/Glovo — 8 zł\n' +
                        'Metoda SMS — 5 zł\n' +
                        'Metoda VPS — 3 zł\n\n' +
                        '**Dostawcy:**\n' +
                        'Dostawca League of Legends — 15 zł\n' +
                        'Dostawca Social‑Boosting — 15 zł\n' +
                        'Dostawca Discord Boost — 20 zł\n' +
                        'Dostawca Discord Nitro — 20 zł'
                });
            }
        }
    }
};
