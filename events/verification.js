const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    AttachmentBuilder
} = require('discord.js');

const { createCanvas } = require('canvas');

// Twoje role
const VERIFIED_ROLE_ID = '1450927027665502387';
const UNVERIFIED_ROLE_ID = '1450927027665502385';

// Generowanie captcha
function generateCaptcha() {
    const canvas = createCanvas(200, 70);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 200, 70);

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];

    ctx.font = '40px Sans';
    ctx.fillStyle = '#000000';
    ctx.fillText(code, 40, 50);

    return { buffer: canvas.toBuffer(), code };
}

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {

        // -------------------------------
        // PRZYCISK — START WERYFIKACJI
        // -------------------------------
        if (interaction.isButton() && interaction.customId === 'verify_btn') {

            const { buffer, code } = generateCaptcha();

            // zapisujemy kod captcha dla użytkownika
            client.captcha = client.captcha || {};
            client.captcha[interaction.user.id] = code;

            const attachment = new AttachmentBuilder(buffer, { name: 'captcha.png' });

            const embed = new EmbedBuilder()
                .setTitle('🔐 Weryfikacja — przepisz kod')
                .setDescription('Przepisz kod z obrazka w okienku, które zaraz się pojawi.')
                .setColor('#6A0DAD')
                .setImage('attachment://captcha.png');

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('captcha_modal')
                    .setLabel('Wpisz kod')
                    .setStyle(ButtonStyle.Primary)
            );

            return interaction.reply({
                embeds: [embed],
                files: [attachment],
                components: [row],
                ephemeral: true
            });
        }

        // -------------------------------
        // OTWARCIE MODALA
        // -------------------------------
        if (interaction.isButton() && interaction.customId === 'captcha_modal') {

            const modal = new ModalBuilder()
                .setCustomId('captcha_submit')
                .setTitle('Wpisz kod z captcha');

            const input = new TextInputBuilder()
                .setCustomId('captcha_input')
                .setLabel('Kod z obrazka')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(input));

            return interaction.showModal(modal);
        }

        // -------------------------------
        // SPRAWDZENIE KODU
        // -------------------------------
        if (interaction.isModalSubmit() && interaction.customId === 'captcha_submit') {

            const userInput = interaction.fields.getTextInputValue('captcha_input');
            const correct = client.captcha?.[interaction.user.id];

            if (!correct) {
                return interaction.reply({
                    content: '❌ Wystąpił błąd — spróbuj ponownie.',
                    ephemeral: true
                });
            }

            if (userInput.toUpperCase() !== correct.toUpperCase()) {
                return interaction.reply({
                    content: '❌ Zły kod! Spróbuj ponownie.',
                    ephemeral: true
                });
            }

            delete client.captcha[interaction.user.id];

            await interaction.member.roles.add(VERIFIED_ROLE_ID);
            await interaction.member.roles.remove(UNVERIFIED_ROLE_ID);

            return interaction.reply({
                content: '✅ Zweryfikowano pomyślnie! Witamy na serwerze.',
                ephemeral: true
            });
        }
    }
};
