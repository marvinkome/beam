import * as shell from 'shelljs'

shell.mkdir('dist/src/libs/emails/templates')
shell.cp('-R', 'src/libs/emails/templates', 'dist/src/libs/emails/')

shell.mkdir('-p', 'dist/src/public/images')
shell.cp('-R', 'src/public/images', 'dist/src/public')
