/// <reference types="cypress" />
var faker = require('faker');
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('rossgeller@friends.com', 'pivot').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.body.usuarios[0].nome).to.contain('Usuário EBAC')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let emailFaker = faker.internet.email()
          let usuario = `Usuário EBAC ${Math.floor(Math.random() * 10000000)}`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": usuario,
                    "email": emailFaker,
                    "password": "teste",
                    "administrador": "false"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          let usuario = `Usuário EBAC ${Math.floor(Math.random() * 10000000)}`
          cy.cadastrarUsuario(token, usuario, "rachelgreen@friends.com", "teste", "false")
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let emailFaker = faker.internet.email()
          let password = `teste${Math.floor(Math.random() * 10000000)}`
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[4]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                         "nome": "Usuário EBAC",
                         "email": emailFaker,
                         "password": password,
                         "administrador": "false"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let emailFaker = faker.internet.email()
          let password = `teste${Math.floor(Math.random() * 10000000)}`
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[9]._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                         "nome": "Usuário EBAC",
                         "email": emailFaker,
                         "password": password,
                         "administrador": "false"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          })

     });



});
