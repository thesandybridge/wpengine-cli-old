#! /usr/bin/env node
/**
 * @package WPE CLI
 * @author thesbx
 * @license MIT
 *
 */

import fetch from 'node-fetch';
import inquirer from 'inquirer';
import {Commands} from '../commands/commands.js';

/**
 * Handles the logic for the accounts CLI
 * @class Accounts
 * @since 1.0.0
 */
export class Accounts extends Commands {
    
    /**
     * fetch a list of accounts from the wpengine API
     * @returns
     * @since 1.0.0
     */
    listAccounts = async () => {
        const data = await fetch(`https://api.wpengineapi.com/v1/accounts`, {
            method: 'GET',
            headers: { 'Authorization': this.auth.authorization() },
        })
        const json = await data.json();
        const accounts = json.results.map(data => {
            return {
                name: data.name,
                value: data.id
            };
        })
        return accounts;
    }
    
    /**
     * Executes the accounts CLI
     * @since 1.0.0
     */
    accounts = () => {
        this.listAccounts().then(
            accounts => {
                inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Choose an account',
                        name: 'account',
                        choices: accounts
                    }
                ])
                .then((answers) => {
                    console.log(answers.account);
                })
                .catch((error) => {
                    if (error.isTtyError) {
                      // Prompt couldn't be rendered in the current environment
                    } else {
                      // Something else went wrong
                    }
                });      
            }
        )
     }
}
