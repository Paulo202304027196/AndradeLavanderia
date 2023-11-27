const myApiUrl = 'http://localhost:8080';


async function fazerLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;

    const response = await fetch(myApiUrl + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        console.error('Erro ao fazer login');
        return;
    }else{
        const token = await response.text();
        console.log('Token:', token);
        // Armazenar o token (por exemplo, em localStorage)
        localStorage.setItem('token', token);
        getName(token);
        getID(token);
        // Redirecionar para a página index.html
        window.location.href = 'index.html';
    }

    
}


// Função para obter o nome do usuário do servidor
async function getName(token) {
    try {

        // Verificar se o token está presente
        if (!token) {
            console.error('O usuário não está autenticado.');
            return;
        }

        const response = await fetch(myApiUrl + '/auth/get-name', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        });

        if (!response.ok) {
            console.error('Erro ao obter o nome do usuário');
            return;
        }

        const name = await response.text();
        console.log('Nome do usuário:', name);

        // Armazenar o nome no localStorage
        localStorage.setItem('name', name);
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

// Função para obter o id do usuario do servidor
function getID(token) {
    try {
        // Verificar se o token está presente
        if (!token) {
            console.error('O usuário não está autenticado.');
            return Promise.reject(new Error('O usuário não está autenticado.'));
        }

        return fetch(myApiUrl + '/auth/get-id', {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error(`Erro ao obter o ID do usuário: ${response.status}`);
                return Promise.reject(new Error(`Erro ao obter o ID do usuário: ${response.status}`));
            }

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                // Se o tipo de conteúdo for JSON, provavelmente é o ID
                return response.json();
            } else {
                // Se não for JSON, trata como uma mensagem de texto
                return response.text();
            }
        })
        .then(data => {
            console.log('ID do usuário:', data);
            localStorage.setItem('id', data);
            return data;
        })
        .catch(error => {
            console.error('Erro:', error.message);
            return Promise.reject(error);
        });
    } catch (error) {
        console.error('Erro:', error.message);
        return Promise.reject(error);
    }
}
