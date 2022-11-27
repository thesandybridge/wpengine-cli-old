# wpengine CLI | Early Access

**DEPRECATED** This project is no longer maintained. Please use [wpengine_v2](https://github.com/method-devs/wpengine_cli_v2). We have rebuilt the CLI from the ground up to be more robust and easier to use with Rust.

This tool is still in development, feel free to fork and extend for your own needs. I plan on adding complete functionality to interface with the wpengine API. Once that is complete I will extend the functionality.

- [wpengine CLI | Early Access](#wpengine-cli--early-access)
  - [Installation](#installation)
    - [Manual installation](#manual-installation)
  - [Authentication](#authentication)
  - [Sites](#sites)
  - [Installs](#installs)
  - [Accounts](#accounts)
  - [Users](#users)
  - [Roadmap](#roadmap)
  - [Notes](#notes)

## Installation

### Manual installation

1. Clone this repository
2. `cd wpengine-cli`
3. `npm install` -- installs dependencies
4. `npm install -g` -- allows use of `wpe` command globally

## Authentication

Command: `wpe auth`

1. make sure API is enabled on your WP Engine account
2. grab the API username and Password
3. ```wpe auth``` will bring up a prompt to add credentials
4. you will need to have an ssh key added in order to use some features
   - you can optionally set the ssh path
   - `wpe users list` will not run without a valid key

## Sites

Command: `wpe sites`

Description: The ```sites``` command provides an interface for various WP Engine site tasks

1. [x] add sites
2. [x] list sites
3. [x] list site by ID
4. [ ] update sites -- **coming soon**
5. [ ] delete sites -- **coming soon**
6. [ ] list wp users -- **coming soon**
7. [ ] convert to rust app

## Installs

Command: `wpe installs`

Description: The ```installs``` command allows you to manage the WordPress installs in your accounts.

You can view installs for specific sites or a verbose list.

## Accounts

Command: `wpe accounts`

Description: Interact with wpengine accounts

You can list the accounts you are associated with by using the ```accounts``` command.

## Users

Command: `wpe users options`

Options: `list` & `add`

Description: Interfaces with wpengine installs using the WordPress CLI.

Example Usage: You can get a list of users on all of your installs.

## Roadmap

- [ ] add bulk edit options. This could include options for updating WordPress users using wordpress cli.
- [ ] finish API integration.

## Notes

- The users CLI will write a .csv file to your OS home directory
