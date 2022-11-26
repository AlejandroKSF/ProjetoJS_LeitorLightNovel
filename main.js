'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_lightNovel')) ?? []
const setLocalStorage = (dblightNovel) => localStorage.setItem("db_lightNovel", JSON.stringify(dblightNovel))

// CRUD - create read update delete
const deletelightNovel = (index) => {
    const dblightNovel = readlightNovel()
    dblightNovel.splice(index, 1)
    setLocalStorage(dblightNovel)
}

const updatelightNovel = (index, lightNovel) => {
    const dblightNovel = readlightNovel()
    dblightNovel[index] = lightNovel
    setLocalStorage(dblightNovel)
}

const readlightNovel = () => getLocalStorage()

const createlightNovel = (lightNovel) => {
    const dblightNovel = getLocalStorage()
    dblightNovel.push (lightNovel)
    setLocalStorage(dblightNovel)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const savelightNovel = () => { //Insert de nova lightNovel
    debugger
    if (isValidFields()) {
        const lightNovel = { //dados cedidos no model
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            capitulo: document.getElementById('capitulo').value,
            data: document.getElementById('data').value,
            conteudo: document.getElementById('conteudo').value
        }
        const index = document.getElementById('nome').dataset.index 
        if (index == 'new') {
            createlightNovel(lightNovel)
            updateTable()
            closeModal()
        } else {
            updatelightNovel(index, lightNovel)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (lightNovel, index) => { //cria as linhas da tabela
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td onclick="editlightNovel(${index})">${lightNovel.nome}</td>
        <td onclick="editlightNovel(${index})">${lightNovel.descricao}</td>
        <td onclick="editlightNovel(${index})">${lightNovel.capitulo}</td>
        <td onclick="editlightNovel(${index})">${lightNovel.data}</td>
        <td onclick="editlightNovel(${index})">${lightNovel.conteudo}</td>
        <td class="red">
        <a type="button" class="infobox-explorebtn selected" id="delete-${index}" >Excluir</a>
        </td>
    `
    document.querySelector('#tablelightNovel>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tablelightNovel>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readlightNovel()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (lightNovel) => {
    document.getElementById('nome').value = lightNovel.nome
    document.getElementById('descricao').value = lightNovel.descricao
    document.getElementById('capitulo').value = lightNovel.capitulo
    document.getElementById('data').value = lightNovel.data
    document.getElementById('conteudo').value = lightNovel.conteudo
    document.getElementById('nome').dataset.index = lightNovel.index
}

const editlightNovel = (index) => {
    const lightNovel = readlightNovel()[index]
    lightNovel.index = index
    fillFields(lightNovel)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editlightNovel(index)
        } else {
            const lightNovel = readlightNovel()[index]
            const response = confirm(`Deseja realmente excluir o capítulo ${lightNovel.nome}`)
            if (response) {
                deletelightNovel(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos


document.getElementById('cadastrarlightNovel')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', savelightNovel)

document.querySelector('#tablelightNovel>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)
