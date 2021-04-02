const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const command = require('./command')
const welcome = require('./welcome')
const Gamedig = require('gamedig');
const status = require('./status')

client.on('ready', () =>{
    console.log('Arcadian Interface V2 Online')

    welcome(client)

    command(client, 'serverinfo', (message) => {
        message.channel.send(`TS: 173.234.27.145:10070
ARMA: 172.96.164.74 Port: 2307 Password: ADG1 `)
    })
    command(client, 'mods', (message) => {
        message.reply(`https://steamcommunity.com/sharedfiles/filedetails/?id=2441399369`)
    })


    command(client, ['cc', 'clearchannel'], (message) => {
        if(message.member.hasPermission('ADMINISTRATOR')){
            message.channel.messages.fetch().then(results =>{
                message.channel.bulkDelete(results)
            })
        }
    })

    command(client, 'activity', (message) => {
        const content = message.content.replace('#status ', '')
    
        client.user.setPresence({
          activity: {
            name: content,
            type: 0,
          },
        })
    })

    command(client, 'help', (message) => {
        message.channel.send(`Available Commands:
**#serverinfo** - Gives TS3 and ARMA Server Details
**#mods** - Gives a list of mods
**#help** - Opens this menu
**#status** - Shows Server Status`)

    }) 
    command(client, 'status', (message) =>{
        const { serverType, serverHost, serverPort } = require('./config.json');
        message.channel.send('Server Status:'); {
            Gamedig.query({
                type: serverType,
                host: serverHost,
                port: serverPort,
                requestRules: true,
            }).then((state) => {
                console.log(state);
                const serverDetailsEmbed = new Discord.MessageEmbed()
                    .setColor('#34bb00')
                    .setTitle('Arcadian Main Server')
                    .setDescription('steam://connect/' + serverHost + ':' + serverPort)
                    .setThumbnail('https://media.discordapp.net/attachments/823773590377725962/825001690376699945/image0.jpg?width=664&height=661')
                    .addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Status', value: 'Online', inline: false },
                        { name: 'Name', value: state.name, inline: true },
                        { name: 'Map', value: state.map, inline: true },
                        { name: 'Mission', value: state.raw.game, inline: true },
                        { name: 'Players', value: state.raw.numplayers + '/' + state.maxplayers, inline: true },
                    )
                    .setTimestamp();
                message.channel.send(serverDetailsEmbed);
            }).catch((error) => {
                console.log('Server is offline');
                const serverDetailsEmbed = new Discord.MessageEmbed()
    
                    .setColor('#df0000')
                    .setTitle('Arcadian Main Server')
                    .setDescription('steam://connect/' + serverHost + ':' + serverPort)
                    .addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Status', value: 'Offline', inline: false },
                    )
                    .setTimestamp();
    
                message.channel.send(serverDetailsEmbed);
            });
        }
    })
})

client.login(config.token)