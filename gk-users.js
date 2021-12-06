#! /usr/bin/env node
const { program } = require('commander')
const chalk = require('chalk');

program
    .command('add', 'add users').alias('a')
    
program
    .command('list', 'create a .csv of users').alias('l') 

program.action(() => {
    program.help()
})

program.addHelpText('after', `
Description:
List will generate a .csv of all users matching specifc arguments.

Example usage:
${chalk.green('grafik users add')}
${chalk.green('grafik users list')}
`)

program.parse(process.argv)
