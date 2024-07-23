// frontend/script.js
document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'mongodb://localhost:27017/meu-projeto'; 

    
    const registerForm = document.getElementById('register-form');
    const registerUsername = document.getElementById('register-username');
    const registerPassword = document.getElementById('register-password');

    
    const loginForm = document.getElementById('login-form');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');

    
    const productForm = document.getElementById('form-product');
    const productId = document.getElementById('product-id');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productSubmit = document.getElementById('submit-product');
    const productCancel = document.getElementById('cancel-product');
    const productList = document.getElementById('products');
    const productFormTitle = document.getElementById('product-form-title');
    const errorMessage = document.getElementById('error-message');

    
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = registerUsername.value;
        const password = registerPassword.value;
        fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert('Usuário registrado com sucesso!');
        })
        .catch(error => console.error('Erro ao registrar usuário:', error));
    });

   
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = loginUsername.value;
        const password = loginPassword.value;
        fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert('Login bem-sucedido! Token JWT recebido: ' + data.token);
           
            localStorage.setItem('token', data.token);
           
            fetchProducts();
        })
        .catch(error => console.error('Erro ao fazer login:', error));
    });

    
    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const name = productName.value;
        const price = productPrice.value;
        const method = productId.value ? 'PUT' : 'POST';
        const url = productId.value ? `${apiUrl}/products/${productId.value}` : `${apiUrl}/products`;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, price })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar/editar produto');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert('Produto salvo com sucesso!');
            resetProductForm();
            fetchProducts();
        })
        .catch(error => {
            console.error('Erro ao adicionar/editar produto:', error);
            errorMessage.textContent = 'Erro ao adicionar/editar produto';
        });
    });

   
    productCancel.addEventListener('click', function(event) {
        event.preventDefault();
        resetProductForm();
    });

    
    function resetProductForm() {
        productId.value = '';
        productName.value = '';
        productPrice.value = '';
        productFormTitle.textContent = 'Adicionar Produto';
        productSubmit.textContent = 'Adicionar Produto';
        errorMessage.textContent = '';
    }

    
    function fetchProducts() {
        const token = localStorage.getItem('token');
        fetch(`${apiUrl}/products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            renderProducts(data);
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
    }

    
    function renderProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${product.name}</strong> - R$ ${product.price}
                            <button onclick="editProduct('${product._id}', '${product.name}', '${product.price}')">Editar</button>
                            <button onclick="deleteProduct('${product._id}')">Excluir</button>`;
            productList.appendChild(li);
        });
    }

    // Função para editar produto
    window.editProduct = function(id, name, price) {
        productId.value = id;
        productName.value = name;
        productPrice.value = price;
        productFormTitle.textContent = 'Editar Produto';
        productSubmit.textContent = 'Salvar Alterações';
    };

    
    window.deleteProduct = function(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            const token = localStorage.getItem('token');
            fetch(`${apiUrl}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir produto');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                alert('Produto excluído com sucesso!');
                fetchProducts();
            })
            .catch(error => console.error('Erro ao excluir produto:', error));
        }
    };

});