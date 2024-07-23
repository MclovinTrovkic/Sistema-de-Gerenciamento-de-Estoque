const { generateToken, comparePassword } = require('./authUtils');

// Exemplo e só isso
const token = generateToken({ userId: '123456' });
console.log('Token gerado:', token);


const hashedPassword = '$2a$10$jF0jgaE9NLvKpVhPwWt1a./gCg1O7WUB7bZ3pRA2AhaIfb9t1OgB6'; 
const senhaCorreta = 'Didi20022#';
const senhaIncorreta = 'senhaIncorreta';

comparePassword(senhaCorreta, hashedPassword)
    .then(isMatch => {
        if (isMatch) {
            console.log('Senha correta!');
        } else {
            console.log('Senha incorreta!');
        }
    })
    .catch(err => console.error(err));