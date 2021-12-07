#! /usr/bin/env node
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
import inquirer from 'inquirer';
import Auth from '../auth/auth.js';
import Accounts from '../commands/accounts.js';
import chalk from 'chalk';

export default class Sites {
    auth = new Auth()
    accounts = new Accounts()
    constructor() {}
    
    getSites = async (limit) => {
        if (limit < 1) {
            const data = await fetch(`https://api.wpengineapi.com/v1/sites`, {
                method: 'GET',
                headers: { 'Authorization': this.auth.authorization },
            })
            const json = await data.json();
        
            const sites = json.results.map(data => {
                return {
                    name: data.name,
                    value: data.id
                };
            })
            return sites;   
        } else {
            const data = await fetch(`https://api.wpengineapi.com/v1/sites?limit=${limit}`, {
                method: 'GET',
                headers: { 'Authorization': this.auth.authorization },
            })
            const json = await data.json();
            
            const sites = json.results.map(data => {
                return {
                    name: data.name,
                    value: data.id
                };
            })
            return sites;
        } 
        console.log('something went wrong')
    }
    
    
    
    
    getSiteById = async (id) => {
        const data = await fetch(`https://api.wpengineapi.com/v1/sites/${id}`, {
            method: 'GET',
            headers: { 'Authorization': this.auth.authorization },
        })
        const json = await data.json();
        return json;
    }
    
    addSite = async (body) => {
        const response = await fetch(`https://api.wpengineapi.com/v1/sites`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 
                'Authorization': this.auth.authorization,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
        })
        const data = await response.json();
        console.log("Site successfully created!", data);
    }
    
    updateSite(id, {options}) {
    
    }
    
    deleteSite(id) {
    
    }
    
    
    sites = () => {
        if (this.auth.authenticated()) {
            inquirer
            .prompt([
                {
                    type: 'list',
                    message: chalk.blue('Select an action'),
                    name: 'actions',
                    choices: [
                        'add site',
                        'show all',
                        'get by ID',
                        'update site',
                        'delete site'
                    ]
                }
            ])
            .then((answers) => {
                if (answers.actions === 'show all') {
                    inquirer
                    .prompt([
                        {
                            type: 'number',
                            message: chalk.blue('How many sites would you like to list'),
                            name: 'siteLimit',
                            default: 100
                        }
                    ])
                    .then((limit) => {
                        this.getSites(limit.siteLimit).then(
                            data => {
                                inquirer
                                .prompt([
                                        {
                                            type: 'list',
                                            message: chalk.blue('Select a site'),
                                            name: 'siteList',
                                            choices: data
                                        }
                                    ])
                                    .then((siteId) => {
                                        this.getSiteById(siteId.siteList).then(
                                            data => {
                                                inquirer
                                                .prompt([
                                                    {
                                                        type: 'list',
                                                        message: chalk.blue('Select a site'),
                                                        name: 'options',
                                                        choices: [
                                                            "View installs",
                                                            "Edit site",
                                                            "Delete site"
                                                        ]
                                                    }
                                                ])
                                                .then((siteId) => {
                                                    if (siteId.options[0]) {
                                                        console.log(data.installs);
                                                    } else if (siteId.options[1]) {
                                                        // Edit site
                                                    } else if (siteId.options[2]) {
                                                        // Remove site
                                                    }
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
                    })
                    .catch((error) => {
                        if (error.isTtyError) {
                          // Prompt couldn't be rendered in the current environment
                        } else {
                          // Something else went wrong
                        }
                    });
                } else if (answers.actions === 'get by ID') {
                    inquirer
                    .prompt([
                            {
                                type: 'input',
                                message: chalk.blue('Enter the sites unique ID'),
                                name: 'site_by_id'
                            }
                        ])
                        .then((id) => {
                            this.getSiteById(id.site_by_id).then(
                                data => {
                                    console.log(data);
                                }
                            )
                        })
                        .catch((error) => {
                            if (error.isTtyError) {
                              // Prompt couldn't be rendered in the current environment
                            } else {
                              // Something else went wrong
                            }
                        });
                } else if (answers.actions === 'add site') {
                    this.accounts.listAccounts().then(
                        accounts => {
                            inquirer
                            .prompt([
                                {
                                    type: 'list',
                                    message: chalk.blue('Choose an account'),
                                    name: 'accountId',
                                    choices: accounts
                                },
                                {
                                    type: 'input',
                                    name: 'siteName',
                                    message: chalk.blue('Enter a site name'),
                                    validate(value) {
                                        const pass = value.match(
                                          /([\w\-\s]*)/g
                                        );
                                        if (pass) {
                                          return true;
                                        }
                                    
                                        return 'Please enter a valid name';
                                    },
                                }
                            ])
                            .then((answers) => {
                                this.addSite(
                                    {
                                        name: answers.siteName, 
                                        account_id: answers.accountId
                                    }
                                )
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
            })
        } else {
            console.log(chalk.bgRedBright("Please authenticate first"));
            this.auth.signin();
        }
        
    }
}
