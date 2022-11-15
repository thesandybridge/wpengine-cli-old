#! /usr/bin/env node
/**
 * @package WPE CLI
 * @author thesbx
 * @license MIT
 *
 */

import fetch from 'node-fetch';
import {Commands} from '../commands/commands.js';

/**
 * Handles the logic for the installs CLI
 * @class Installs
 * @since 1.0.0
 */
export class Installs extends Commands {
    
    /**
     * Fetches a list of WordPress installs in users wpengine accounts.
     * @returns Object
     * @since 1.0.0
     */
    listInstalls = async () => {
        const data = await fetch(`https://api.wpengineapi.com/v1/installs`, {
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
    
    newInstall = async () => {
    
    }
    
    installs = () => {
        // Add prompts here
    }
}
