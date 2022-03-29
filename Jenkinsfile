pipeline {
    agent any

    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/barbarafuzzato/testes-api-cy.git'
            }
        }
        stage('Instalar Cypress') {
            steps {
                sh 'npm install cypress'
            }
        }
        stage('Iniciar Serverest') {
            steps {
                sh 'NO_COLOR=1 npm start'
            }
        }
        stage('Instalar dependências') {
            steps {
                sh 'npm install'
            }
        }
        stage('Executar testes') {
            steps {
                sh 'NO_COLOR=1 npm run cy:run'
            }
        }
    }
}
