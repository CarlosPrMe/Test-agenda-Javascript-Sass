
let contacts = [];
let colorsList = [
    '#d0021b',
    '#02b4d0',
    '#5502d0',
    '#024bd0',
    '#c702d0',
    '#02d0ab',
    '#47d002',
    '#c9d002',
    '#d09202'
];

let init = function init() {

    let menu = document.getElementById('edition-menu');
    let closeMenu = document.getElementById('close-menu');
    let add = document.querySelector('#show');
    let editBtn = document.getElementById('editBtn');
    let btnUpdate = document.getElementById('update');
    let list = document.getElementById('list');
    let mainList = document.getElementsByClassName('main-list')[0];
    let currentGroup = [];
    let currentUser = {};
    let userPlaceholder = {
        name: 'nuevo',
        surname: 'contacto',
        group: 'grupo',
        email: 'email@email.com',
        phone: '+34 555 55 55',
        country: 'españa'
    }

    let initialUser = document.getElementById('initial-user');

    //----------------------
    let radioAll = document.getElementById('all');
    let radioFavourites = document.getElementById('favoritos');
    let radioFamily = document.getElementById('familia');
    let radioFriends = document.getElementById('amigos');
    let radioWork = document.getElementById('trabajo');

    //-------------------------
    let initial = document.querySelector('#initial-user');
    let name = document.querySelector('#name-user');
    let group = document.querySelector('#group-user');
    let email = document.querySelector('#email-user');
    let phone = document.querySelector('#phone-user');

    //-------------------------
    let btnAddUser = document.getElementById('add');
    let nameForm = document.querySelector('#name');
    let surnameForm = document.querySelector('#surname');
    let emailForm = document.querySelector('#email');
    let phoneForm = document.querySelector('#phone');
    let countryForm = document.querySelector('#country');
    let groupForm = document.querySelector('#group');

    //-------------TEST CON MOCKAPI---------------------

    const url = 'https://5cff86eed691540014b0dd73.mockapi.io/users'

    function getUsers(user) {
        fetch(url).then(res => res.json().then(res => {
            currentGroup = res;
            contacts = currentGroup;
            if (user) {
                paintContacs(filterByGroup(user.group.toLowerCase(), res))
            } else {
                paintContacs(res);
            }
            return res
        }));
    }

    function deleteById(id) {
        fetch(`${url}/${id}`, { method: 'DELETE' }).then(res => res.json().then(() => {
        })).then(() => {
            getUsers()
        }).then(() => {
            currentGroup = contacts;
            currentUser = {}
            initialUser.style.backgroundColor = randomColor(colorsList);
            paintData(userPlaceholder);
            editBtn.classList.add('hide')
            radioAll.checked = true;
        })
    }

    function createUser(user) {
        fetch(url, {
            method: 'POST', body: JSON.stringify(user), headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json().then(res => {
            console.log(res);
        })).then(() => {
            getUsers(user)
        }).then(() => {
            initialUser.style.backgroundColor = randomColor(colorsList);
            selectRadio(user);
        })
    }

    function updateUser(user) {
        fetch(`${url}/${user.id}`, { method: 'PUT', body: JSON.stringify(user), headers: { 'Content-Type': 'application/json' } })
            .then(res => res.json().then(() => {
                getUsers(user)
            }).then(() => {
                initialUser.style.backgroundColor = randomColor(colorsList);
                selectRadio(user)
            }))
    }

    //-----Transiciones--------------

    closeMenu.addEventListener('click', () => {
        menu.classList.remove('show-menu');
        editBtn.classList.remove('hide');
        resetForm();
    })


    add.addEventListener('click', () => {
        editBtn.classList.add('hide');
        menu.classList.add('show-menu');
        btnUpdate.classList.add('hide');
        resetForm();

    });


    editBtn.addEventListener('click', () => {
        editBtn.classList.add('hide');
        menu.classList.add('show-menu');
        btnUpdate.classList.add('show');
        btnAddUser.classList.add('hide');
    })



    //--------Añadir usuario------------

    btnAddUser.addEventListener('click', () => {
        let newUser = {}
        newUser.name = nameForm.value;
        newUser.surname = surnameForm.value;
        newUser.email = emailForm.value;
        newUser.phone = phoneForm.value;
        newUser.country = countryForm.value;
        newUser.group = groupForm.value;
        currentUser = newUser;
        createUser(currentUser)
        paintContacs(filterByGroup(groupForm.value.toLowerCase(), contacts));
        paintData(newUser);
        menu.classList.remove('show-menu');
        editBtn.classList.remove('hide');
    })


    //----Editar usuario--------

    editBtn.addEventListener('click', (e) => {
        if (currentUser.name) {
            console.log(currentUser);
            initialUser.style.backgroundColor = randomColor(colorsList);
            nameForm.value = currentUser.name;
            surnameForm.value = currentUser.surname;
            emailForm.value = currentUser.email;
            phoneForm.value = currentUser.phone;
            countryForm.value = currentUser.country;
            groupForm.value = currentUser.group;
        }
    })

    btnUpdate.addEventListener('click', () => {
        let newUser = { ...currentUser };
        newUser.name = nameForm.value;
        newUser.surname = surnameForm.value;
        newUser.email = emailForm.value
        newUser.phone = phoneForm.value
        newUser.country = countryForm.value
        newUser.group = groupForm.value
        updateUser(newUser)
        currentUser = newUser
        paintData(currentUser);
        menu.classList.remove('show-menu');
        editBtn.classList.remove('hide');
    })

    //---Selecionar un contacto y eliminar------

    editBtn.classList.add('hide');
    radioAll.setAttribute('checked', true);
    list.addEventListener('click', (e) => {
        editBtn.classList.remove('hide');
        if (e.target.className !== "btn btn--delete") {
            let userName = e.target.childNodes[0].data
            currentUser = getUser(userName, currentGroup)
            if (currentUser !== -1) {
                initialUser.style.backgroundColor = randomColor(colorsList);
                paintData(currentUser)
            } else {
                return alert('Usuario no encontrado');
            }
        } else if (e.target.className === "btn btn--delete") {
            let userId = e.target.attributes.userid.value;
            currentUser = getUser(userId, currentGroup);
            let confirm = window.confirm(`Seguro que quieres eliminar a ${currentUser.name} ${currentUser.surname}?`);
            if (confirm) {
                deleteById(userId)
            }
        }
    });


    //------Pintar los grupos-------

    function paintContacs(array) {
        clear_list();
        array = sortList(array);
        for (let i = 0; i < array.length; i++) {
            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            btn.setAttribute('id', `${array[i].name} ${array[i].surname}`);
            btn.setAttribute('userId', `${array[i].id}`);
            btn.textContent = 'X';
            btn.classList.add('btn', 'btn--delete');
            let li = document.createElement('li');
            li.classList.add('list__item');
            li.textContent = `${array[i].name} ${array[i].surname}`;
            li.appendChild(btn);
            list.appendChild(li);
        }
    }

    //---Inicializacion-------
    getUsers();
    paintData(userPlaceholder);
    initialUser.style.backgroundColor = randomColor(colorsList);
    
    //------------------------
    mainList.addEventListener('click', (event) => {
        if (event.target.localName === 'label') {
            paintContacs(filterByGroup(event.target.innerText.toLowerCase(), contacts))
        }

    })


    //------Buscador-------------

    let search = document.querySelector('#search');
    search.addEventListener('keyup', (e) => {
        let searching = buscadorPredictivo(search.value);
        let userFound = contacts.find(user => user.name === searching || user.name === searching.split(' ')[0] && user.surname === searching.split(' ')[1])
        if (userFound) {
            currentUser = userFound;
            paintData(currentUser);
            editBtn.classList.remove('hide');
            search.value = '';
            initialUser.style.backgroundColor = randomColor(colorsList);
            paintContacs(filterByGroup(currentUser.group.toLowerCase(), contacts))
            selectRadio(userFound);
        }
    })

    //-----Funciones----------------

    function filterByGroup(filtro, array) {
        currentGroup = []
        if (filtro !== 'todos los contactos') {
            let filtrado = array.filter(contact => contact.group === filtro);
            currentGroup = sortList(filtrado)
            return sortList(filtrado);
        } else if (filtro === 'todos los contactos' || filtro === "") {
            currentGroup = sortList(array);
            return sortList(array);
        }
    }

    function clear_list() {
        list.innerHTML = '';
    }

    function getUser(user, array) {
        if (array.length === 0) {
            array = contacts;
        }
        let name = user.split(' ')[0];
        let surname = user.split(' ')[1];
        let userFound = array.find(u => u.id === user || u.name === name && u.surname === surname)
        return userFound
    }

    function clearData() {
        initial.textContent = '';
        name.textContent = '';
        group.textContent = '';
        email.textContent = '';
        phone.textContent = '';
    }

    function paintData(user) {
        clearData();
        initial.textContent = getInitial(user.name);
        name.textContent = `${user.name} ${user.surname}`;
        group.textContent = user.group;
        email.textContent = user.email;
        phone.textContent = user.phone;
    }

    function getInitial(name) {
        return name.split('')[0];
    }

    function sortList(group) {
        group.sort((a, b) => {
            if (a.name > b.name) {
                return 1
            } else if (a.name < b.name) {
                return -1
            } else if (a.name === b.name) {
                if (a.surname > b.surname) {
                    return 1
                } else if (a.surname < b.surname) {
                    return -1
                }
            }
        })
        return group;
    }

    function resetForm() {
        nameForm.value = '';
        surnameForm.value = '';
        emailForm.value = '';
        phoneForm.value = '';
        countryForm.value = '';
        groupForm.value = '';
    }

    function selectRadio(user) {
        if (user.group === 'favoritos') {
            radioFavourites.setAttribute('checked', true);
        } else if (user.group === 'familia') {
            radioFamily.setAttribute('checked', true)
        } else if (user.group === 'trabajo') {
            radioWork.setAttribute('checked', true)
        } else if (user.group === 'amigos') {
            radioFriends.setAttribute('checked', true)
        }
    }

    function buscadorPredictivo(user) {
        let joinName = '';
        let joinSurname = '';
        let complete = '';
        if (user.length > 1) {
            let name = user.substring(1);
            let initial = user[0].toUpperCase();
            joinName = initial + name;
            complete = joinName;
            if (joinName.indexOf(" ") > -1) {
                let nameOk = joinName.split(' ')[0];
                let surname = joinName.split(' ')[1];
                if (surname.length > 1) {
                    let surnameCut = surname.substring(1)
                    let initialSurname = surname[0].toUpperCase();
                    joinSurname = initialSurname + surnameCut;
                    complete = nameOk + ' ' + joinSurname;
                }
            }
        }
        return complete
    }

    function randomColor(arrayColors) {
        let num = randomNumber(0, arrayColors.length);
        return arrayColors[num];
    }

    function randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}


window.onload = init;