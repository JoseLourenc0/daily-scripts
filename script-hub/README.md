
# ScriptHub

**ScriptHub** is a simple CLI tool for creating, managing, and executing custom scripts. With it, you can define specific commands to open folders in VSCode or execute other repetitive tasks directly from the terminal.

## Installation

### Requirements

- **Bun**: Make sure Bun is installed on your system. If not, you can install it by following the instructions [here](https://bun.sh/).

### Steps

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/script-hub.git
   cd script-hub
   ```

2. Install the dependencies:

   ```bash
   bun install
   ```

## Usage

### Create a New Script

To create a new script, run the command:

```bash
bun ./index.ts --create-new-script
```

or

```bash
bun ./index.ts -c
```

You will be prompted to provide:
- Script name
- Script description
- Initial text to be displayed when running the script
- Commands (paths or other commands) separated by commas

### Remove a Script

To remove an existing script by name, use:

```bash
bun ./index.ts --remove <script-name>
```

or

```bash
bun ./index.ts -r <script-name>
```

### List Available Scripts

To list all available scripts:

```bash
bun ./index.ts
```

### Execute a Script

To execute a specific script, use:

```bash
bun ./index.ts <script-name>
```

You will see the script's initial text and be able to choose which command to execute.

## Example

Here is an example of how to create and use a script:

1. Create a new script:

   ```bash
   bun ./index.ts --create-new-script
   ```

   Suppose you provide the following details:
   - Name: `open-vscode`
   - Description: `Open folders in VSCode`
   - Initial text: `Choose a folder to open in VSCode`
   - Commands: `code ~/Desktop/projects/custom/daily-scripts, code ~/Desktop/projects/custom`

2. List the scripts:

   ```bash
   bun ./index.ts
   ```

   This will display:
   ```
   Available scripts:
   - open-vscode: Open folders in VSCode
   ```

3. Execute the `open-vscode` script:

   ```bash
   bun ./index.ts open-vscode
   ```

   You will see the initial text `Choose a folder to open in VSCode` and be able to choose one of the commands to execute.

## Contribution

Feel free to contribute with improvements or new features to **ScriptHub**. Just open a PR or an issue in this repository.
