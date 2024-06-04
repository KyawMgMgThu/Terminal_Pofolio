const font = 'Slant';

figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const directories = {
    introduction:[
        '',
        '* <white>I am a <b>Web Developer</b> based in Myanmar, currently focused on learning full-stack web development.</white>',
        '* <white> I am particularly involved in mastering PHP, Laravel, React and Vue</white>'
    ],
    certification: [
        '',
        '<white>certifications</white>',

        '* <red>CODE LAB</red> Full Stack Web Developer <white></white>',
        '* <red>ICT Group</red> Junior Web Developer (OJT)<white> Position - Backend Developer</white>',
        '* <red>Edx</red> CS50 Cetification<white></white>'
    ],
    education: [
        '',
        '<white>education</white>',

        '* <white>High School -</white>  Kan Zun Ahin Private School,Myeik <yellow>"Since => 2015-2022"</yellow> ',
        '* <white>University -</white> <a href="https://www.ucsmyeik.edu.mm/">Computer University(Myeik)</a> <yellow>"Since => 2022-Now"</yellow>',
        ''
    ],
    experience: [
        '',
        '<blue>Blue team</blue> experience through learning path on TryHackMe platform',
        [
            ['SOC level 1','https://tryhackme.com/path/outline/soclevel1','learn the junior security analyst role'],
            ['SOC level 2','https://tryhackme.com/path/outline/soclevel2', 'learn the skill to transition to level 2 SOC position'],
            ['Security Engineer','https://tryhackme.com/path/outline/security-engineer-training', 'Introduction to security engineering from various perspectives'],
            ['Cyber Defense','https://tryhackme.com/path/outline/blueteam', 'Broad introduction to the different areas necessary to detect and respond to threats'],
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),
         '',
        '<red>Red team</red> experience through learning path on TryHackMe platform',
        [
            ['ICT Group','#','Junior Backend Developer (OJT)'],
            ['Digital Menu','http://18.143.191.57/'],
            ['Mini POS System','#'],
            ['CMS Project','#'],
            ['Ecommerce Project', '#'],
            ['etc'],
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),

    ].flat(),
    skills: [
        '',
        '<white>skills</white>',

        [
            'C++',
            'Java',
            'JavaScript & JQuery',
            'PHP',
            'Bootstrap framework',
            'Laravel framework',
            'React framework',
            'Vue framework',
            'MySql',
            'React Native (Just Learning)',
            'AWS Cloud Computing (Just Learning)',
            
        ].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>softwares</white>',
        [
            'Windows Defender',
            'Linux',
            
        ].map(lib => `* <green>${lib}</green>`),
        '',
         '<white>tools</white>',
        [
            'git',
            'GNU/Linux'
        ].map(lib => `* <blue>${lib}</blue>`),
        '' 
    ].flat(),
    reference:[
        '',
        '* <white>Reference by <a href="https://www.freecodecamp.org"><yellow>freeCodeCamp</yellow></a></white>',
    ],
};

const dirs = Object.keys(directories);

const root = '~';
let cwd = root;

const user = 'kyawmgmgthu';
const server = '';

function prompt() {
    return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

function print_dirs() {
     term.echo(dirs.map(dir => {
         return `<blue class="directory">${dir}</blue>`;
     }).join('\n'));
}

const commands = {
    help() {
        term.echo(`List of available commands: ${help}`);
    },
    ls(dir = null) {
        if (dir) {
            if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_dirs();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
           print_dirs();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    echo(...args) {
        if (args.length > 0) {
            term.echo(args.join(' '));
        }
    }
};

const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => `<white class="command">${cmd}</white>`);
const help = formatter.format(formatted_list);

const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);

$.terminal.new_formatter([re, function(_, command, args) {
    return `<white class="command">${command}</white><aquamarine>${args}</aquamarine>`;
}]);

$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#55F;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.green = (attrs) => {
    return `[[;#44D544;]`;
};

const term = $('body').terminal(commands, {
    greetings: function generateGreetings()  {
        let date = new Date();
        let hour = date.getHours();
        let greetingMessage = "";

        if (hour < 12) {
            greetingMessage = "Good morning!";
        } else if (hour < 18) {
            greetingMessage = "Good afternoon!";
        } else {
            greetingMessage = "Good evening!";
        }

        return greetingMessage + "                      Welcome to the Terminal!            type  \"ls\" to start";
    },
    checkArity: false,
    completion(string) {
        // in every function we can use this to reference term object
        const { name, rest } = $.terminal.parse_command(this.get_command());
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return dirs.map(dir => `~/${dir}`);
            }
            if (cwd === root) {
                return dirs;
            }
        }
        return Object.keys(commands);
    },
    prompt
});

term.pause();

term.on('click', '.command', function() {
   const command = $(this).text();
   term.exec(command, { typing: true, delay: 50 });
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`, { typing: true, delay: 50 });
});

function ready() {
   const seed = rand(256);
   term.echo(() => rainbow(render('My name is Kyaw Mg Mg Thu \n Welcome to my Terminal Resume'), seed)).resume();
}

function rainbow(string, seed) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string, seed).join('\n');
}

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function render(text) {
    const cols = term.cols();
    return trim(figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    }));
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}



    


