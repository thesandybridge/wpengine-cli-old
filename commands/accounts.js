#! /usr/bin/env node
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
import inquirer from 'inquirer';
import Auth from '../auth/auth.js';

export default class Accounts {
    auth = new Auth()
    constructor() {}
    
    /**
     * fetch a list of accounts from the wpengine API
     * @returns 
     */
    listAccounts = async () => {
        const data = await fetch(`https://api.wpengineapi.com/v1/accounts`, {
            method: 'GET',
            headers: { 'Authorization': this.auth.authorization },
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
     * run inquirer to manage accounts CLI
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
