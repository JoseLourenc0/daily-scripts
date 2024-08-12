import fs from 'fs';
import inquirer from 'inquirer';
import { Command } from 'commander';
import path from 'path';
import { exec } from 'child_process';

const program = new Command();
const actionsFilePath = path.resolve(__dirname, 'actions.json');

program
  .option('-c, --create-new-script', 'Create a new script')
  .option('-r, --remove <name>', 'Remove a script by name');

program.parse(process.argv);

const options = program.opts();
const scriptName = program.args[0];

if (options.createNewScript) {
  createNewScript();
} else if (options.remove) {
  removeScript(options.remove);
} else if (scriptName) {
  executeScript(scriptName);
} else {
  listScripts();
}

async function createNewScript() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Script name:',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Script description:',
    },
    {
      type: 'input',
      name: 'initialText',
      message: 'Initial text to display:',
    },
    {
      type: 'input',
      name: 'options',
      message: 'Enter commands separated by commas:',
      filter: (input) => input.split(',').map((s: string) => s.trim()),
    },
  ]);

  const script = {
    name: answers.name,
    description: answers.description,
    'initial-text': answers.initialText,
    options: answers.options,
  };

  saveScript(script);
}

function saveScript(script: any) {
  let scripts = [];

  if (fs.existsSync(actionsFilePath)) {
    const fileContent = fs.readFileSync(actionsFilePath, 'utf-8');
    scripts = JSON.parse(fileContent);
  }

  scripts.push(script);

  fs.writeFileSync(actionsFilePath, JSON.stringify(scripts, null, 2));
  console.log(`Script ${script.name} saved successfully.`);
}

function removeScript(name: string) {
  if (!fs.existsSync(actionsFilePath)) {
    console.log('No scripts found.');
    return;
  }

  const fileContent = fs.readFileSync(actionsFilePath, 'utf-8');
  const scripts = JSON.parse(fileContent);

  const updatedScripts = scripts.filter((script: any) => script.name !== name);

  if (updatedScripts.length === scripts.length) {
    console.log(`Script ${name} not found.`);
  } else {
    fs.writeFileSync(actionsFilePath, JSON.stringify(updatedScripts, null, 2));
    console.log(`Script ${name} removed successfully.`);
  }
}

function listScripts() {
  if (!fs.existsSync(actionsFilePath)) {
    console.log('No scripts available.');
    return;
  }

  const fileContent = fs.readFileSync(actionsFilePath, 'utf-8');
  const scripts = JSON.parse(fileContent);

  if (scripts.length === 0) {
    console.log('No scripts available.');
  } else {
    console.log('Available scripts:');
    scripts.forEach((script: any) => {
      console.log(`- ${script.name}: ${script.description}`);
    });
  }
}

async function executeScript(name: string) {
  if (!fs.existsSync(actionsFilePath)) {
    console.log('No scripts found.');
    return;
  }

  const fileContent = fs.readFileSync(actionsFilePath, 'utf-8');
  const scripts = JSON.parse(fileContent);
  const script = scripts.find((script: any) => script.name === name);

  if (!script) {
    console.log(`Script ${name} not found.`);
    return;
  }

  console.log(script['initial-text']);
  const { option } = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Choose an option to execute:',
      choices: script.options,
    },
  ]);

  exec(option, (error, stdout, stderr) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Output: ${stdout}`);
  });
}
