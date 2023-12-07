/* eslint-disable max-nested-callbacks */
const { SlashCommandBuilder, ModalBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, ComponentType, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputStyle } = require('discord.js');
const UserModel = require('../../schemas/userSchema.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gerenciar')
		.setDescription('Gerencie a sua empresa!'),
	async execute(interaction) {
		const doc = await UserModel.findOne({ id: interaction.user.id });
		if (!doc) {
			return interaction.reply({ content: `${interaction.client.emoji.error} ${interaction.user} **|** Você precisa ter uma empres para poder gerenciar!` });
		}
		if (doc.businesses.length === 1) {
			const business = doc.businesses[0];
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.client.emoji.business} ${business.name}`)
				.setDescription(`**Nome:** ${business.name}\n**CNPJ:** ${business.cnpj}\n**Banco:** **${business.bank}**\n**Capital:** ${business.totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n**Dividendos:** ${business.dividends.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n**Funcionários:** ${business.employees.length.toLocaleString('pt-BR')}`)
				.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
				.setColor('GREEN');
			return interaction.reply({ embeds: [embed] });
		}
	},
};