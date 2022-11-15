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
 * Handles the logic for the ssh CLI
 * @class SSH
 * @since 1.0.0
 */
export class SSH extends Commands {
    
    /**
     * fetches a list of SSH keys from users wpengine account (for cli)
     * @param {*} limit 
     * @returns
     * @since 1.1.0
     */
    getKeys = async () => {
        const data = await fetch(`https://api.wpengineapi.com/v1/ssh_keys`, {
            method: 'GET',
            headers: { 'Authorization': this.auth.authorization() },
        })
        const json = await data.json();
        const keys = json.results.map(data => {
            return {
                name: data.comment,
                value: data.uuid
            };
        })
        console.log(keys);
        return keys;    
    }

    /**
     * fetches a list of SSH keys from users wpengine account (separate command)
     * @param {*} limit 
     * @returns
     * @since 1.0.0
     */
     showKeys = async (limit) => {
        if (limit > 0) {
            const data = await fetch(`https://api.wpengineapi.com/v1/ssh_keys?limit=${limit}`, {
                method: 'GET',
                headers: { 'Authorization': this.auth.authorization() },
            })
            const json = await data.json();
            const keys = json.results.map(data => {
                return {
                    name: data.comment,
                    value: data.uuid
                };
            })
            console.log(keys);
            return keys;
        } else {
            const data = await fetch(`https://api.wpengineapi.com/v1/ssh_keys`, {
                method: 'GET',
                headers: { 'Authorization': this.auth.authorization() },
            })
            const json = await data.json();
            const keys = json.results.map(data => {
                return {
                    name: data.comment,
                    value: data.uuid
                };
            })
            console.log(keys);
        }
    
    }
    
    /**
     * Adds a public key to your wpengine.com account
     * @param {*} key
     * @since 1.1.0
     */
    addKey = async (key) => {
        const data = await fetch(`https://api.wpengineapi.com/v1/ssh_keys`, {
            method: 'POST',
            body: {
                'public_key': key
            },
            headers: { 
                'Authorization': this.auth.authorization,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        })
        const response = await data.json();
        console.log("Public SSH Key successfully added!", response);
    }

    /**
     * Removes a public key from your wpengine.com account
     * @param {*} key
     * @since 1.1.0
     */
    deleteKey = async (key) => {
        const data = await fetch(`https://api.wpengineapi.com/v1/ssh_keys/${key}`, {
            method: 'DELETE',
            headers: {
                'Authorization': this.auth.authorization(),
                'accept': 'application/json'
            }
        })
        console.log("Successfully deleted your public SSH key");
    }
    
    /**
     * Executes the ssh CLI.
     * @since 1.1.0
     */
    ssh = () => {
        this.getKeys().then(
            keys => {
                inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Choose a command',
                        name: 'commands',
                        choices: [
                            'add key',
                            'delete key'
                        ]
                    }
                ])
                .then((answersOne) => {
                    if (answersOne.commands === 'add key') {
                        inquirer
                        .prompt([
                            {
                                type: 'text',
                                message: 'Paste your public key',
                                name: 'public_key'
                            }
                        ])
                        .then((add) => {
                            this.addKey(add.public_key)
                        })
                        .catch((error) => {
                            if (error.isTtyError) {
                              // Prompt couldn't be rendered in the current environment
                            } else {
                              // Something else went wrong
                            }
                        });
                    } else if (answersOne.commands === 'delete key') {
                        inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'Choose a key',
                                name: 'ssh_key',
                                choices: keys
                            }
                        ])
                        .then((answersTwo) => {
                            inquirer
                            .prompt([
                                {
                                    type: 'confirm',
                                    message: 'Are you sure?',
                                    name: 'confirm'
                                }
                            ])
                            .then((deleteKey) => {
                                if(deleteKey.confirm) {
                                    this.deleteKey(answersTwo.ssh_key)
                                    console.log('Key deleted!')
                                } else {
                                    console.log('exiting')
                                }
                            })
                            .catch((error) => {
                                if (error.isTtyError) {
                                  // Prompt couldn't be rendered in the current environment
                                } else {
                                  // Something else went wrong
                                }
                            });
                        })
                        .catch((error) => {
                            if (error.isTtyError) {
                              // Prompt couldn't be rendered in the current environment
                            } else {
                              // Something else went wrong
                            }
                        });
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
    }
}
