/* eslint-disable max-nested-callbacks */
const { SlashCommandBuilder, ModalBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, ComponentType, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputStyle } = require('discord.js');
const mongoose = require('mongoose');
const UserModel = require('../../schemas/userSchema.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('registrar')
		.setDescription('Registre a sua própia empresa!'),
	async execute(interaction) {
		const doc = await UserModel.findOne({ id: interaction.user.id });
		if (doc) {
			return interaction.reply({ content: `${interaction.client.emoji.error} ${interaction.user} **|** Você já está registrado, atualmente só é possível criar uma empresa!` });
		}
		const empresa = {};
		const button = new ButtonBuilder()
			.setCustomId(`register;${interaction.user.id}`)
			.setStyle(ButtonStyle.Secondary)
			.setEmoji(interaction.client.emoji.receitafederal.replace(/</g, '').replace(/>/g, ''))
			.setLabel('Registrar Empresa');
		const row = new ActionRowBuilder()
			.addComponents(button);
		await interaction.reply({
			content: `${interaction.client.emoji.business} ${interaction.user} **|** Está pronto para abrir seu própio négocio na :sparkles: **Cidade Estrelada** :sparkles:? Então, clique no botão abaixo para registrar sua empresa!`,
			components: [row],
		}).then(async (msg) => {
			const collectorFilter = i => i.user.id === interaction.user.id;
			const collector = msg.createMessageComponentCollector({ filter: collectorFilter, componentType: ComponentType.Button, time: 3_600_000 });

			collector.on('collect', async i => {
				const bancos = [
					{
						name: 'Nubank',
						customId: 'nubank',
						description: 'Banco digital completo, investimentos, crédito.',
						emoji: interaction.client.emoji.bancos.nubank,
					},
					{
						name: 'Inter',
						customId: 'inter',
						description: 'Cartão, banco digital, inovação financeira.',
						emoji: interaction.client.emoji.bancos.inter,
					},
					{
						name: 'Banco do Brasil',
						customId: 'bb',
						description: 'Rede ampla, serviços variados, tradição.',
						emoji: interaction.client.emoji.bancos.brasil,
					},
					{
						name: 'Banco do Werdan',
						customId: 'werdan',
						description: 'Segurança, praticidade e agilidade.',
						emoji: interaction.client.emoji.bancos.werdan,
					},
				];
				const selectMenu = new StringSelectMenuBuilder()
					.setCustomId(`bank;${interaction.user.id}`)
					.setPlaceholder('Selecione um banco')
					.addOptions(
						new StringSelectMenuOptionBuilder()
							.setLabel(bancos[0].name)
							.setDescription(bancos[0].description)
							.setValue(bancos[0].customId)
							.setEmoji(bancos[0].emoji.replace(/</g, '').replace(/>/g, '')),
						new StringSelectMenuOptionBuilder()
							.setLabel(bancos[1].name)
							.setDescription(bancos[1].description)
							.setValue(bancos[1].customId)
							.setEmoji(bancos[1].emoji.replace(/</g, '').replace(/>/g, '')),
						new StringSelectMenuOptionBuilder()
							.setLabel(bancos[2].name)
							.setDescription(bancos[2].description)
							.setValue(bancos[2].customId)
							.setEmoji(bancos[2].emoji.replace(/</g, '').replace(/>/g, '')),
					);

				const row2 = new ActionRowBuilder()
					.addComponents(selectMenu);

				await i.update({
					content: `${interaction.client.emoji.business} ${interaction.user} **|** Selecione um banco para gerenciar sua empresa!`,
					components: [row2],
				}).then(async (msg2) => {
					const collector2 = msg2.createMessageComponentCollector({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 3_600_000 });
					collector2.on('collect', async i2 => {
						collector2.stop();
						const banco = i2.values[0];
						function encontrarBancoPorCustomId(customId) {
							return bancos.find(bank => bank.customId === customId);
						}
						const bancoEncontrado = encontrarBancoPorCustomId(banco);
						empresa.bank = banco;

						const modal = new ModalBuilder()
							.setCustomId(`register;${interaction.user.id}`)
							.setTitle('Registro de Empresa');

						const nameInput = new TextInputBuilder()
							.setCustomId('nameInput')
							.setLabel('Qual vai ser o nome da sua empresa?')
							.setPlaceholder('Ex: Werdan S.A.')
							.setStyle(TextInputStyle.Short);

						const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
						modal.addComponents(firstActionRow);

						await i2.showModal(modal);
						const filter = (i3) => i3.customId === `register;${interaction.user.id}`;
						i2.awaitModalSubmit({ filter, time: 3_600_000 }).then(async (i4) => {
							const name = i4.fields.fields.get('nameInput');
							empresa.startCapital = 10000;

							const selectMenu2 = new StringSelectMenuBuilder()
								.setCustomId(`type;${interaction.user.id}`)
								.setPlaceholder('Selecione o tipo da sua empresa')
								.addOptions(
									new StringSelectMenuOptionBuilder()
										.setLabel('Tecnologia')
										.setDescription('Empresas de tecnologia, como: desenvolvimento de software, hardware, etc.')
										.setValue('tech'),
									new StringSelectMenuOptionBuilder()
										.setLabel('Roupas')
										.setDescription('Empresas de roupas, como: lojas de roupas, fábricas de roupas, etc.')
										.setValue('clothes'),
									new StringSelectMenuOptionBuilder()
										.setLabel('Alimentos')
										.setDescription('Empresas de alimentos, como: restaurantes, lanchonetes, etc.')
										.setValue('food'),
								);
							const row3 = new ActionRowBuilder()
								.addComponents(selectMenu2);
							const embed = new EmbedBuilder()
								.setTitle(`${interaction.client.emoji.business} Registro de Empresa`)
								.setDescription(`**Nome:** ${name.value}\n**Banco:** ${bancoEncontrado.emoji} **${bancoEncontrado.name}**\n**Capital Inicial:** ${empresa.startCapital.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)
								.setColor('Purple')
								.setFooter({
									text: 'OBS: Nenhuma das informações acima é verdadeira, são todas gerados com base em um algoritmo para fins de simulação!',
									iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
								});
							await i4.update({ embeds: [embed], components: [row3], content: '' }).then(async (msg3) => {
								const collector3 = msg3.createMessageComponentCollector({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 3_600_000 });
								collector3.on('collect', async i5 => {
									function gerarCNPJ() {
										const n = () => Math.floor(Math.random() * 9);
										const block1 = `${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}`;
										const block2 = `0001-${n()}${n()}`;
										const cnpj = `${block1}/${block2}`;
										return cnpj;
									}
									const cnpj = gerarCNPJ();
									empresa.cnpj = cnpj;
									empresa.name = name.value;
									empresa.type = i5.values[0];
									const embed2 = new EmbedBuilder()
										.setTitle(`${interaction.client.emoji.business} Registro de Empresa`)
										.setDescription(`**Nome:** ${name.value}\n**Banco:** ${bancoEncontrado.emoji} **${bancoEncontrado.name}**\n**Capital Inicial:** ${empresa.startCapital.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n**CNPJ:** ${cnpj}`)
										.setColor('Purple')
										.setFooter({
											text: 'OBS: Nenhuma das informações acima é verdadeira, são todas gerados com base em um algoritmo para fins de simulação!',
											iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
										});
									await i5.update({ embeds: [embed2], components: [], content: '' }).then(async () => {
										const userDoc = new UserModel({
											_id: new mongoose.Types.ObjectId(),
											username: interaction.user.username,
											tag: interaction.user.tag,
											id: interaction.user.id,
											date: Date.now(),
											businesses: [
												{
													name: empresa.name,
													cnpj: empresa.cnpj,
													type: empresa.type,
													creationDate: Date.now(),
													employees: [],
													totalIncome: empresa.startCapital,
													dividends: 0,
													bank: bancoEncontrado.name,
												},
											],
										});
										await userDoc.save();
										await i5.followUp({ content: `${interaction.client.emoji.check} ${interaction.user} **|** Empresa registrada com sucesso!` });
									});
								});
							});
						});
					});
				});
			});
		});
	},
};